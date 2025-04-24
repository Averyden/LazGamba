const canWeInjectHeavenly = (selectedCase: any, gambaCases:any): any => {
    if (!selectedCase || selectedCase.gId === 9999) return selectedCase

    const chance = 0.04
    const rng  = Math.random()

    if (rng < chance) {
        const heavenly = gambaCases.find((gCase: any) => gCase.gId === 9999)
        if (heavenly) {
            return heavenly
        }
    }

    return selectedCase
}