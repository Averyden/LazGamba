const maybeInjectHeavenlyCase = (currentCase: any): any => {
    const heavenlyChance = 0.04
    const rng = Math.random()

    if (rng < heavenlyChance) {
        const heavenly = gambaCases.find((gCase: any) => gCase.gId === 9999)
        if (heavenly) {
            return heavenly
        }
    }

    return currentCase
}
