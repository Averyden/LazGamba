let lCoins = 300

const saveCoins = (): void => {
    localStorage.setItem("currency", btoa(lCoins.toString()))
}


const loadCoins = (): number => {
    const savedCoins = localStorage.getItem("currency")
    return savedCoins ? parseInt(atob(savedCoins), 10) : 300
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

const dailyBonus = (): boolean => {
    const lastBonus = localStorage.getItem(atob("lastBonusDate"))
    const today = new Date().toDateString()

    if (lastBonus !== today) {
        adjustCoins(300) 
        localStorage.setItem(btoa("lastBonusDate"), today)
        return true
    }
    return false
}