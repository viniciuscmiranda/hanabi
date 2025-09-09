const MALE_ANIMALS = [
  "Rato",
  "Hamster",
  "Esquilo",
  "Camundongo",
  "Castor",
  "Gabiru",
];

const FEMALE_ANIMALS = [
  "Marmota",
  "Capivara",
  "Chinchila",
  "Topeira",
  "Ratazana",
];

const NEUTRAL_ADJECTIVES = [
  "Serelepe",
  "Tchola",
  "Sapeca",
  "Mequetrefe",
  "Besta",
];

const MALE_ADJECTIVES = [
  "Deprimido",
  "Bobão",
  "Espertinho",
  "Emburrado",
  "Estranho",
  "Preguiçoso",
  "Inchado",
];

const FEMALE_ADJECTIVES = [
  "Deprimida",
  "Bobona",
  "Espertinha",
  "Emburrada",
  "Estranha",
  "Preguiçosa",
  "Inchada",
];

function random<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateName() {
  const animal = random([...MALE_ANIMALS, ...FEMALE_ANIMALS]);

  const adjective = random([
    ...NEUTRAL_ADJECTIVES,
    ...(MALE_ANIMALS.includes(animal) ? MALE_ADJECTIVES : FEMALE_ADJECTIVES),
  ]);

  return `${animal} ${adjective}`;
}
