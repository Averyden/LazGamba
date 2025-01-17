//! Rewrite of the notesu popup logic because that fucking sucked

type promptTypes = "caseInfo" | "error" 

interface IPopupConfig {
    title: string
    confirmText: string
    onConfirm: () => void
}

class Popup {
    private container: HTMLElement
    private titleElement: HTMLElement
    private messageElement: HTMLElement
    private confirmButton: HTMLButtonElement
    private cancelButton: HTMLButtonElement
    private config: Record<promptTypes, IPopupConfig>

    constructor(container: string) {
        this.container =  document.getElementById(container) as HTMLElement
        this.titleElement = this.container.querySelector("#popupTitle") as HTMLElement
        this.messageElement = this.container.querySelector("#popupText") as HTMLElement
        this.confirmButton = this.container.querySelector("#btnConfirm") as HTMLButtonElement
        this.cancelButton = this.container.querySelector("#btnCancel") as HTMLButtonElement

        this.cancelButton.addEventListener("click", () => this.hide())

        //This is still a messy way to do it, but infinitely better than whatever the fuck i was doing with notesu
        this.config = {
            "caseInfo": {
                title: "You shouldn't be able to see me",
                confirmText: "OK",
                onConfirm: this.hide
            },
            "error": {
                title: "Error",
                confirmText: "OK",
                onConfirm: this.hide
            },
        }
    }

    public errorCodes: Record<string, string> = {
        //* Popup error codes, 1x as prefix
        "unknownType": "1x5638",
        "unknownConfig": "1x5861", 
        //* case purchashing error codes, 2x as prefix
        "unexpectedFormat": "2x8753",
        "parseUnlockedFailed": "2x6528",
        "purchasingUnlockedCase": "2x5268",
        //* gamba handler error codes, 3x as prefix
        "updateVarFail": "3x8659",
        "handlerNotInitWhenHandlingCalc": "3x4672",
        "invalidLeftRightResult": "3x6482",
        //* init.ts error codes, 4x as prefix
        "gambaSelectErrorParse": "4x1597",
        "cantLoadHandlerCauseGambaSelectIsNull": "4x4724",
        "baseJSONError": "4x2467",
    }

    public show(type: promptTypes, message: string = "No message provided.") {
        let config = this.config[type]
        if (!config) {
            const errCode = this.errorCodes["unknownType"]
            message = `Unknown popup type "${type}"\n(error ${errCode})`
            
            config = this.config["error"]
        }

        if (config === this.config["error"] || config === this.config["caseInfo"]) {
            this.cancelButton.style.display = "none"
        }

        this.titleElement.textContent = config.title
        this.messageElement.innerHTML = message 
        this.confirmButton.textContent = config.confirmText

        if (config === this.config["caseInfo"]) {
            this.titleElement.textContent = `Info for: ${selectedGambaCase.name}`
        }

        const newConfirmButton = this.confirmButton.cloneNode(true) as HTMLButtonElement
        this.confirmButton.replaceWith(newConfirmButton)
        this.confirmButton = newConfirmButton
        this.confirmButton.addEventListener("click", config.onConfirm.bind(this))

        this.container.classList.add("visible")
    }



    public hide() {
        this.container.classList.remove("visible")
    }
}