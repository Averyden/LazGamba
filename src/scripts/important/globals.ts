//! Globals used in several files

import { isGambaUnlocked } from "../handlers/casePurchaseHandler";
import { Popup } from "../handlers/popupHandler";

export const internalSharedGlobals = {
  selectedGambaCase: null as any,
  gambaCases: [] as any[],
  caseID: 0 as number,
  cachedID: 0 as number,
  popup: new Popup("popupContainer"),
  maxCases: 14 as number, //TODO: Make this dynamic INSTEAD of hard-coded
  lCoins: 300 as number,
};

export const uiSharedGlobals = {
  changeRight: document.getElementById("changeCaseRight") as HTMLButtonElement,
  changeLeft: document.getElementById("changeCaseleft") as HTMLButtonElement,
  purchaseBtn: document.getElementById("purchaseCaseBtn") as HTMLButtonElement,
  namelbl: document.getElementById("caseName") as HTMLHeadingElement,
  pricelbl: document.getElementById("gambaCost") as HTMLHeadingElement,
  gambaButton: document.getElementById("gambaBtn") as HTMLButtonElement,
  lblCoins: document.getElementById("coinLabel") as HTMLDivElement,
};

export const images = [
  { name: "loss", path: "assets/img/GAMBA imgs/loss.webp" }, // User didnt win anything.
  { name: "spinning", path: "assets/img/GAMBA imgs/speen.webp" }, // for when the user has pressed the button and we are calculating the chances of a win.
  { name: "win", path: "assets/img/GAMBA imgs/win.png" }, // static win image because paint.net cant make gifs!
  { name: "noMoney", path: "assets/img/GAMBA imgs/noMoreMoney.webp" }, // User lost it all for the day.
  { name: "waiting", path: "assets/img/GAMBA imgs/waiting.webp" },
];

export const dictionaries = {
  gambaMessages: {} as any,
};

export const globalFunctions = {
  updateButtonState(gId: number): void {
    const isUnlocked = isGambaUnlocked(gId);

    if (isUnlocked) {
      uiSharedGlobals.gambaButton.disabled = false;
      uiSharedGlobals.gambaButton.style.opacity = "1";

      setTimeout(() => {
        uiSharedGlobals.purchaseBtn.style.transform = "translateY(10000%)";
      }, 500);
    } else {
      uiSharedGlobals.gambaButton.disabled = true;
      uiSharedGlobals.gambaButton.style.opacity = "0.5";
      setTimeout(() => {
        uiSharedGlobals.purchaseBtn.style.transform = "translateY(0%)";
      }, 500);
    }
  },

  updateCoinDisplay: (): void => {
    if (uiSharedGlobals.lblCoins) {
      uiSharedGlobals.lblCoins.innerText = `L-coins: ${internalSharedGlobals.lCoins}`;
    }
  },

  loadGambaMessages: async () => {
    try {
      const response = await fetch(
        "src/dictionaries/mainGambaDictionaries.json"
      );
      const text = await response.text();
      console.log("Raw Response:", text);
      dictionaries.gambaMessages = JSON.parse(text);
      console.log("Parsed Messages:", dictionaries.gambaMessages);
    } catch (error) {
      internalSharedGlobals.popup.show(
        "error",
        `Error loading or parsing JSON: ${error} <br>(error ${internalSharedGlobals.popup.errorCodes["baseJSONError"]})`
      );
      console.error("Error loading or parsing JSON:", error);
    }
  },
};

// export let cachedSelectedCase: {
//   gId: number;
//   price: number;
//   name: string;
// } | null = null;
