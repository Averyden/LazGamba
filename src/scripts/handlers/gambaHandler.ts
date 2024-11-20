const images = [
    {name: "loss", path: "assets/img/GAMBA imgs/loss.webp"}, // User didnt win anything.
    {name: "spinning", path: "assets/img/GAMBA imgs/speen.webp"}, // for when the user has pressed the button and we are calculating the chances of a win. 
    {name: "win", path: "assets/img/GAMBA imgs/win.png"}, // static win image because paint.net cant make gifs!
    {name: "noMoney", path: "assets/img/GAMBA imgs/noMoreMoney.webp"} // User lost it all for the day.
]

const gamba = document.getElementById("gambaBtn") as HTMLButtonElement

gamba.addEventListener("click", () => handleGambaCalc())

let pity = 50 // once it hits 50, make it super common.


// constants related to gamba logic
const jackpotNumber = 1500

function handleGambaCalc(): void {
    let chance = Math.round(Math.random() * 3000)

    console.log(`CHANCE: ${chance}\nPITY: ${pity}\nHIGHRANGE: ${jackpotNumber*pity}\nLOWRANGE: ${jackpotNumber/pity}`)
    if (chance >= (jackpotNumber*pity) && chance <= (jackpotNumber/pity)) {
        console.log("WINNER") // we are going to implement images later.
    } // should give us a range that makes sense?

}