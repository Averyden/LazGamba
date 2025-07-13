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

export function getRanMessage<
  T extends {
    winMessages: { message: string }[];
    lossMessages: { message: string }[];
  }
>(type: "win" | "loss", messageDictionary: T): string {
  const messages =
    messageDictionary[type === "win" ? "winMessages" : "lossMessages"];
  if (!messages || messages.length === 0) {
    return "Message not available.";
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex].message;
}
