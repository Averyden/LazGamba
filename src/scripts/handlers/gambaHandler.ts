import {
  internalSharedGlobals,
  uiSharedGlobals,
  dictionaries,
  images,
  globalFunctions,
} from "../important/globals";

import { initializeSelectedGambaCase } from "../important/init";
import { adjustCoins } from "./currencyHandler";
import { maybeInjectHeavenlyCase } from "./rareOccurancesHandler";
import { getRanMessage } from "../utils/gambaHandlerUtils";

export class GambaHandler {
  private pricePerGamba: number = 50;
  private jackpotNumber: number = 0;
  private jackpotRange: number[] = [];
  private winMult: number = 2;
  private curCase: any;
  private curPityScore: number = 0;
  private heavenInjected: boolean = false;

  constructor() {
    if (!internalSharedGlobals.selectedGambaCase) {
      console.warn("selectedGambaCase is not yet defined, using default case.");
      this.updateCase({ gId: -1, cost: 50, winMult: 2, rate: 10 });
    } else {
      this.updateCase(internalSharedGlobals.selectedGambaCase);
    }
  }

  updateCase(curCase: any): void {
    if (!curCase) {
      internalSharedGlobals.popup.show(
        "error",
        `Error in updating variables, as no case was selected. <br>(error ${internalSharedGlobals.popup.errorCodes["updateVarFail"]})`
      );
      console.error(
        "Error in updating variables:\nNo case was selected\n\nDefaulting..."
      );
      this.curCase = { gId: -1, cost: 50, winMult: 2, rate: 10 };
    } else {
      this.curCase = curCase;
    }

    this.pricePerGamba = this.curCase.cost;
    this.winMult = this.curCase.winMult;

    //* Adjusted logic for jackpot range.
    const jackpotLength = Math.round(100 / this.curCase.rate);
    const minLength = 10;
    const maxLength = 1000;
    const finalLength = Math.min(Math.max(jackpotLength, minLength), maxLength);

    this.jackpotRange = Array.from({ length: finalLength }, (_, i) => i);

    this.jackpotNumber =
      this.jackpotRange[Math.floor(Math.random() * this.jackpotRange.length)];

    console.log(`Updated to case:`, this.curCase);
    console.log(`Jackpot number(s):`, this.jackpotRange);
  }

  async handleGambaCalc(): Promise<void> {
    const gambaImg = document.getElementById(
      "gambaStatusImg"
    ) as HTMLImageElement;
    const gambaStatus = document.getElementById(
      "gambaStatus"
    ) as HTMLHeadingElement;

    const activeCase = maybeInjectHeavenlyCase(this.curCase);

    let timeOutCancel = false;

    if (!this.heavenInjected && activeCase.gId === 9999) {
      initializeSelectedGambaCase(activeCase.gId);
      this.heavenInjected = true;
      uiSharedGlobals.namelbl.classList.add("rainbow");
      hideCaseChangeButtons();
    } else if (this.heavenInjected === true && activeCase.gId === 9999) {
      this.heavenInjected = false;
      initializeSelectedGambaCase(internalSharedGlobals.cachedID);
      showCaseChangeButtons();
      uiSharedGlobals.namelbl.classList.remove("rainbow");
    }

    if (!adjustCoins(-activeCase.cost)) {
      gambaStatus.innerHTML = "HAH you're poor! come back tomorrow.";
      gambaImg.src = images.find((img) => img.name === "noMoney")!.path;
      timeOutCancel = true;
      return;
    }

    let chance = 0;

    globalFunctions.updateCoinDisplay();

    gambaStatus.classList.remove("disappear");
    gambaStatus.innerHTML = "";

    if (finalMessageTimeout !== undefined) {
      clearTimeout(finalMessageTimeout);
    }

    gambaImg.src = images.find((img) => img.name === "spinning")!.path;
    gambaImg.classList.add("spinningAnim");

    if (this.curPityScore !== activeCase.pityReq) {
      chance = Math.floor(Math.random() * 100);
    } else {
      console.log("pity hit");
      chance = activeCase.pityReq;
    }

    const jackpotLength = Math.round(100 / activeCase.rate);
    const clampedLength = Math.min(Math.max(jackpotLength, 10), 1000);
    const dynamicRange = Array.from({ length: clampedLength }, (_, i) => i);
    const gambaWin = dynamicRange.includes(chance);

    if (Object.keys(dictionaries.gambaMessages).length === 0) {
      await globalFunctions.loadGambaMessages();
    }

    setTimeout(() => {
      if (gambaWin) {
        this.curPityScore = 0;
        console.log("Winner, reset pity");
        gambaImg.src = images.find((img) => img.name === "win")!.path;
      } else {
        this.curPityScore += 1;
        console.log("Loser, add pity");
        gambaImg.src = images.find((img) => img.name === "loss")!.path;
      }
    }, 1750);

    setTimeout(() => {
      this.heavenInjected
        ? (uiSharedGlobals.pricelbl.innerHTML = "Next spin is free!")
        : ` Price to spin: ${internalSharedGlobals.selectedGambaCase.cost}`;
      gambaImg.classList.remove("spinningAnim");

      if (gambaWin) {
        gambaStatus.innerHTML = getRanMessage(
          "win",
          dictionaries.gambaMessages
        );
        adjustCoins(activeCase.cost * activeCase.winMult);
        globalFunctions.updateCoinDisplay();
      } else {
        gambaStatus.innerHTML = getRanMessage(
          "loss",
          dictionaries.gambaMessages
        );
      }
    }, 2000);

    finalMessageTimeout = setTimeout(() => {
      if (!timeOutCancel) {
        gambaStatus.innerHTML = "maybe you should spin again >:3";
        gambaStatus.classList.add("disappear");
      }
    }, 7000);
  }
}

