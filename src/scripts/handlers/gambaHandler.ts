const images = [
    {name: "loss", path: "assets/img/GAMBA imgs/loss.webp"}, // User didnt win anything.
    {name: "spinning", path: "assets/img/GAMBA imgs/speen.webp"}, // for when the user has pressed the button and we are calculating the chances of a win. 
    {name: "win", path: "assets/img/GAMBA imgs/win.png"}, // static win image because paint.net cant make gifs!
    {name: "noMoney", path: "assets/img/GAMBA imgs/noMoreMoney.webp"}, // User lost it all for the day.
    {name: "waiting", path: "assets/img/GAMBA imgs/waiting.webp"}
]

const gamba = document.getElementById("gambaBtn") as HTMLButtonElement
const gambaImg = document.getElementById("gambaStatusImg") as HTMLImageElement

gamba.addEventListener("click", () => handleGambaCalc())

//TODO: implement a sort of pity system.

// constants related to gamba logic
const jackpotNumber = 1500

function handleGambaCalc(): void {
    gambaImg.src = images.find((img) => img.name === "spinning")!.path
    gambaImg.classList.add('spinningAnim')

    setTimeout(() => {
        const chance = Math.round(Math.random() * 3000)

        if (chance == jackpotNumber) {
            console.log("WINNER")
            gambaImg.src = images.find((img) => img.name === "win")!.path
        } else {
            gambaImg.src = images.find((img) => img.name === "loss")!.path
        } // should give us a range that makes sense?
        

        gambaImg.classList.remove('spinningAnim')

    }, 2000);


    
}