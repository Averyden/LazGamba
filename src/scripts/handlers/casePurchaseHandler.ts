// For making sure the case is purchased before use
//! Format for savedata, it just uses the case IDs and we run checks

const purchaseBtn = document.getElementById("purchaseCaseBtn") as HTMLButtonElement

purchaseBtn.addEventListener("click", () => handlePurchaseCase(selectedGambaCase.gId))

const fetchUnlockedCases = (): number[] => {
    const rawData = localStorage.getItem("unlockedCases")
    let unlockedCases: number[] = []
    if (rawData) {
        try {
            const parsedData = JSON.parse(rawData);
            if (Array.isArray(parsedData)) {
                unlockedCases = parsedData
            } else if (typeof parsedData === "object" && parsedData !== null) {
                unlockedCases = [parsedData.gId]
            } else {
                console.error("Unexpected data format in unlockedCases:", parsedData)
            }
        } catch (err) {
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
    localStorage.setItem("unlockedCases", JSON.stringify(caseIds))
}

const isGambaUnlocked = (gId: number): boolean => {
    const unlockedCases = fetchUnlockedCases()
    return unlockedCases.includes(gId)
}


const handlePurchaseCase = (id: number): void => {
    if (selectedGambaCase.gId === id) {
        const unlockedCases = fetchUnlockedCases()

        if (unlockedCases.includes(id)) {
            console.error("why are we trying to purchase this case?")
            return
        }

        if (adjustCoins(-selectedGambaCase.price)) {
            unlockedCases.push(id)
            console.log(`Unlocking case: ${id}, ${selectedGambaCase.name}...`)
            
            saveUnlocked(unlockedCases)
            updateButtonState(id)
            initializeSelectedGambaCase(id)
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