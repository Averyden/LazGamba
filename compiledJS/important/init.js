"use strict";
// This may seem redundant, but this is just initializing stuff for the site, like setting currency and such. 
// This is only so that the handlers dont get cluttered with useless stuff
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
initCoins();
const bah = fetchUnlockedCases();
saveUnlocked(bah);
const popup = new Popup("popupContainer");
let selectedGambaCase = null;
let caseID = -1;
const body = document.body;
body.style.transition = "background-color 1s ease";
const pricelbl = document.getElementById("gambaCost");
const namelbl = document.getElementById("caseName");
const infoButton = document.getElementById("caseTip");
infoButton.addEventListener("click", () => { popup.show("caseInfo", sendCaseInfoMessage()); });
const sendCaseInfoMessage = () => {
    let curCaseUnlockedVar;
    if (isGambaUnlocked(selectedGambaCase.gId)) {
        curCaseUnlockedVar = true;
    }
    else {
        curCaseUnlockedVar = false;
    }
    return `
    Internal id: ${selectedGambaCase.gId}<br>
    Price per spin: ${selectedGambaCase.cost}<br>
    Return multiplier: ${selectedGambaCase.winMult}<br>
    Jackpot rate: 1/${selectedGambaCase.rate}<br>
    Unlocked: ${curCaseUnlockedVar}`;
};
const initializeSelectedGambaCase = (gId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("src/dictionaries/gambaSelection.json");
        const jsonData = yield response.json();
        const gambaCases = jsonData.gambaCases;
        selectedGambaCase = gambaCases.find((gCase) => gCase.gId === gId);
        caseID = gId; // YES WE ARE SETTING IT TWICE BUT WHO CARES GRAAAAAAAAAA IM TOO LAZY TO FIGURE SOMETHING ELSE OUT.
        if (isGambaUnlocked(gId)) {
            body.style.background = selectedGambaCase.background;
            body.style.filter = "";
            pricelbl.innerHTML = `Price to spin: ${selectedGambaCase.cost}`;
        }
        else {
            body.style.background = "#bbbbbb";
            pricelbl.innerHTML = `Price to unlock: ${selectedGambaCase.price}`;
        }
        if (namelbl.innerHTML == "Error fetching name of gamba...") {
            namelbl.innerHTML = selectedGambaCase.name; // Set it to the name if it isnt loaded yet.
        }
        if (selectedGambaCase) {
            console.log(`Selected Gamba Case:`, selectedGambaCase);
            handler.updateCase(selectedGambaCase);
            namelbl.classList.add("outInFadeName");
            purchaseBtn.classList.add("outInFadeName");
            purchaseBtn.disabled = true;
            changeLeft.disabled = true;
            changeRight.disabled = true;
            setTimeout(() => {
                namelbl.innerHTML = selectedGambaCase.name;
            }, 500);
            setTimeout(() => {
                namelbl.classList.remove("outInFadeName");
                purchaseBtn.classList.remove("outInFadeName");
                changeLeft.disabled = false;
                purchaseBtn.disabled = false;
                changeRight.disabled = false;
            }, 1000);
        }
        else {
            console.warn(`No Gamba Case found with gId: ${gId}`);
        }
    }
    catch (error) {
        // popup.show("error", `Error loading or parsing gambaSelection.json: ${error} <br>(error ${popup.errorCodes["gambaSelectErrorParse"]})`)
        console.error("Error loading or parsing gambaSelection.json:", error);
    }
});
const initializeHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeSelectedGambaCase(0);
    if (selectedGambaCase) {
        handler = new GambaHandler();
        console.log('Handler initialized');
    }
    else {
        popup.show("error", `Error: selectedGambaCase is still null, handler unable to initialize. <br>(error ${popup.errorCodes["cantLoadHandlerCauseGambaSelectIsNull"]})`);
        console.error('Error: selectedGambaCase is still null, handler cannot be initialized.');
    }
});
initializeHandler();
const lblCoins = document.getElementById("coinLabel");
const updateCoinDisplay = () => {
    if (lblCoins) {
        lblCoins.innerText = `L-coins: ${lCoins}`;
    }
};
if (dailyBonus()) {
    console.log("Awarded daily bonus/reset");
    updateCoinDisplay();
}
else {
    console.log("Daily bonus/reset is already claimed.");
}
updateCoinDisplay();
let gambaMessages = {};
const loadGambaMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("src/dictionaries/mainGambaDictionaries.json");
        const text = yield response.text();
        console.log('Raw Response:', text);
        gambaMessages = JSON.parse(text);
        console.log('Parsed Messages:', gambaMessages);
    }
    catch (error) {
        popup.show("error", `Error loading or parsing JSON: ${error} <br>(error ${popup.errorCodes["baseJSONError"]})`);
        console.error('Error loading or parsing JSON:', error);
    }
});
loadGambaMessages();
const images = [
    { name: "loss", path: "assets/img/GAMBA imgs/loss.webp" }, // User didnt win anything.
    { name: "spinning", path: "assets/img/GAMBA imgs/speen.webp" }, // for when the user has pressed the button and we are calculating the chances of a win. 
    { name: "win", path: "assets/img/GAMBA imgs/win.png" }, // static win image because paint.net cant make gifs!
    { name: "noMoney", path: "assets/img/GAMBA imgs/noMoreMoney.webp" }, // User lost it all for the day.
    { name: "waiting", path: "assets/img/GAMBA imgs/waiting.webp" }
];
