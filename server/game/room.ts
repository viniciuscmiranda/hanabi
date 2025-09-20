import type { WebSocket } from "ws";

import { Player } from "./player";
import { Game } from "./game";
import { Rules } from "../rules";
import { DeckBuilder } from "./deck-builder";
import { Deck } from "./deck";
import { Board } from "./board";
import { DiscardPile } from "./discard-pile";
import { Messenger } from "../utils/messenger";

import type { Expansion, PlayerEvent } from "../../core/types";

type Client = {
  ws: WebSocket | null;
  player: Player;
};

export class Room {
  public id: string;
  public clients: Client[] = [];
  public leader: Player | null = null;
  public expansions: Expansion[] = [];
  public game: Game | null = null;
  public isPublic = true;
  public allowWatchMode = true;
  private messenger = new Messenger(this);

  constructor() {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.id = `${id.substring(0, 3)}-${id.substring(3)}`;
  }

  public connect(ws: WebSocket) {
    const connectedClients = this.connectedClients;

    if (connectedClients.length >= Rules.MAX_PLAYERS) {
      throw new Error("A sala está cheia.");
    }

    const disconnectedClient = this.disconnectedClients.at(0);

    const player = new Player();
    if (!this.leader) this.leader = player;

    if (this.game && !disconnectedClient) {
      if (!this.allowWatchMode) throw new Error("O jogo já começou.");
      player.isWatching = true;
      this.clients.push({ ws, player });
      this.messenger.sendRoomState();
      this.messenger.sendGameState(ws);
      return player;
    }

    if (disconnectedClient && this.game && !this.game.isGameFinished) {
      this.game.replacePlayer(disconnectedClient.player, player);

      disconnectedClient.ws = ws;
      disconnectedClient.player = player;

      this.messenger.sendGameState();
    } else {
      this.clients.push({ ws, player });
    }

    this.messenger.sendRoomState();
    return player;
  }

  public disconnect(ws: WebSocket) {
    const player = this.getPlayerByConnection(ws);
    if (player === this.leader) {
      this.leader = this.playersInGame.find((p) => p !== player) || null;
    }

    if (player?.isWatching) {
      this.clients = this.clients.filter((client) => client.ws !== ws);
      this.messenger.sendRoomState();
      return player;
    }

    if (this.game) {
      const isLastPlayer = this.playersInGame.length <= 1;

      if (isLastPlayer) {
        this.clients.forEach((client) => {
          if (!client.ws) return;
          this.messenger.sendError(
            new Error("Os jogadores abandonaram a sala."),
            client.ws
          );

          client.ws.close();
        });

        this.game = null;
        this.clients = [];
      } else {
        if (player) this.game.disconnectPlayer(player);
        this.clients = this.clients.map((client) => {
          if (client.player === player) client.ws = null;
          return client;
        });

        this.messenger.sendGameState();
        this.messenger.sendRoomState();
      }
    } else {
      this.clients = this.clients.filter((client) => client.ws !== ws);

      this.players.forEach((player) => {
        player.isReady = false;
      });

      this.messenger.sendRoomState();
    }

    return player;
  }

