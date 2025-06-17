"use strict";
const maybeInjectHeavenlyCase = (currentCase) => {
    const heavenlyChance = 0.04;
    const rng = Math.random();
    if (rng < heavenlyChance) {
        const heavenly = gambaCases.find((gCase) => gCase.gId === 9999);
        if (heavenly) {
            console.log(currentCase.cost);
            return Object.assign(Object.assign({}, heavenly), { cost: currentCase.cost });
        }
    }
    return currentCase;
};
