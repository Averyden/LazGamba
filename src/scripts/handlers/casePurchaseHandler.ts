// For making sure the case is purchased before use
//! Format for savedata, it just uses the case IDs and we run checks


const fetchUnlockedCases = (): number[] => {
    const rawData = localStorage.getItem("unlockedCases")
    if (!rawData) return []

    try {
        const parsedData = JSON.parse(rawData)
        if (Array.isArray(parsedData)) {
            return parsedData
        } else if (typeof parsedData === "object" && parsedData !== null) {
            return [parsedData.gId]
        } else {
            console.error("Unexpected data format in unlockedCases:", parsedData)
            return []
        }
    } catch (err) {
        console.error("Failed to parse unlockedCases:", err)
        return []
    }
}

const saveUnlocked = (caseIds: any): void => {
    localStorage.setItem("unlockedCases", JSON.stringify(caseIds))
}

const isGambaUnlocked = (gId: number): boolean => {
    const unlockedCases = fetchUnlockedCases()
    return unlockedCases.includes(gId)
}


const handlePurchaseCase = (id: number): void => {
//TODO: implement this and figure out some way to like.... make the gamba button also call this. or else ill just make a new btton
}