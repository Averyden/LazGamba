// This may seem redundant, but this is just initializing stuff for the site, like setting currency and such. 
// This is only so that the handlers dont get cluttered with useless stuff

initCoins()
const bah = fetchUnlockedCases()
saveUnlocked(bah)

let selectedGambaCase: any = null
let caseID: number = -1

const body = document.body
body.style.transition = "background-color 1s ease"
const pricelbl = document.getElementById("gambaCost") as HTMLHeadingElement
const namelbl = document.getElementById("caseName") as HTMLHeadingElement



const initializeSelectedGambaCase = async (gId: number): Promise<void> => {
    try {
        const response = await fetch("src/dictionaries/gambaSelection.json")
        const jsonData = await response.json()
        
        const gambaCases = jsonData.gambaCases
        selectedGambaCase = gambaCases.find((gCase: any) => gCase.gId === gId)
        caseID = gId // YES WE ARE SETTING IT TWICE BUT WHO CARES GRAAAAAAAAAA IM TOO LAZY TO FIGURE SOMETHING ELSE OUT.

        if (isGambaUnlocked(gId)) {
            body.style.background = selectedGambaCase.background;
            body.style.filter = "";
            pricelbl.innerHTML = `Price to spin: ${selectedGambaCase.cost}`;
        } else {
            body.style.background = "#bbbbbb";
            pricelbl.innerHTML = `Price to unlock: ${selectedGambaCase.price}`;
        }
       
        if (namelbl.innerHTML == "Error fetching name of gamba...") {
            namelbl.innerHTML = selectedGambaCase.name // Set it to the name if it isnt loaded yet.
        }

        if (selectedGambaCase) {
            console.log(`Selected Gamba Case:`, selectedGambaCase)
            handler.updateCase(selectedGambaCase)
            namelbl.classList.add("outInFadeName")

            changeLeft.disabled = true
            changeRight.disabled = true

            setTimeout(() => {
                namelbl.innerHTML = selectedGambaCase.name
            }, 500);

            setTimeout(() => {
                namelbl.classList.remove("outInFadeName")
                changeLeft.disabled = false
                changeRight.disabled = false
            }, 1000);
            
        } else {
            console.warn(`No Gamba Case found with gId: ${gId}`)
        }
        
    } catch (error) {
        console.error("Error loading or parsing gambaSelection.json:", error)
    }
};

const initializeHandler = async () => {
    await initializeSelectedGambaCase(0)
    if (selectedGambaCase) {
        handler = new GambaHandler()
        console.log('Handler initialized')
    } else {
        console.error('Error: selectedGambaCase is still null, handler cannot be initialized.')
    }
};

initializeHandler();

const lblCoins = document.getElementById("coinLabel") as HTMLDivElement

const updateCoinDisplay = (): void => {
    if (lblCoins) {
        lblCoins.innerText = `L-coins: ${lCoins}`
    }
}

if (dailyBonus()) {
    console.log("Awarded daily bonus/reset")
    updateCoinDisplay()
} else {
    console.log("Daily bonus/reset is already claimed.")
}

updateCoinDisplay()

let gambaMessages: any = {}

const loadGambaMessages = async () => {
    try {
        const response = await fetch("src/dictionaries/mainGambaDictionaries.json")
        const text = await response.text()
        console.log('Raw Response:', text)
        gambaMessages = JSON.parse(text)
        console.log('Parsed Messages:', gambaMessages)
    } catch (error) {
        console.error('Error loading or parsing JSON:', error)
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