"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class GambaHandler {
    constructor() {
        this.pricePerGamba = 50;
        this.jackpotNumber = 0;
        this.jackpotRange = [];
        this.winMult = 2;
        this.curPityScore = 0;
        if (!selectedGambaCase) {
            console.warn("selectedGambaCase is not yet defined, using default case.");
            this.updateCase({ gId: -1, cost: 50, winMult: 2, rate: 10 });
        }
        else {
            this.updateCase(selectedGambaCase);
        }
    }
    updateCase(curCase) {
        if (!curCase) {
            popup.show("error", `Error in updating variables, as no case was selected. <br>(error ${popup.errorCodes["updateVarFail"]})`);
            console.error("Error in updating variables:\nNo case was selected\n\nDefaulting...");
            this.curCase = { gId: -1, cost: 50, winMult: 2, rate: 10 };
        }
        else {
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
        this.jackpotNumber = this.jackpotRange[Math.floor(Math.random() * this.jackpotRange.length)];
        console.log(`Updated to case:`, this.curCase);
        console.log(`Jackpot number(s):`, this.jackpotRange);
    }
    handleGambaCalc() {
        return __awaiter(this, void 0, void 0, function* () {
            const gambaImg = document.getElementById("gambaStatusImg");
            const gambaStatus = document.getElementById("gambaStatus");
            let timeOutCancel = false;
            if (!adjustCoins(-this.pricePerGamba)) {
                gambaStatus.innerHTML = "HAH you're poor! come back tomorrow.";
                gambaImg.src = images.find((img) => img.name === "noMoney").path;
                timeOutCancel = true;
                return;
            }
            let chance = 0;
            updateCoinDisplay();
            gambaStatus.classList.remove("disappear");
            gambaStatus.innerHTML = "";
            if (finalMessageTimeout !== undefined) {
                clearTimeout(finalMessageTimeout);
            }
            gambaImg.src = images.find((img) => img.name === "spinning").path;
            gambaImg.classList.add("spinningAnim");
            if (this.curPityScore !== this.curCase.pityReq) {
                chance = Math.floor(Math.random() * 100);
            }
            else {
                console.log("pity hit");
                chance = this.curCase.pityReq;
            }
            const gambaWin = this.jackpotRange.includes(chance);
            if (Object.keys(gambaMessages).length === 0) {
                yield loadGambaMessages();
            }
            setTimeout(() => {
                if (gambaWin) {
                    this.curPityScore = 0;
                    console.log("Winner, reset pity");
                    gambaImg.src = images.find((img) => img.name === "win").path;
                }
                else {
                    this.curPityScore += 1;
                    console.log("Loser, add pity");
                    gambaImg.src = images.find((img) => img.name === "loss").path;
                }
            }, 1750);
            setTimeout(() => {
                gambaImg.classList.remove("spinningAnim");
                if (gambaWin) {
                    gambaStatus.innerHTML = getRanMessage("win");
                    adjustCoins(this.pricePerGamba * this.winMult);
                    updateCoinDisplay();
                }
                else {
                    gambaStatus.innerHTML = getRanMessage("loss");
                }
            }, 2000);
            finalMessageTimeout = setTimeout(() => {
                if (!timeOutCancel) {
                    gambaStatus.innerHTML = "maybe you should spin again >:3";
                    gambaStatus.classList.add("disappear");
                }
            }, 7000);
        });
    }
}
//* Get document elements
const changeRight = document.getElementById("changeCaseRight");
const changeLeft = document.getElementById("changeCaseleft");
const gamba = document.getElementById("gambaBtn");
let handler;
gamba.addEventListener("click", () => {
    if (!handler) {
        popup.show("error", `Error when handling gamba calculations, handler is not yet initialized. <br>(error ${popup.errorCodes["handlerNotInitWhenHandlingCalc"]})`);
        console.error("Handler not initialized yet.");
        return;
    }
    handler.handleGambaCalc();
});
changeLeft.addEventListener("click", () => handleChange("left"));
changeRight.addEventListener("click", () => handleChange("right"));
let finalMessageTimeout;
function getRanMessage(type) {
    if (!gambaMessages[type === "win" ? "winMessages" : "lossMessages"]) {
        return "Message not available.";
    }
    const filteredMessage = gambaMessages[type === "win" ? "winMessages" : "lossMessages"];
    const randomIndex = Math.floor(Math.random() * filteredMessage.length);
    return filteredMessage[randomIndex].message;
}
function handleChange(direction) {
    const maxCases = 5; // this is a shitty temporary fix until i find out how i can get it dynamically.
    switch (direction) {
        case "left":
            initializeSelectedGambaCase(caseID -= 1);
            if (caseID <= 0) {
                changeLeft.style.transform = "translateY(10000%)";
            }
            if (caseID < maxCases) {
                changeRight.style.transform = "translateY(0%)";
            }
            break;
        case "right":
            if (caseID <= 0) {
                changeLeft.style.transform = "translateY(0%)";
            }
            if (caseID >= maxCases - 1) { // we remove 1 from it because it doesnt actually update, woops
                changeRight.style.transform = "translateY(10000%)";
            }
            initializeSelectedGambaCase(caseID += 1);
            break;
        default:
            popup.show("error", `Invalid case switch request. <br>(error ${popup.errorCodes["invalidLeftRightResult"]})`);
            console.error("Invalid request sent to change");
            break;
    }
    updateButtonState(caseID);
}
function updateButtonState(gId) {
    const isUnlocked = isGambaUnlocked(gId);
    if (isUnlocked) {
        gamba.disabled = false;
        gamba.style.opacity = "1";
        setTimeout(() => {
            purchaseBtn.style.transform = "translateY(10000%)";
        }, 500);
    }
    else {
        gamba.disabled = true;
        gamba.style.opacity = "0.5";
        setTimeout(() => {
            purchaseBtn.style.transform = "translateY(0%)";
        }, 500);
    }
}
