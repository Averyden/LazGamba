

class GambaHandler {
    private pricePerGamba: number = 50
    private jackpotNumber: number = 0
    private jackpotRange: number[] = []
    private winMult: number = 2 
    private curCase: any

    constructor() {

    }

    updateCase(curCase: any): void {
        if (!curCase) {
            console.error("Error in updating variables:\nNo case was selected\n\nDefaulting...")
            this.curCase = {gId: -1, cost: 50, winMult: 2, rate: 10}
        } else {
            this.curCase = curCase
        }

        this.pricePerGamba = this.curCase.cost
        this.winMult = this.curCase.winMult

        //* We set the range here based on variables within the dictionary.
        const chanceBase = Math.round(100 / this.curCase.rate)
        this.jackpotRange = Array.from({length: Math.round(this.curCase.rate / 100 * chanceBase)}, (_, i) => i)
        this.jackpotNumber = this.jackpotRange[Math.floor(Math.random() * this.jackpotRange.length)]

        console.log(`Updated to the following case: ${this.curCase}`)
        console.log(`jackPotNum(s) have been adjusted to: ${this.jackpotRange}`)
    }

    async handleGambaCalc(): Promise<void> {
        const gamba = document.getElementById("gambaBtn") as HTMLButtonElement;
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

        // Check if the chance falls into the jackpot range
        const gambaWin = this.jackpotRange.includes(chance);

        if (Object.keys(gambaMessages).length === 0) {
            console.log("Loading messages...");
            await loadGambaMessages(); // This ensures that messages are loaded
        }

        setTimeout(() => {
            if (gambaWin) {
                console.log(`Winning chance: ${chance}`);
                gambaImg.src = images.find((img) => img.name === "win")!.path;
            } else {
                console.log(`Losing chance: ${chance}`);
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

const gamba = document.getElementById("gambaBtn") as HTMLButtonElement
const gambaImg = document.getElementById("gambaStatusImg") as HTMLImageElement

const gambaStatus = document.getElementById("gambaStatus") as HTMLHeadingElement 

gamba.addEventListener("click", () => handleGambaCalc())

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