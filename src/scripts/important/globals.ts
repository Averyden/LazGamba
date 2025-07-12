//! Globals used in several files

export const internalSharedGlobals = {
  selectedGambaCase: null as any,
  gambaCases: [] as any[],
  caseID: 0 as number,
  cachedID: 0 as number,
  popup: new Popup("popupContainer"),
};

export const uiSharedGlobals = {
  changeRight: document.getElementById("changeCaseRight") as HTMLButtonElement,
  changeLeft: document.getElementById("changeCaseleft") as HTMLButtonElement,
  purchaseBtn: document.getElementById("purchaseCaseBtn") as HTMLButtonElement,
  namelbl: document.getElementById("caseName") as HTMLHeadingElement,
};

// export let cachedSelectedCase: {
//   gId: number;
//   price: number;
//   name: string;
// } | null = null;
