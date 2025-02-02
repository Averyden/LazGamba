// For making sure the case is purchased before use
//! Format for savedata, it just uses the case IDs and we run checks

const purchaseBtn = document.getElementById("purchaseCaseBtn") as HTMLButtonElement

purchaseBtn.addEventListener("click", () => handlePurchaseCase(selectedGambaCase.gId))

const fetchUnlockedCases = (): number[] => {
    const rawData = localStorage.getItem(btoa("unlockedCases"))
    
    let unlockedCases: number[] = []
    if (rawData) {
        try {
            const parsedData64 = atob(rawData)
            const parsedData = JSON.parse(parsedData64);
            if (Array.isArray(parsedData)) {
                unlockedCases = parsedData
            } else if (typeof parsedData === "object" && parsedData !== null) {
                unlockedCases = [parsedData.gId]
            } else {
                popup.show("error", `Unexpected data format in unlockedCases: ${parsedData}<br>(error ${popup.errorCodes["unexpectedFormat"]})`)
                console.error("Unexpected data format in unlockedCases:", parsedData)
            }
        } catch (err) {
            popup.show("error", `ailed to parse unlockedCases: ${err} <br>(error ${popup.errorCodes["parseUnlockedFailed"]})`)
            console.error("Failed to parse unlockedCases:", err)
        }
    }

    if (!unlockedCases.includes(0)) {
        unlockedCases.push(0)
        saveUnlocked(unlockedCases)
    }

    return unlockedCases
};

const saveUnlocked = (caseIds: any): void => {
    localStorage.setItem(btoa("unlockedCases"), btoa(JSON.stringify(caseIds)))
}

const isGambaUnlocked = (gId: number): boolean => {
    const unlockedCases = fetchUnlockedCases()
    return unlockedCases.includes(gId)
}


const handlePurchaseCase = (id: number): void => {
    if (selectedGambaCase.gId === id) {
        const unlockedCases = fetchUnlockedCases()

        if (unlockedCases.includes(id)) {
            popup.show("error", `Attempting to purchase case, which is already unlocked. <br>(error ${popup.errorCodes["purchasingUnlockedCase"]})`)
            console.error("why are we trying to purchase this case?")
            return
        }

        if (adjustCoins(-selectedGambaCase.price)) {
            unlockedCases.push(id)
            console.log(`Unlocking case: ${id}, ${selectedGambaCase.name}...`)
            
            saveUnlocked(unlockedCases)
            updateButtonState(id)
            initializeSelectedGambaCase(id)
            updateCoinDisplay()
        } else {
            console.error("User cannot afford case...")
            return
        }
    }
    /* TODO:
    * TODO: utilize the L-Coins to check if user has enough
    * then fetch all currently unlocked cases,
    * then push to it and finally call the save function 
    */
}