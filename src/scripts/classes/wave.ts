export class Wave {
    amplitude: number
    waveLen: number
    freq: number
    phase: number
    color: string
    ctx: CanvasRenderingContext2D
    ch: number
    cw: number
    

    constructor(ctx: CanvasRenderingContext2D, cw: number, ch: number) {
        this.amplitude = Math.random() * 50+20
        this.waveLen = Math.random() * 200+100
        this.freq = Math.random() * 0.05+0.01
        this.phase = Math.random() * Math.PI * 2

        this.color = this.getGradientColor()

        this.ctx = ctx
        this.cw = cw
        this.ch = ch
    }

    getGradientColor(): string {
        const gradient = this.ctx.createLinearGradient(0,0,0,this.ch)
        gradient.addColorStop(0, "rgba(0,162,232,0.8)")
        gradient.addColorStop(0, "rgba(0,117,178,0.6)")
        return gradient.toString()
    }

    update(): void {
        this.phase += this.freq
    }

    draw(): void {
        this.ctx.beginPath()
        this.ctx.moveTo(0, this.ch/2)

        for (let x = 0; x<this.cw; x++) {
            const y = this.ch / 2 + this.amplitude * Math.sin((x/this.waveLen) * Math.PI * 2 + this.phase)
            
            this.ctx.lineTo(this.cw,this.ch)
            this.ctx.lineTo(0,this.ch)
            this.ctx.closePath()

            this.ctx.fillStyle = this.color
            this.ctx.fill()
        }
    }
}

