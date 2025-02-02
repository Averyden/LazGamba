let lCoins = 300

const saveCoins = (): void => {
    localStorage.setItem(btoa("currency"), btoa(lCoins.toString()))
}


const loadCoins = (): number => {
    const savedCoins = localStorage.getItem(atob("currency"))
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

    const encoded = btoa("lastBonusDate")
    const lastBonus = localStorage.getItem(encoded)
    const today = new Date().toDateString()


    const encodedDate = btoa(today) 

    if (lastBonus !== encodedDate) {
        adjustCoins(300) 
        localStorage.setItem(encoded, encodedDate)
        return true
    }
    return false
}