let lCoins = 300

const saveCoins = (): void => {
    localStorage.setItem("currency", lCoins.toString())
}


const loadCoins = (): number => {
    const savedCoins = localStorage.getItem("currency")
    return savedCoins ? parseInt(savedCoins, 10) : 300
}

const adjustCoins = (amount: number): boolean => {
    if (lCoins + amount < 0) {
        return false
    } else {
        lCoins += amount
        saveCoins()
        return true
    }
}

const initCoins = (): void => {
    lCoins = loadCoins()
}