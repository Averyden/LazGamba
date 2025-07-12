//! Globals used in several files

export const internalSharedGlobals = {
  selectedGambaCase: null as any,
  gambaCases: [] as any[],
  caseID: 0 as number,
  cachedID: 0 as number,
  popup: new Popup("popupContainer"),
  maxCases: 14 as number, //TODO: Make this dynamic INSTEAD of hard-coded
};

export const uiSharedGlobals = {
  changeRight: document.getElementById("changeCaseRight") as HTMLButtonElement,
  changeLeft: document.getElementById("changeCaseleft") as HTMLButtonElement,
  purchaseBtn: document.getElementById("purchaseCaseBtn") as HTMLButtonElement,
  namelbl: document.getElementById("caseName") as HTMLHeadingElement,
  pricelbl: document.getElementById("gambaCost") as HTMLHeadingElement,
};

export const images = [
  { name: "loss", path: "assets/img/GAMBA imgs/loss.webp" }, // User didnt win anything.
  { name: "spinning", path: "assets/img/GAMBA imgs/speen.webp" }, // for when the user has pressed the button and we are calculating the chances of a win.
  { name: "win", path: "assets/img/GAMBA imgs/win.png" }, // static win image because paint.net cant make gifs!
  { name: "noMoney", path: "assets/img/GAMBA imgs/noMoreMoney.webp" }, // User lost it all for the day.
  { name: "waiting", path: "assets/img/GAMBA imgs/waiting.webp" },
];

// export let cachedSelectedCase: {
//   gId: number;
//   price: number;
//   name: string;
// } | null = null;
