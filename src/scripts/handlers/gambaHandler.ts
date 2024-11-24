const pricePerGamba = 50

initCoins()

const lblCoins = document.getElementById("coinLabel") as HTMLDivElement

const updateCoinDisplay = (): void => {
    if (lblCoins) {
        lblCoins.innerText = `L-coins: ${lCoins}`
    }
}

updateCoinDisplay()

let gambaMessages: any = {}

const loadGambaMessages = async () => {
    try {
        const response = await fetch("src/dictionaries/mainGambaDictionaries.json");
        const text = await response.text();  
        console.log('Raw Response:', text);  
        gambaMessages = JSON.parse(text);
        console.log('Parsed Messages:', gambaMessages);
    } catch (error) {
        console.error('Error loading or parsing JSON:', error);
    }
};


loadGambaMessages();

const images = [
    {name: "loss", path: "assets/img/GAMBA imgs/loss.webp"}, // User didnt win anything.
    {name: "spinning", path: "assets/img/GAMBA imgs/speen.webp"}, // for when the user has pressed the button and we are calculating the chances of a win. 
    {name: "win", path: "assets/img/GAMBA imgs/win.png"}, // static win image because paint.net cant make gifs!
    {name: "noMoney", path: "assets/img/GAMBA imgs/noMoreMoney.webp"}, // User lost it all for the day.
    {name: "waiting", path: "assets/img/GAMBA imgs/waiting.webp"}
]



const gamba = document.getElementById("gambaBtn") as HTMLButtonElement
const gambaImg = document.getElementById("gambaStatusImg") as HTMLImageElement

const gambaStatus = document.getElementById("gambaStatus") as HTMLHeadingElement 

gamba.addEventListener("click", () => handleGambaCalc())

//TODO: implement a sort of pity system.

let finalMessageTimeout: number | undefined;

// constants related to gamba logic
const jackpotNumber = 0

async function handleGambaCalc(): Promise<void> {
    if (!adjustCoins(-pricePerGamba)) {
        gambaStatus.innerHTML = "HAH you're poor! come back tomorrow."
        return
    }

    updateCoinDisplay()

    gambaStatus.classList.remove("disappear")
    gambaStatus.innerHTML = ""


    if (finalMessageTimeout !== undefined) {
        clearTimeout(finalMessageTimeout); 
    }

    gambaImg.src = images.find((img) => img.name === "spinning")!.path
    gambaImg.classList.add('spinningAnim')
    const chance = Math.round(Math.random())
    

    const gambaWin = chance === jackpotNumber

    if (Object.keys(gambaMessages).length === 0) {
        console.log('Loading messages...');
        await loadGambaMessages(); // This ensures that messages are loaded
    }


    setTimeout(() => {
        

        if (gambaWin) {
            console.log(chance)
            gambaImg.src = images.find((img) => img.name === "win")!.path
            


        } else {
            console.log(chance)
            gambaImg.src = images.find((img) => img.name === "loss")!.path
        } // should give us a range that makes sense?

    }, 1750);
    
    // THIS IS ONLY HERE SO THAT THE ANIMATION ISNT JUST STOPPED AFTER THE TIMEOUT.
    setTimeout(() => {
        gambaImg.classList.remove('spinningAnim')

        if (gambaWin) {
            gambaStatus.innerHTML = getRanMessage("win")
        } else {
            gambaStatus.innerHTML = getRanMessage("loss")
        }
    }, (2000));



    
    finalMessageTimeout = setTimeout(() => {
        gambaStatus.innerHTML = "maybe you should spin again >:3"
        gambaStatus.classList.add("disappear")
    }, 7000);
    
}

function getRanMessage(type: "win" | "loss"): string {
    if (!gambaMessages[type === "win" ? "winMessages" : "lossMessages"]) {
        return "Message not available.";
    }

    const filteredMessage = gambaMessages[type === "win" ? "winMessages" : "lossMessages"];
    const randomIndex = Math.floor(Math.random() * filteredMessage.length);
    return filteredMessage[randomIndex].message;
}