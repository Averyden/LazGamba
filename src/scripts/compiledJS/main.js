// src/scripts/handlers/popupHandler.ts
var Popup = class {
  constructor(container) {
    this.errorCodes = {
      //* Popup error codes, 1x as prefix
      unknownType: "1x5638",
      unknownConfig: "1x5861",
      //* case purchashing error codes, 2x as prefix
      unexpectedFormat: "2x8753",
      parseUnlockedFailed: "2x6528",
      purchasingUnlockedCase: "2x5268",
      //* gamba handler error codes, 3x as prefix
      updateVarFail: "3x8659",
      handlerNotInitWhenHandlingCalc: "3x4672",
      invalidLeftRightResult: "3x6482",
      //* init.ts error codes, 4x as prefix
      gambaSelectErrorParse: "4x1597",
      cantLoadHandlerCauseGambaSelectIsNull: "4x4724",
      baseJSONError: "4x2467"
    };
    this.container = document.getElementById(container);
    this.titleElement = this.container.querySelector(
      "#popupTitle"
    );
    this.messageElement = this.container.querySelector(
      "#popupText"
    );
    this.confirmButton = this.container.querySelector(
      "#btnConfirm"
    );
    this.cancelButton = this.container.querySelector(
      "#btnCancel"
    );
    this.cancelButton.addEventListener("click", () => this.hide());
    this.config = {
      caseInfo: {
        title: "You shouldn't be able to see me",
        confirmText: "OK",
        onConfirm: this.hide
      },
      error: {
        title: "Error",
        confirmText: "OK",
        onConfirm: this.hide
      }
    };
  }
  show(type, message = "No message provided.", extraData) {
    let config2 = this.config[type];
    if (!config2) {
      const errCode = this.errorCodes["unknownType"];
      message = `Unknown popup type "${type}"<br>(error ${errCode})`;
      config2 = this.config["error"];
    }
    if (config2 === this.config["error"] || config2 === this.config["caseInfo"]) {
      this.cancelButton.style.display = "none";
    }
    this.titleElement.textContent = config2.title;
    this.messageElement.innerHTML = message;
    this.confirmButton.textContent = config2.confirmText;
    if (config2 === this.config["caseInfo"] && extraData?.name) {
      this.titleElement.textContent = `Info for: ${extraData.name}`;
    }
    const newConfirmButton = this.confirmButton.cloneNode(
      true
    );
    this.confirmButton.replaceWith(newConfirmButton);
    this.confirmButton = newConfirmButton;
    this.confirmButton.addEventListener("click", config2.onConfirm.bind(this));
    this.container.classList.add("visible");
  }
  hide() {
    this.container.classList.remove("visible");
  }
};

// src/scripts/utils/emergencyUtils.ts
var utilityPopup = new Popup("popupContainer");

// src/scripts/helpers/gambaHandlerInstance.ts
var handler = null;
function setGambaHandler(instance) {
  handler = instance;
}
function getGambaHandler() {
  return handler;
}

// src/scripts/utils/gambaHandlerUtils.ts
var gambaButton = document.getElementById(
  "gambaBtn"
);
gambaButton.addEventListener("click", () => {
  const handler3 = getGambaHandler();
  if (!handler3) {
    utilityPopup.show(
      "error",
      `Error when handling gamba calculations, handler is not yet initialized. <br>(error ${utilityPopup.errorCodes["handlerNotInitWhenHandlingCalc"]})`
    );
    console.error("Handler not initialized yet.");
    return;
  }
  handler3.handleGambaCalc();
});
function getRanMessage(type, messageDictionary) {
  const messages = messageDictionary[type === "win" ? "winMessages" : "lossMessages"];
  if (!messages || messages.length === 0) {
    return "Message not available.";
  }
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex].message;
}

