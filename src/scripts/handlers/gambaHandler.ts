const loadGambaMessages = async () => {
    const response = await fetch("../../dictionaries/mainGambaDictionaries.json");
    const gambaMessages = await response.json();
    console.log(gambaMessages);  // Now you can use gambaMessages in your logic.
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

// constants related to gamba logic
const jackpotNumber = 3

function handleGambaCalc(): void {
    gambaImg.src = images.find((img) => img.name === "spinning")!.path
    gambaImg.classList.add('spinningAnim')
    const chance = Math.round(Math.random() * 3)

    const gambaWin = chance === jackpotNumber


    setTimeout(() => {
        

        if (gambaWin) {
            gambaImg.src = images.find((img) => img.name === "win")!.path
          
        } else {
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


    //Reset the label
    setTimeout(() => {
       
        gambaStatus.innerHTML = "maybe you should spin again >:3"
      
    }, 7000);
}

function getRanMessage(type: "win" | "loss"): string {
    const filteredMesage = gambaStatusMessages[type === "win" ? "winMessages" : "lossMessages"]
    const randomIndex = Math.floor(Math.random() * filteredMesage.length)
    return filteredMesage[randomIndex].message

}