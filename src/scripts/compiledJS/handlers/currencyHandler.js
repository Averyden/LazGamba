"use strict";
let lCoins = 300;
const saveCoins = () => {
    localStorage.setItem(btoa("currency"), btoa(lCoins.toString()));
};
const loadCoins = () => {
    const savedCoins = localStorage.getItem(btoa("currency"));
    return savedCoins ? parseInt(atob(savedCoins), 10) : 300;
};
const adjustCoins = (amount) => {
    if (lCoins + amount < 0) {
        return false;
    }
    else {
        lCoins += amount;
        saveCoins();
        return true;
    }
};
const initCoins = () => {
    lCoins = loadCoins();
};
const dailyBonus = () => {
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
