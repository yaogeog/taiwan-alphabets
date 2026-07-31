import alphabetTaigi from "./alphabetTaigi";
import alphabetHakka from "./alphabetHakka";

export const getAlphabets = (lang) => {
  if (lang === "taigi") return alphabetTaigi;
  if (lang === "hakka") return alphabetHakka;
  return alphabetTaigi;
};
