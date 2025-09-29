const MALE_ANIMALS = [
  "Rato",
  "Hamster",
  "Esquilo",
  "Camundongo",
  "Castor",
  "Gabiru",
  "Porquinho-da-índia",
  "Tatu",
  "Coelho",
  "Furão",
  "Porco-espinho",
  "Ouriço",
  "Lêmure",
  "Morcego",
  "Esquilo-voador",
  "Arminho",
];

const FEMALE_ANIMALS = [
  "Marmota",
  "Capivara",
  "Chinchila",
  "Topeira",
  "Ratazana",
  "Lontra",
  "Lebre",
  "Doninha",
  "Rata",
  "Fuinha",
  "Camundonga",
  "Equidna",
];

const NEUTRAL_ADJECTIVES = [
  "Serelepe",
  "Mequetrefe",
  "Triste",
  "Infeliz",
  "Inteligente",
  "Vidente",
  "Banguela",
  "Cegueta",
  "Carente",
  "de iPhone",
  "Ciclista",
  "Motorista",
  "Cientista",
  "Futurista",
  "Taxista",
  "Jovem",
  "de Schrödinger",
  "do BTS",
  "da Twitch",
  "Youtuber",
];

const MALE_ADJECTIVES = [
  "Deprimido",
  "Bobão",
  "Espertinho",
  "Emburrado",
  "Estranho",
  "Preguiçoso",
  "Transtornado",
  "Cabuloso",
  "Parrudo",
  "Maluco",
  "Doidão",
  "Burro",
  "Fedido",
  "Curioso",
  "Fofoqueiro",
  "Matemático",
  "Voador",
  "Motoqueiro",
  "Piloto",
  "Místico",
  "Quântico",
  "Twitteiro",
];

const FEMALE_ADJECTIVES = [
  "Deprimida",
  "Bobona",
  "Espertinha",
  "Emburrada",
  "Estranha",
  "Preguiçosa",
  "Cabulosa",
  "Maluca",
  "Doidona",
  "Curiosa",
  "Fofoqueira",
  "Matemática",
  "Voadora",
  "Motoqueira",
  "Pilota",
  "Mística",
  "Quântica",
  "Twitteira",
];

function random<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generatePlayerName() {
  const DISABLE_ADJECTIVES = process.env.SERVER_DISABLE_ADJECTIVES === "true";

  const animal = random([...MALE_ANIMALS, ...FEMALE_ANIMALS]);

  const adjective = DISABLE_ADJECTIVES
    ? ""
    : " ".concat(
        random([
          ...NEUTRAL_ADJECTIVES,
          ...(MALE_ANIMALS.includes(animal)
            ? MALE_ADJECTIVES
            : FEMALE_ADJECTIVES),
        ])
      );

  return `${animal}${adjective}`;
}
