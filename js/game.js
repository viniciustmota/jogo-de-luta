const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const canvasWidth = 1024
const canvaHeight = 576

canvas.width = canvasWidth
canvas.height = canvaHeight

const desiredFPS = 120
const fremeTime = 1000 / desiredFPS

let prevTime = 0
let lag = 0

animate()

function animate() {
    const currentTime = performance.now()
    const elapsed = currentTime - prevTime
    prevTime = currentTime
    lag += elapsed

    handleControls()

    while (lag >= fremeTime){
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,canvasWidth,canvaHeight)

        background.update()
        player.update()

        lag -= fremeTime
    }
 
    window.requestAnimationFrame(animate)
}