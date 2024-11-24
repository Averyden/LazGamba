// This may seem redundant, but this is just initializing stuff for the site, like setting currency and such. 
// This is only so that the handlers dont get cluttered with useless stuff.initCoins()

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


dailyBonus()