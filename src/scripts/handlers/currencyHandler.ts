import { internalSharedGlobals } from "../important/globals";

const saveCoins = (): void => {
  localStorage.setItem(
    btoa("currency"),
    btoa(internalSharedGlobals.lCoins.toString())
  );
};

const loadCoins = (): number => {
  const savedCoins = localStorage.getItem(btoa("currency"));
  return savedCoins ? parseInt(atob(savedCoins), 10) : 300;
};

export const adjustCoins = (amount: number): boolean => {
  if (internalSharedGlobals.lCoins + amount < 0) {
    return false;
  } else {
    internalSharedGlobals.lCoins += amount;
    saveCoins();
    return true;
  }
};

export const initCoins = (): void => {
  internalSharedGlobals.lCoins = loadCoins();
};

export const dailyBonus = (): boolean => {
  const encoded = btoa("lastBonusDate");
  const lastBonus = localStorage.getItem(encoded);
  const today = new Date().toDateString();

  const encodedDate = btoa(today);

  if (lastBonus !== encodedDate) {
    adjustCoins(300);
    localStorage.setItem(encoded, encodedDate);
    return true;
  }
  return false;
};
