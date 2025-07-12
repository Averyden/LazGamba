import { Popup } from "../handlers/popupHandler";

//! This is only here to serve as a shitty workaround to avoid circular dependencies
const utilityPopup = new Popup("popupContainer");

export const fetchUnlockedCases = (): number[] => {
  const rawData = localStorage.getItem(btoa("unlockedCases"));

  let unlockedCases: number[] = [];
  if (rawData) {
    try {
      const parsedData64 = atob(rawData);
      const parsedData = JSON.parse(parsedData64);
      if (Array.isArray(parsedData)) {
        unlockedCases = parsedData;
      } else if (typeof parsedData === "object" && parsedData !== null) {
        unlockedCases = [parsedData.gId];
      } else {
        utilityPopup.show(
          "error",
          `Unexpected data format in unlockedCases: ${parsedData}<br>(error ${utilityPopup.errorCodes["unexpectedFormat"]})`
        );
        console.error("Unexpected data format in unlockedCases:", parsedData);
      }
    } catch (err) {
      utilityPopup.show(
        "error",
        `Failed to parse unlockedCases: ${err} <br>(error ${utilityPopup.errorCodes["parseUnlockedFailed"]})`
      );
      console.error("Failed to parse unlockedCases:", err);
    }
  }

  if (!unlockedCases.includes(0)) {
    unlockedCases.push(0);
    unlockedCases.push(9999);
    saveUnlocked(unlockedCases);
  } else if (!unlockedCases.includes(9999)) {
    unlockedCases.push(9999);
    saveUnlocked(unlockedCases);
  }

  return unlockedCases;
};

export const isGambaUnlocked = (gId: number): boolean => {
  const unlockedCases = fetchUnlockedCases();
  return unlockedCases.includes(gId);
};

export const saveUnlocked = (caseIds: any): void => {
  localStorage.setItem(btoa("unlockedCases"), btoa(JSON.stringify(caseIds)));
};
