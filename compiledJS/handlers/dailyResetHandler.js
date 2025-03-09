"use strict";
const getDailyResetTime = () => {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setDate(now.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);
    const diffMs = nextReset.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `Daily reset in: ${hours}h ${minutes}m`;
};
const updateTimerLabel = () => {
    const timerLabel = document.getElementById("resetLabel");
    if (timerLabel) {
        timerLabel.innerText = getDailyResetTime();
    }
};
updateTimerLabel();
setInterval(updateTimerLabel, 60000);
