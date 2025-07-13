// This may seem redundant, but this is just initializing stuff for the site, like setting currency and such.
// This is only so that the handlers dont get cluttered with useless stuff
import {
  isGambaUnlocked,
  fetchUnlockedCases,
  saveUnlocked,
} from "../utils/unlockUtils";
import { initCoins, dailyBonus } from "../handlers/currencyHandler";
import { GambaHandler } from "../handlers/gambaHandler";
import { setGambaHandler } from "../helpers/gambaHandlerInstance";

import { IGambaCase } from "../utils/IGambaCase";

import { config } from "./config";

import {
  internalSharedGlobals,
  uiSharedGlobals,
  globalFunctions,
} from "./globals";

let heavenCase: any;

initCoins();
const bah = fetchUnlockedCases();
saveUnlocked(bah);

const body = document.body;
body.style.transition = "background-color 1s ease";
const pricelbl = uiSharedGlobals.pricelbl;
const namelbl = uiSharedGlobals.namelbl;
const purchaseBtn = uiSharedGlobals.purchaseBtn;

const infoButton = document.getElementById("caseTip") as HTMLButtonElement;

let handler: GambaHandler | null = null;

infoButton.addEventListener("click", () => {
  internalSharedGlobals.popup.show("caseInfo", sendCaseInfoMessage(), {
    name: internalSharedGlobals.selectedGambaCase.name as string,
  });
});

const fetchJsonData = async (): Promise<IGambaCase[] | undefined> => {
  try {
    const response = await fetch("src/dictionaries/gambaSelection.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData.gambaCases;
  } catch (error) {
    internalSharedGlobals.popup.show(
      "error",
      `Error loading or parsing gambaSelection.json: ${error} <br>(error ${internalSharedGlobals.popup.errorCodes["gambaSelectErrorParse"]})`
    );
  }
};

const countCases = async () => {
  internalSharedGlobals.gambaCases = (await fetchJsonData()) as IGambaCase[];

  const normalCases = internalSharedGlobals.gambaCases.filter(
    (c) => c.gId !== 9999
  );
  internalSharedGlobals.maxCases = normalCases.length - 1; // take one away to account for 0-index

  // TODO: handle heavenly case separately if needed
};

countCases();

const sendCaseInfoMessage = (): string => {
  let curCaseUnlockedVar;

  if (isGambaUnlocked(internalSharedGlobals.selectedGambaCase.gId)) {
    curCaseUnlockedVar = true;
  } else {
    curCaseUnlockedVar = false;
  }

  return `
    Internal id: ${internalSharedGlobals.selectedGambaCase.gId}<br>
    Price per spin: ${internalSharedGlobals.selectedGambaCase.cost}<br>
    Return multiplier: ${internalSharedGlobals.selectedGambaCase.winMult}<br>
    Jackpot rate: 1/${internalSharedGlobals.selectedGambaCase.rate}<br>
    Unlocked: ${curCaseUnlockedVar}`;
};

export const initializeSelectedGambaCase = async (gId: number) => {
  try {
    internalSharedGlobals.gambaCases = (await fetchJsonData()) as IGambaCase[];
    heavenCase = internalSharedGlobals.gambaCases.find(
      (gCase: any) => gCase.gId === 9999
    );

    internalSharedGlobals.selectedGambaCase =
      internalSharedGlobals.gambaCases.find((gCase: any) => gCase.gId === gId);
    internalSharedGlobals.caseID = gId;

    if (isGambaUnlocked(gId)) {
      body.style.background =
        internalSharedGlobals.selectedGambaCase.background;
      body.style.filter = "";
      if (gId !== heavenCase.gId) {
        //TODO: ensure this isnt cosmetic and actually make the cost be its old cost when switching to heaven
        pricelbl.innerHTML = `Price to spin: ${internalSharedGlobals.selectedGambaCase.cost}`;
        internalSharedGlobals.cachedID =
          internalSharedGlobals.selectedGambaCase.gId;
      }
    } else {
      body.style.background = "#bbbbbb";
      pricelbl.innerHTML = `Price to unlock: ${internalSharedGlobals.selectedGambaCase.price}`;
    }

    if (namelbl.innerHTML == "Error fetching name of gamba...") {
      namelbl.innerHTML = internalSharedGlobals.selectedGambaCase.name; // Set it to the name if it isnt loaded yet.
    }

    if (internalSharedGlobals.selectedGambaCase) {
      console.log(
        `Selected Gamba Case:`,
        internalSharedGlobals.selectedGambaCase
      );
      handler?.updateCase(internalSharedGlobals.selectedGambaCase); //TODO: ensure that making this nullable doesnt fuck literally everything up
      namelbl.classList.add("outInFadeName");
      purchaseBtn.classList.add("outInFadeName");

      purchaseBtn.disabled = true;
      uiSharedGlobals.changeLeft.disabled = true;
      uiSharedGlobals.changeRight.disabled = true;

      setTimeout(() => {
        namelbl.innerHTML = internalSharedGlobals.selectedGambaCase.name;
      }, 500);

      setTimeout(() => {
        namelbl.classList.remove("outInFadeName");
        purchaseBtn.classList.remove("outInFadeName");
        uiSharedGlobals.changeLeft.disabled = false;
        purchaseBtn.disabled = false;
        uiSharedGlobals.changeRight.disabled = false;
      }, 1000);
    } else {
      console.warn(`No Gamba Case found with gId: ${gId}`);
    }
  } catch (error) {
    console.error("Error loading or parsing gambaSelection.json:", error);
  }
};

const initializeHandler = async () => {
  await initializeSelectedGambaCase(0);
  if (internalSharedGlobals.selectedGambaCase) {
    handler = new GambaHandler();
    setGambaHandler(handler);

    console.log("Handler initialized");
  } else {
    internalSharedGlobals.popup.show(
      "error",
      `Error: selectedGambaCase is still null, handler unable to initialize. <br>(error ${internalSharedGlobals.popup.errorCodes["cantLoadHandlerCauseGambaSelectIsNull"]})`
    );
    console.error(
      "Error: selectedGambaCase is still null, handler cannot be initialized."
    );
  }
};

initializeHandler();

if (dailyBonus()) {
  console.log("Awarded daily bonus/reset");
  globalFunctions.updateCoinDisplay();
} else {
  console.log("Daily bonus/reset is already claimed.");
}

globalFunctions.updateCoinDisplay();

const updateVersionDisplay = () => {
  const identifier = document.getElementById(
    "versionIdentifier"
  ) as HTMLHeadingElement;

  identifier.innerHTML = `LazGamba Version: ${config.versionNumber}`;
};

updateVersionDisplay();

globalFunctions.loadGambaMessages();