  public handlePlayerEvent(ws: WebSocket, { event, payload }: PlayerEvent) {
    const player = this.getPlayerByConnection(ws);
    if (!player) throw new Error("Jogador não encontrado.");

    const gameEvents: (typeof event)[] = [
      "PLAYER_PLAY",
      "PLAYER_DISCARD",
      "PLAYER_GIVE_TIP",
    ];

    const leaderEvents: (typeof event)[] = [
      "PLAYER_SET_ROOM_SETTINGS",
      "PLAYER_SET_LEADER",
      "PLAYER_KICK_PLAYER",
    ];

    const roomEvents: (typeof event)[] = [
      "PLAYER_SET_WATCH_MODE",
      "PLAYER_RENAME",
      "PLAYER_READY",
    ];

    if (gameEvents.includes(event) && !this.game) {
      throw new Error("O jogo ainda não começou.");
    } else if (roomEvents.includes(event) && this.game) {
      throw new Error("O jogo já começou.");
    } else if (leaderEvents.includes(event) && player !== this.leader) {
      throw new Error("Somente o líder pode fazer isso.");
    }

    switch (event) {
      case "PLAYER_PLAY": {
        const { wasAddedToTheBoard, drawnCard, playedCard } =
          this.game!.playCard(player, payload.cardIndex);

        this.messenger.sendPlayerPlay(
          this.playersInGame.indexOf(player),
          payload.cardIndex,
          wasAddedToTheBoard,
          playedCard,
          drawnCard
        );

        break;
      }
      case "PLAYER_DISCARD": {
        const { discardedCard, drawnCard } = this.game!.discardCard(
          player,
          payload.cardIndex
        );

        this.messenger.sendPlayerDiscard(
          this.playersInGame.indexOf(player),
          payload.cardIndex,
          discardedCard,
          drawnCard
        );

        break;
      }
      case "PLAYER_GIVE_TIP": {
        const selectedPlayer = this.playersInGame.at(payload.playerIndex);
        if (!selectedPlayer) throw new Error("Jogador não encontrado.");

        const cardIndexes = this.game!.giveTip(
          player,
          selectedPlayer,
          payload.cardIndex,
          payload.info
        );

        this.messenger.sendPlayerGiveTip(
          this.playersInGame.indexOf(player),
          payload.playerIndex,
          payload.cardIndex,
          cardIndexes,
          payload.info
        );

        break;
      }
      case "PLAYER_READY":
        player.isReady = true;
        this.messenger.sendRoomState();

        if (
          this.playersInGame.length >= Rules.MIN_PLAYERS &&
          this.playersInGame.every((player) => player.isReady)
        ) {
          const cards = DeckBuilder.build(this.expansions);

          this.game = new Game(
            this.playersInGame,
            new Deck(cards),
            new Board(this.expansions),
            new DiscardPile()
          );

          this.game.start();
          this.messenger.sendGameState();
        }
        break;
      case "PLAYER_RENAME":
        player.rename();
        this.messenger.sendRoomState();
        break;

      case "PLAYER_SET_WATCH_MODE":
        if (!this.allowWatchMode) {
          throw new Error("O modo espectador não está permitido.");
        }

        player.isWatching = payload.isWatchMode;

        this.players.forEach((player) => {
          player.isReady = false;
        });

        this.messenger.sendRoomState();
        break;
      case "PLAYER_SET_ROOM_SETTINGS":
        if (payload.expansions != undefined) {
          this.expansions = payload.expansions;
        }

        if (payload.isPublic != undefined) {
          this.isPublic = Boolean(payload.isPublic);
        }

        if (payload.allowWatchMode != undefined) {
          this.allowWatchMode = Boolean(payload.allowWatchMode);

          if (!payload.allowWatchMode) {
            this.players.forEach((player) => {
              player.isWatching = false;
              player.isReady = false;
            });
          }
        }

        this.messenger.sendRoomState();
        break;
      case "PLAYER_SET_LEADER":
        const newLeader = this.players.at(payload.playerIndex);
        if (!newLeader) throw new Error("Jogador não encontrado.");
        this.leader = newLeader;
        this.messenger.sendRoomState();
        break;
      case "PLAYER_KICK_PLAYER":
        const kickedClient = this.connectedClients.at(payload.playerIndex);
        if (!kickedClient?.ws) throw new Error("Jogador não encontrado.");
        this.messenger.sendError(
          new Error("Você foi removido da sala."),
          kickedClient.ws
        );

        this.disconnect(kickedClient.ws);
        kickedClient.ws.close();
        this.messenger.sendRoomState();
        break;
      case "PLAYER_REACT":
        this.messenger.sendPlayerReact(payload.reaction);
        break;
      default:
        throw new Error("Evento não encontrado.");
    }

    if (this.game && this.game.isGameFinished) {
      this.game = null;
      this.players.forEach((player) => {
        player.isReady = false;
        player.isWatching = false;
        player.discardHand();
      });

      this.messenger.sendRoomState();
    }
  }

  public get connectedClients() {
    return this.clients.filter((client) => client.ws);
  }

  public get disconnectedClients() {
    return this.clients.filter((client) => !client.ws);
  }

  public get players() {
    return this.clients.map((client) => client.player);
  }

  public get playersInGame() {
    return this.players.filter(
      (player) => !player.isWatching && player.isConnected
    );
  }

  public getPlayerByConnection(ws: WebSocket) {
    return this.clients.find((client) => client.ws === ws)?.player;
  }
}
