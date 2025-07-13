import { utilityPopup } from "./emergencyUtils";
import { getGambaHandler } from "../helpers/gambaHandlerInstance";

export const gambaButton = document.getElementById(
  "gambaBtn"
) as HTMLButtonElement;

gambaButton.addEventListener("click", () => {
  const handler = getGambaHandler();
  if (!handler) {
    utilityPopup.show(
      "error",
      `Error when handling gamba calculations, handler is not yet initialized. <br>(error ${utilityPopup.errorCodes["handlerNotInitWhenHandlingCalc"]})`
    );
    console.error("Handler not initialized yet.");
    return;
  }
  handler.handleGambaCalc();
});

export function getRanMessage(type: "win" | "loss"): string {
  if (
    !dictionaries.gambaMessages[type === "win" ? "winMessages" : "lossMessages"]
  ) {
    return "Message not available.";
  }

  const filteredMessage =
    dictionaries.gambaMessages[type === "win" ? "winMessages" : "lossMessages"];
  const randomIndex = Math.floor(Math.random() * filteredMessage.length);
  return filteredMessage[randomIndex].message;
}
