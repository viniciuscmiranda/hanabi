import { z } from "zod";
import type { PlayerEvent } from "../../core/types";

export function validateMessage(message: any) {
  const playerReadySchema = z.object({
    event: z.literal("PLAYER_READY"),
    payload: z.undefined(),
  });

  const playerPlaySchema = z.object({
    event: z.literal("PLAYER_PLAY"),
    payload: z.strictObject({
      cardIndex: z.number(),
    }),
  });

  const playerDiscardSchema = z.object({
    event: z.literal("PLAYER_DISCARD"),
    payload: z.strictObject({
      cardIndex: z.number(),
    }),
  });

  const playerGiveTipSchema = z.object({
    event: z.literal("PLAYER_GIVE_TIP"),
    payload: z.strictObject({
      playerIndex: z.number(),
      cardIndex: z.number(),
      info: z.enum(["value", "color"]),
    }),
  });

  const playerRenameSchema = z.object({
    event: z.literal("PLAYER_RENAME"),
    payload: z.undefined(),
  });

  const playerSetWatchModeSchema = z.object({
    event: z.literal("PLAYER_SET_WATCH_MODE"),
    payload: z.strictObject({
      isWatchMode: z.boolean(),
    }),
  });

  const playerSetRoomSettingsSchema = z.object({
    event: z.literal("PLAYER_SET_ROOM_SETTINGS"),
    payload: z.strictObject({
      expansions: z
        .array(z.enum(["avalanche_of_colors", "black_powder"]))
        .optional(),
      isPublic: z.boolean().optional(),
      allowWatchMode: z.boolean().optional(),
    }),
  });

  const playerSetLeaderSchema = z.object({
    event: z.literal("PLAYER_SET_LEADER"),
    payload: z.strictObject({
      playerIndex: z.number(),
    }),
  });

  const playerKickPlayerSchema = z.object({
    event: z.literal("PLAYER_KICK_PLAYER"),
    payload: z.strictObject({
      playerIndex: z.number(),
    }),
  });

  const playerReactSchema = z.object({
    event: z.literal("PLAYER_REACT"),
    payload: z.strictObject({
      reaction: z.emoji(),
    }),
  });

  const schema = z.union([
    playerReadySchema,
    playerPlaySchema,
    playerDiscardSchema,
    playerGiveTipSchema,
    playerRenameSchema,
    playerSetWatchModeSchema,
    playerSetRoomSettingsSchema,
    playerSetLeaderSchema,
    playerKickPlayerSchema,
    playerReactSchema,
  ]);

  try {
    return schema.parse(message) as PlayerEvent;
  } catch (error) {
    throw new Error("Mensagem inválida");
  }
}
