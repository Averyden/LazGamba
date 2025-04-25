const maybeInjectHeavenlyCase = (currentCase: any): any => {
    const heavenlyChance = 0.5
    const rng = Math.random()

    if (rng < heavenlyChance) {
        const heavenly = gambaCases.find((gCase: any) => gCase.gId === 9999)
        if (heavenly) {
            return { ...heavenly, cost: currentCase.cost }
        }
    }

    return currentCase
}
