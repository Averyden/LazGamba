const canvas = document.getElementById("waterBackground") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ch = canvas.height
const cw = canvas.width

class Wave {
    amplitude: number
    waveLen: number
    freq: number
    phase: number
    color: string
    

    constructor() {
        this.amplitude = Math.random() * 50+20
        this.waveLen = Math.random() * 200+100
        this.freq = Math.random() * 0.05+0.01
        this.phase = Math.random() * Math.PI * 2

        this.color = this.getGradientColor()
    }

    getGradientColor(): string {
        const gradient = ctx.createLinearGradient(0,0,0,ch)
        gradient.addColorStop(0, "rgba(0,162,232,0.8)")
        gradient.addColorStop(0, "rgba(0,117,178,0.6)")
        return gradient.toString()
    }

    update(): void {
        this.phase += this.freq
    }

    draw(): void {
        ctx.beginPath()
        ctx.moveTo(0, ch/2)

        for (let x = 0; x<cw; x++) {
            const y = ch / 2 + this.amplitude * Math.sin((x/this.waveLen) * Math.PI * 2 + this.phase)
            
            ctx.lineTo(cw,ch)
            ctx.lineTo(0,ch)
            ctx.closePath()

            ctx.fillStyle = this.color
            ctx.fill()
        }
    }

}