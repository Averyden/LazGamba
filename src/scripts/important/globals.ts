//! Globals used in several files

export const allUseGlobals = {
  selectedGambaCase: null as any,
  gambaCases: [] as any[],
  caseID: 0 as number,
  cachedID: 0 as number,
  popup: new Popup("popupContainer"),
};

export const initializingGlobals = {
  heavenCase: null as any,
};

// export let cachedSelectedCase: {
//   gId: number;
//   price: number;
//   name: string;
// } | null = null;