// src/scripts/utils/unlockUtils.ts
var fetchUnlockedCases = () => {
  const rawData = localStorage.getItem(btoa("unlockedCases"));
  let unlockedCases = [];
  if (rawData) {
    try {
      const parsedData64 = atob(rawData);
      const parsedData = JSON.parse(parsedData64);
      if (Array.isArray(parsedData)) {
        unlockedCases = parsedData;
      } else if (typeof parsedData === "object" && parsedData !== null) {
        unlockedCases = [parsedData.gId];
      } else {
        utilityPopup.show(
          "error",
          `Unexpected data format in unlockedCases: ${parsedData}<br>(error ${utilityPopup.errorCodes["unexpectedFormat"]})`
        );
        console.error("Unexpected data format in unlockedCases:", parsedData);
      }
    } catch (err) {
      utilityPopup.show(
        "error",
        `Failed to parse unlockedCases: ${err} <br>(error ${utilityPopup.errorCodes["parseUnlockedFailed"]})`
      );
      console.error("Failed to parse unlockedCases:", err);
    }
  }
  if (!unlockedCases.includes(0)) {
    unlockedCases.push(0);
    unlockedCases.push(9999);
    saveUnlocked(unlockedCases);
  } else if (!unlockedCases.includes(9999)) {
    unlockedCases.push(9999);
    saveUnlocked(unlockedCases);
  }
  return unlockedCases;
};
var isGambaUnlocked = (gId) => {
  const unlockedCases = fetchUnlockedCases();
  return unlockedCases.includes(gId);
};
var saveUnlocked = (caseIds) => {
  localStorage.setItem(btoa("unlockedCases"), btoa(JSON.stringify(caseIds)));
};

// src/scripts/important/globals.ts
var internalSharedGlobals = {
  selectedGambaCase: null,
  gambaCases: [],
  caseID: 0,
  cachedID: 0,
  popup: new Popup("popupContainer"),
  maxCases: 0,
  //TODO: Make this dynamic INSTEAD of hard-coded
  lCoins: 300
};
var uiSharedGlobals = {
  changeRight: document.getElementById("changeCaseRight"),
  changeLeft: document.getElementById("changeCaseleft"),
  purchaseBtn: document.getElementById("purchaseCaseBtn"),
  namelbl: document.getElementById("caseName"),
  pricelbl: document.getElementById("gambaCost"),
  lblCoins: document.getElementById("coinLabel")
};
var images = [
  { name: "loss", path: "assets/img/GAMBA imgs/loss.webp" },
  // User didnt win anything.
  { name: "spinning", path: "assets/img/GAMBA imgs/speen.webp" },
  // for when the user has pressed the button and we are calculating the chances of a win.
  { name: "win", path: "assets/img/GAMBA imgs/win.png" },
  // static win image because paint.net cant make gifs!
  { name: "noMoney", path: "assets/img/GAMBA imgs/noMoreMoney.webp" },
  // User lost it all for the day.
  { name: "waiting", path: "assets/img/GAMBA imgs/waiting.webp" }
];
var dictionaries = {
  gambaMessages: {}
};
var globalFunctions = {
  updateButtonState(gId) {
    const isUnlocked = isGambaUnlocked(gId);
    if (isUnlocked) {
      gambaButton.disabled = false;
      gambaButton.style.opacity = "1";
      setTimeout(() => {
        uiSharedGlobals.purchaseBtn.style.transform = "translateY(10000%)";
      }, 500);
    } else {
      gambaButton.disabled = true;
      gambaButton.style.opacity = "0.5";
      setTimeout(() => {
        uiSharedGlobals.purchaseBtn.style.transform = "translateY(0%)";
      }, 500);
    }
  },
  updateCoinDisplay: () => {
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
  }
};

// src/scripts/handlers/currencyHandler.ts
var saveCoins = () => {
  localStorage.setItem(
    btoa("currency"),
    btoa(internalSharedGlobals.lCoins.toString())
  );
};
var loadCoins = () => {
  const savedCoins = localStorage.getItem(btoa("currency"));
  return savedCoins ? parseInt(atob(savedCoins), 10) : 300;
};
var adjustCoins = (amount) => {
  if (internalSharedGlobals.lCoins + amount < 0) {
    return false;
  } else {
    internalSharedGlobals.lCoins += amount;
    saveCoins();
    return true;
  }
};
var initCoins = () => {
  internalSharedGlobals.lCoins = loadCoins();
};
var dailyBonus = () => {
  const encoded = btoa("lastBonusDate");
  const lastBonus = localStorage.getItem(encoded);
  const today = (/* @__PURE__ */ new Date()).toDateString();
  const encodedDate = btoa(today);
  if (lastBonus !== encodedDate) {
    adjustCoins(300);
    localStorage.setItem(encoded, encodedDate);
    return true;
  }
  return false;
};

// src/scripts/handlers/rareOccurancesHandler.ts
var maybeInjectHeavenlyCase = (currentCase) => {
  const heavenlyChance = 0.04;
  const rng = Math.random();
  if (rng < heavenlyChance) {
    const heavenly = internalSharedGlobals.gambaCases.find(
      (gCase) => gCase.gId === 9999
    );
    if (heavenly) {
      console.log(currentCase.cost);
      return { ...heavenly, cost: currentCase.cost };
    }
  }
  return currentCase;
};

