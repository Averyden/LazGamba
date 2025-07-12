// For making sure the case is purchased before use
//! Format for savedata, it just uses the case IDs and we run checks
import {
  internalSharedGlobals,
  uiSharedGlobals,
  globalFunctions,
} from "../important/globals";

import {
  fetchUnlockedCases,
  saveUnlocked,
  isGambaUnlocked,
} from "../utils/unlockUtils";

import { initializeSelectedGambaCase } from "../important/init";
import { adjustCoins } from "./currencyHandler";

uiSharedGlobals.purchaseBtn.addEventListener("click", () =>
  handlePurchaseCase(internalSharedGlobals.selectedGambaCase.gId)
);

const handlePurchaseCase = (id: number): void => {
  if (internalSharedGlobals.selectedGambaCase.gId === id) {
    const unlockedCases = fetchUnlockedCases();

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

      saveUnlocked(unlockedCases);
      globalFunctions.updateButtonState(id);
      initializeSelectedGambaCase(id);
      globalFunctions.updateCoinDisplay();
    } else {
      console.error("User cannot afford case...");
      return;
    }
  }
};
