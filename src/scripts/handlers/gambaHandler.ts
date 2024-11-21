import gambaStatusMessages from "../../dictionaries/mainGambaDictionaries.json";


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
    var gambaWin = false
    gambaImg.src = images.find((img) => img.name === "spinning")!.path
    gambaImg.classList.add('spinningAnim')

    setTimeout(() => {
        const chance = Math.round(Math.random() * 3)

        if (chance == jackpotNumber) {
            
            gambaImg.src = images.find((img) => img.name === "win")!.path
        } else {
            gambaImg.src = images.find((img) => img.name === "loss")!.path
        } // should give us a range that makes sense?
        

        

    }, 1750);
    
    // THIS IS ONLY HERE SO THAT THE ANIMATION ISNT JUST STOPPED AFTER THE TIMEOUT.
    setTimeout(() => {
        gambaImg.classList.remove('spinningAnim')
    }, (2000));


    //Reset the label
    setTimeout(() => {
        if (gambaWin === true) {
            gambaStatus.innerHTML = "YOU HIT THE JACKPOT!"
        } else {
            gambaStatus.innerHTML = ""
        }
    }, 7000);

    
}