uiSharedGlobals?.changeLeft.addEventListener("click", () =>
  handleChange("left")
);
uiSharedGlobals?.changeRight.addEventListener("click", () =>
  handleChange("right")
);

let finalMessageTimeout: number | undefined;

//TODO: Move these functions into the util as they handle UI updates and not actual logic (same goes for the handleChange function)
function handleChange(direction: string): void {
  switch (direction) {
    case "left":
      initializeSelectedGambaCase((internalSharedGlobals.caseID -= 1));

      if (internalSharedGlobals.caseID <= 0) {
        uiSharedGlobals.changeLeft.style.transform = "translateY(10000%)";
      }

      if (internalSharedGlobals.caseID < internalSharedGlobals.maxCases) {
        uiSharedGlobals.changeRight.style.transform = "translateY(0%)";
      }

      break;

    case "right":
      if (internalSharedGlobals.caseID <= 0) {
        uiSharedGlobals.changeLeft.style.transform = "translateY(0%)";
      }

      if (internalSharedGlobals.caseID >= internalSharedGlobals.maxCases - 1) {
        // we remove 1 from it because it doesnt actually update, woops
        uiSharedGlobals.changeRight.style.transform = "translateY(10000%)";
      }

      initializeSelectedGambaCase((internalSharedGlobals.caseID += 1));

      break;
    default:
      internalSharedGlobals.popup.show(
        "error",
        `Invalid case switch request. <br>(error ${internalSharedGlobals.popup.errorCodes["invalidLeftRightResult"]})`
      );
      console.error("Invalid request sent to change");
      break;
  }
  globalFunctions.updateButtonState(internalSharedGlobals.caseID);
}

function hideCaseChangeButtons(): void {
  uiSharedGlobals.changeLeft.style.transform = "translateY(10000%)";
  uiSharedGlobals.changeRight.style.transform = "translateY(10000%)";
}

function showCaseChangeButtons(): void {
  if (internalSharedGlobals.cachedID <= 0) {
    uiSharedGlobals.changeLeft.style.transform = "translateY(10000%)";
  } else {
    uiSharedGlobals.changeLeft.style.transform = "translateY(0%)";
  }

  if (internalSharedGlobals.cachedID >= internalSharedGlobals.maxCases - 1) {
    uiSharedGlobals.changeRight.style.transform = "translateY(10000%)";
  } else {
    uiSharedGlobals.changeRight.style.transform = "translateY(0%)";
  }
}