// src/scripts/handlers/gambaHandler.ts
var GambaHandler = class {
  constructor() {
    this.pricePerGamba = 50;
    this.jackpotNumber = 0;
    this.jackpotRange = [];
    this.winMult = 2;
    this.curPityScore = 0;
    this.heavenInjected = false;
    if (!internalSharedGlobals.selectedGambaCase) {
      console.warn("selectedGambaCase is not yet defined, using default case.");
      this.updateCase({ gId: -1, cost: 50, winMult: 2, rate: 10 });
    } else {
      this.updateCase(internalSharedGlobals.selectedGambaCase);
    }
  }
  updateCase(curCase) {
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
    const jackpotLength = Math.round(100 / this.curCase.rate);
    const minLength = 10;
    const maxLength = 1e3;
    const finalLength = Math.min(Math.max(jackpotLength, minLength), maxLength);
    this.jackpotRange = Array.from({ length: finalLength }, (_, i) => i);
    this.jackpotNumber = this.jackpotRange[Math.floor(Math.random() * this.jackpotRange.length)];
    console.log(`Updated to case:`, this.curCase);
    console.log(`Jackpot number(s):`, this.jackpotRange);
  }
  async handleGambaCalc() {
    const gambaImg = document.getElementById(
      "gambaStatusImg"
    );
    const gambaStatus = document.getElementById(
      "gambaStatus"
    );
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
      gambaImg.src = images.find((img) => img.name === "noMoney").path;
      timeOutCancel = true;
      return;
    }
    let chance = 0;
    globalFunctions.updateCoinDisplay();
    gambaStatus.classList.remove("disappear");
    gambaStatus.innerHTML = "";
    if (finalMessageTimeout !== void 0) {
      clearTimeout(finalMessageTimeout);
    }
    gambaImg.src = images.find((img) => img.name === "spinning").path;
    gambaImg.classList.add("spinningAnim");
    if (this.curPityScore !== activeCase.pityReq) {
      chance = Math.floor(Math.random() * 100);
    } else {
      console.log("pity hit");
      chance = activeCase.pityReq;
    }
    const jackpotLength = Math.round(100 / activeCase.rate);
    const clampedLength = Math.min(Math.max(jackpotLength, 10), 1e3);
    const dynamicRange = Array.from({ length: clampedLength }, (_, i) => i);
    const gambaWin = dynamicRange.includes(chance);
    if (Object.keys(dictionaries.gambaMessages).length === 0) {
      await globalFunctions.loadGambaMessages();
    }
    setTimeout(() => {
      if (gambaWin) {
        this.curPityScore = 0;
        console.log("Winner, reset pity");
        gambaImg.src = images.find((img) => img.name === "win").path;
      } else {
        this.curPityScore += 1;
        console.log("Loser, add pity");
        gambaImg.src = images.find((img) => img.name === "loss").path;
      }
    }, 1750);
    setTimeout(() => {
      this.heavenInjected ? uiSharedGlobals.pricelbl.innerHTML = "Next spin is free!" : ` Price to spin: ${internalSharedGlobals.selectedGambaCase.cost}`;
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
    }, 2e3);
    finalMessageTimeout = setTimeout(() => {
      if (!timeOutCancel) {
        gambaStatus.innerHTML = "maybe you should spin again >:3";
        gambaStatus.classList.add("disappear");
      }
    }, 7e3);
  }
};
uiSharedGlobals?.changeLeft.addEventListener(
  "click",
  () => handleChange("left")
);
uiSharedGlobals?.changeRight.addEventListener(
  "click",
  () => handleChange("right")
);
var finalMessageTimeout;
function handleChange(direction) {
  switch (direction) {
    case "left":
      initializeSelectedGambaCase(internalSharedGlobals.caseID -= 1);
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
        uiSharedGlobals.changeRight.style.transform = "translateY(10000%)";
      }
      initializeSelectedGambaCase(internalSharedGlobals.caseID += 1);
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
function hideCaseChangeButtons() {
  uiSharedGlobals.changeLeft.style.transform = "translateY(10000%)";
  uiSharedGlobals.changeRight.style.transform = "translateY(10000%)";
}
function showCaseChangeButtons() {
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

// src/scripts/important/config.ts
var config = {
  versionNumber: "0.8.5"
};

// src/scripts/important/init.ts
var heavenCase;
initCoins();
var bah = fetchUnlockedCases();
saveUnlocked(bah);
var body = document.body;
body.style.transition = "background-color 1s ease";
var pricelbl = uiSharedGlobals.pricelbl;
var namelbl = uiSharedGlobals.namelbl;
var purchaseBtn = uiSharedGlobals.purchaseBtn;
var infoButton = document.getElementById("caseTip");
var handler2 = null;
infoButton.addEventListener("click", () => {
  internalSharedGlobals.popup.show("caseInfo", sendCaseInfoMessage(), {
    name: internalSharedGlobals.selectedGambaCase.name
  });
});
var fetchJsonData = async () => {
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
var countCases = async () => {
  internalSharedGlobals.gambaCases = await fetchJsonData();
  const normalCases = internalSharedGlobals.gambaCases.filter(
    (c) => c.gId !== 9999
  );
  internalSharedGlobals.maxCases = normalCases.length - 1;
};
countCases();
var sendCaseInfoMessage = () => {
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
var initializeSelectedGambaCase = async (gId) => {
  try {
    internalSharedGlobals.gambaCases = await fetchJsonData();
    heavenCase = internalSharedGlobals.gambaCases.find(
      (gCase) => gCase.gId === 9999
    );
    internalSharedGlobals.selectedGambaCase = internalSharedGlobals.gambaCases.find((gCase) => gCase.gId === gId);
    internalSharedGlobals.caseID = gId;
    if (isGambaUnlocked(gId)) {
      body.style.background = internalSharedGlobals.selectedGambaCase.background;
      body.style.filter = "";
      if (gId !== heavenCase.gId) {
        pricelbl.innerHTML = `Price to spin: ${internalSharedGlobals.selectedGambaCase.cost}`;
        internalSharedGlobals.cachedID = internalSharedGlobals.selectedGambaCase.gId;
      }
    } else {
      body.style.background = "#bbbbbb";
      pricelbl.innerHTML = `Price to unlock: ${internalSharedGlobals.selectedGambaCase.price}`;
    }
    if (namelbl.innerHTML == "Error fetching name of gamba...") {
      namelbl.innerHTML = internalSharedGlobals.selectedGambaCase.name;
    }
    if (internalSharedGlobals.selectedGambaCase) {
      console.log(
        `Selected Gamba Case:`,
        internalSharedGlobals.selectedGambaCase
      );
      handler2?.updateCase(internalSharedGlobals.selectedGambaCase);
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
      }, 1e3);
    } else {
      console.warn(`No Gamba Case found with gId: ${gId}`);
    }
  } catch (error) {
    console.error("Error loading or parsing gambaSelection.json:", error);
  }
};
var initializeHandler = async () => {
  await initializeSelectedGambaCase(0);
  if (internalSharedGlobals.selectedGambaCase) {
    handler2 = new GambaHandler();
    setGambaHandler(handler2);
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
var updateVersionDisplay = () => {
  const identifier = document.getElementById(
    "versionIdentifier"
  );
  identifier.innerHTML = `LazGamba Version: ${config.versionNumber}`;
};
updateVersionDisplay();
globalFunctions.loadGambaMessages();

// src/scripts/handlers/casePurchaseHandler.ts
uiSharedGlobals.purchaseBtn.addEventListener(
  "click",
  () => handlePurchaseCase(internalSharedGlobals.selectedGambaCase.gId)
);
var handlePurchaseCase = (id) => {
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

// src/scripts/handlers/dailyResetHandler.ts
var getDailyResetTime = () => {
  const now = /* @__PURE__ */ new Date();
  const nextReset = /* @__PURE__ */ new Date();
  nextReset.setDate(now.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);
  const diffMs = nextReset.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1e3 * 60 * 60));
  const minutes = Math.floor(diffMs % (1e3 * 60 * 60) / (1e3 * 60));
  return `Daily reset in: ${hours}h ${minutes}m`;
};
var updateTimerLabel = () => {
  const timerLabel = document.getElementById("resetLabel");
  if (timerLabel) {
    timerLabel.innerText = getDailyResetTime();
  }
};
updateTimerLabel();
setInterval(updateTimerLabel, 6e4);

// src/scripts/helpers/rainbowHelper.ts
setInterval(rainbow, 500);
function rainbow() {
  const toColor = document.querySelectorAll(".rainbow");
  if (toColor.length > 0) {
    toColor.forEach((el) => {
      el.style.color = getRandomColor();
    });
  } else {
    uiSharedGlobals.namelbl.style.color = "#FFF";
    return;
  }
}
function getRandomColor() {
  let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  return colors[Math.floor(Math.random() * colors.length)];
}
//! Rewrite of the notesu popup logic because that fucking sucked
//! Globals used in several files
//! Format for savedata, it just uses the case IDs and we run checks
