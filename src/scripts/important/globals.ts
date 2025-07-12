//! Globals used in several files

export let gambaCases: any[] = [];
export let heavenCase: any;
export let cachedID: number;

export let cachedSelectedCase: {
  gId: number;
  price: number;
  name: string;
} | null = null;

export let selectedGambaCase: any = null;
export let caseID: number = 0;

export const popup = new Popup("popupContainer");
