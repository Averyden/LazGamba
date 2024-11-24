const getDailyResetTime = (): string => {
    const now: Date = new Date()
    const nextReset: Date = new Date()

    nextReset.setDate(now.getDate() + 1)
    nextReset.setHours(0,0,0,0)

    const diffMs: number = nextReset.getTime() - now.getTime()
    const hours: number = Math.floor(diffMs / (1000*60*60))
    const minutes: number = Math.floor((diffMs % (1000*60*60))/ (1000*60))

    return `Daily reset in: ${hours}h ${minutes}m`
}

const updateTimerLabel = (): void => {
    const timerLabel = document.getElementById("resetLabel") as HTMLDivElement
    if (timerLabel) {
        timerLabel.innerText = getDailyResetTime()
    }
}

updateTimerLabel()

setInterval(updateTimerLabel, 60000)