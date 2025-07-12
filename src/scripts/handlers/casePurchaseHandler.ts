// For making sure the case is purchased before use
//! Format for savedata, it just uses the case IDs and we run checks
import {
  internalSharedGlobals,
  uiSharedGlobals,
  globalFunctions,
} from "../important/globals";
import { initializeSelectedGambaCase } from "../important/init";
import { adjustCoins } from "./currencyHandler";

uiSharedGlobals.purchaseBtn.addEventListener("click", () =>
  handlePurchaseCase(internalSharedGlobals.selectedGambaCase.gId)
);

const handlePurchaseCase = (id: number): void => {
  if (internalSharedGlobals.selectedGambaCase.gId === id) {
    const unlockedCases = neededForInitialization.fetchUnlockedCases();

    if (unlockedCases.includes(id)) {
      internalSharedGlobals.popup.show(
        "error",
        `Attempting to purchase case, which is already unlocked. <br>(error ${internalSharedGlobals.popup.errorCodes["purchasingUnlockedCase"]})`
      );
      console.error("why are we trying to purchase this case?");
      return;
    }

    if (adjustCoins(-internalSharedGlobals.selectedGambaCase.price)) {
      unlockedCases.push(id);
      console.log(
        `Unlocking case: ${id}, ${internalSharedGlobals.selectedGambaCase.name}...`
      );

      neededForInitialization.saveUnlocked(unlockedCases);
      globalFunctions.updateButtonState(id);
      initializeSelectedGambaCase(id);
      globalFunctions.updateCoinDisplay();
    } else {
      console.error("User cannot afford case...");
      return;
    }
  }
};

export const neededForInitialization = {
  saveUnlocked: (caseIds: any): void => {
    localStorage.setItem(btoa("unlockedCases"), btoa(JSON.stringify(caseIds)));
  },

  fetchUnlockedCases: (): number[] => {
    const rawData = localStorage.getItem(btoa("unlockedCases"));

    let unlockedCases: number[] = [];
    if (rawData) {
      try {
        const parsedData64 = atob(rawData);
        const parsedData = JSON.parse(parsedData64);
        if (Array.isArray(parsedData)) {
          unlockedCases = parsedData;
        } else if (typeof parsedData === "object" && parsedData !== null) {
          unlockedCases = [parsedData.gId];
        } else {
          internalSharedGlobals.popup.show(
            "error",
            `Unexpected data format in unlockedCases: ${parsedData}<br>(error ${internalSharedGlobals.popup.errorCodes["unexpectedFormat"]})`
          );
          console.error("Unexpected data format in unlockedCases:", parsedData);
        }
      } catch (err) {
        internalSharedGlobals.popup.show(
          "error",
          `Failed to parse unlockedCases: ${err} <br>(error ${internalSharedGlobals.popup.errorCodes["parseUnlockedFailed"]})`
        );
        console.error("Failed to parse unlockedCases:", err);
      }
    }

    if (!unlockedCases.includes(0)) {
      unlockedCases.push(0);
      unlockedCases.push(9999);
      neededForInitialization.saveUnlocked(unlockedCases);
    } else if (!unlockedCases.includes(9999)) {
      unlockedCases.push(9999);
      neededForInitialization.saveUnlocked(unlockedCases);
    }

    return unlockedCases;
  },
};

export const isGambaUnlocked = (gId: number): boolean => {
  const unlockedCases = neededForInitialization.fetchUnlockedCases();
  return unlockedCases.includes(gId);
};
