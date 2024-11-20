//* Basic utilities

export function resizeCanvas(canvas: HTMLCanvasElement): void {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}