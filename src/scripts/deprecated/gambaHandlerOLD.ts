// const pricePerGamba = 50
// THIS IS OLD ARCHIVE CODE JUST INCASE I NEED TO GO BACK


// const gamba = document.getElementById("gambaBtn") as HTMLButtonElement
// const gambaImg = document.getElementById("gambaStatusImg") as HTMLImageElement

// const gambaStatus = document.getElementById("gambaStatus") as HTMLHeadingElement 

// gamba.addEventListener("click", () => handleGambaCalc())

// //TODO: implement a sort of pity system.

// let finalMessageTimeout: number | undefined;

// // constants related to gamba logic
// const jackpotNumber = 3

// async function handleGambaCalc(): Promise<void> {
//     let timeOutCancel = false // This is purely just to fucking make sure the teasing "maybe you should spin again >:3" doesnt appear if there is no money left.
//     if (!adjustCoins(-pricePerGamba)) {
//         gambaStatus.innerHTML = "HAH you're poor! come back tomorrow."
//         gambaImg.src = images.find((img) => img.name === "noMoney")!.path
//         timeOutCancel = true
//         return
//     }

//     updateCoinDisplay()

//     gambaStatus.classList.remove("disappear")
//     gambaStatus.innerHTML = ""


//     if (finalMessageTimeout !== undefined) {
//         clearTimeout(finalMessageTimeout); 
//     }

//     gambaImg.src = images.find((img) => img.name === "spinning")!.path
//     gambaImg.classList.add('spinningAnim')
//     const chance = Math.round(Math.random()*5)
    

//     const gambaWin = chance === jackpotNumber

//     if (Object.keys(gambaMessages).length === 0) {
//         console.log('Loading messages...');
//         await loadGambaMessages(); // This ensures that messages are loaded
//     }


//     setTimeout(() => {
        

//         if (gambaWin) {
//             console.log(chance)
//             gambaImg.src = images.find((img) => img.name === "win")!.path
//         } else {
//             console.log(chance)
//             gambaImg.src = images.find((img) => img.name === "loss")!.path
//         } // should give us a range that makes sense?

//     }, 1750);
    
//     // THIS IS ONLY HERE SO THAT THE ANIMATION ISNT JUST STOPPED AFTER THE TIMEOUT.
//     setTimeout(() => {
//         gambaImg.classList.remove('spinningAnim')

//         if (gambaWin) {
//             gambaStatus.innerHTML = getRanMessage("win")
//             adjustCoins(pricePerGamba*2)
//             updateCoinDisplay()

//             //TODO: implement a super rare chance to get a 50x of your gamba, for now it just doubles what you invested.
//         } else {
//             gambaStatus.innerHTML = getRanMessage("loss")
//         }
//     }, (2000));



    
//     finalMessageTimeout = setTimeout(() => {
//         if (!timeOutCancel) {
//             gambaStatus.innerHTML = "maybe you should spin again >:3"
//             gambaStatus.classList.add("disappear")
//         }   
//     }, 7000);
    
// }

// function getRanMessage(type: "win" | "loss"): string {
//     if (!gambaMessages[type === "win" ? "winMessages" : "lossMessages"]) {
//         return "Message not available.";
//     }

//     const filteredMessage = gambaMessages[type === "win" ? "winMessages" : "lossMessages"];
//     const randomIndex = Math.floor(Math.random() * filteredMessage.length);
//     return filteredMessage[randomIndex].message;
// }