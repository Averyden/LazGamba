class GambaHandler {
    private pricePerGamba: number = 50
    private jackpotNumber: number = 0
    private jackpotRange: number[] = []
    private winMult: number = 2 
    private curCase: any
    private curPityScore: number = 0

    constructor() {
        if (!selectedGambaCase) {
            console.warn("selectedGambaCase is not yet defined, using default case.");
            this.updateCase({gId: -1, cost: 50, winMult: 2, rate: 10});
        } else {
            this.updateCase(selectedGambaCase);
            
        }
    }

    updateCase(curCase: any): void {
        if (!curCase) {
            console.error("Error in updating variables:\nNo case was selected\n\nDefaulting...")
            this.curCase = {gId: -1, cost: 50, winMult: 2, rate: 10}
        } else {
            this.curCase = curCase
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
        console.log(`Jackpot number(s):`, this.jackpotRange)
    }

    async handleGambaCalc(): Promise<void> {
        const gambaImg = document.getElementById("gambaStatusImg") as HTMLImageElement;
        const gambaStatus = document.getElementById("gambaStatus") as HTMLHeadingElement;

        let timeOutCancel = false;

        if (!adjustCoins(-this.pricePerGamba)) {
            gambaStatus.innerHTML = "HAH you're poor! come back tomorrow.";
            gambaImg.src = images.find((img) => img.name === "noMoney")!.path;
            timeOutCancel = true;
            return;
        }

        updateCoinDisplay();

        gambaStatus.classList.remove("disappear");
        gambaStatus.innerHTML = "";

        if (finalMessageTimeout !== undefined) {
            clearTimeout(finalMessageTimeout);
        }

        gambaImg.src = images.find((img) => img.name === "spinning")!.path;
        gambaImg.classList.add("spinningAnim");
        const chance = Math.floor(Math.random() * 100);

   
        const gambaWin = this.jackpotRange.includes(chance);

        if (Object.keys(gambaMessages).length === 0) {
            await loadGambaMessages();
        }

        setTimeout(() => {
            if (gambaWin) {
                gambaImg.src = images.find((img) => img.name === "win")!.path;
            } else {
                gambaImg.src = images.find((img) => img.name === "loss")!.path;
            }
        }, 1750);

        setTimeout(() => {
            gambaImg.classList.remove("spinningAnim");

            if (gambaWin) {
                gambaStatus.innerHTML = getRanMessage("win");
                adjustCoins(this.pricePerGamba * this.winMult);
                updateCoinDisplay();
            } else {
                gambaStatus.innerHTML = getRanMessage("loss");
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

//* Get document elements
const changeRight = document.getElementById("changeCaseRight") as HTMLButtonElement
const changeLeft = document.getElementById("changeCaseleft") as HTMLButtonElement
const gamba = document.getElementById("gambaBtn") as HTMLButtonElement



let handler: GambaHandler;

gamba.addEventListener("click", () => {
    if (!handler) {
        console.error("Handler not initialized yet.");
        return;
    }
    handler.handleGambaCalc();
});

changeLeft.addEventListener("click", () => handleChange("left"))
changeRight.addEventListener("click", () => handleChange("right"))



//TODO: implement a sort of pity system.

let finalMessageTimeout: number | undefined;

function getRanMessage(type: "win" | "loss"): string {
    if (!gambaMessages[type === "win" ? "winMessages" : "lossMessages"]) {
        return "Message not available.";
    }

    const filteredMessage = gambaMessages[type === "win" ? "winMessages" : "lossMessages"];
    const randomIndex = Math.floor(Math.random() * filteredMessage.length);
    return filteredMessage[randomIndex].message;
}

function handleChange(direction: string): void {
    const maxCases = 2 // this is a shitty temporary fix until i find out how i can get it dynamically.
    
    switch(direction) {
        case "left":
            initializeSelectedGambaCase(caseID-=1)

            if (caseID <= 0) {
                changeLeft.style.transform = "translateY(10000%)"
            }

            if (caseID < maxCases) {
                changeRight.style.transform = "translateY(0%)"
            }

            break

        case "right":
            if (caseID <= 0) {
                changeLeft.style.transform = "translateY(0%)"
            }

            
            if (caseID >= maxCases-1) { // we remove 1 from it because it doesnt actually update, woops
                changeRight.style.transform = "translateY(10000%)"
            }
            
            initializeSelectedGambaCase(caseID+=1)
            
            break
        default:
            console.error("Invalid request sent to change")
            break
    }
    updateButtonState(caseID);
}

function updateButtonState(gId: number): void {
    const isUnlocked = isGambaUnlocked(gId)
    
    if (isUnlocked) {
        
        gamba.disabled = false
        gamba.style.opacity = "1"
        
        setTimeout(() => {
            purchaseBtn.style.transform = "translateY(10000%)"
        }, 500);
        
    } else {
        gamba.disabled = true
        gamba.style.opacity = "0.5"
        setTimeout(() => {
            purchaseBtn.style.transform = "translateY(0%)"
        }, 500);
    }

}
