const input = document.getElementById('input')

const audioCtx = new AudioContext()
const gainNode = audioCtx.createGain()

const oscillator = audioCtx.createOscillator()
oscillator.connect(gainNode)
gainNode.connect(audioCtx.destination)
oscillator.type = "sine"

oscillator.start()
gainNode.gain.value = 0

notenames = new Map()
notenames.set("C", 261.6)
notenames.set("D", 293.7)
notenames.set("E", 329.6)
notenames.set("F", 349.2)
notenames.set("G", 392)
notenames.set("A", 440)
notenames.set("B", 493.9)

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var width = ctx.canvas.width
var height = ctx.canvas.height

var amplitude = 40
var counter = 0
var interval = null

var reset = false
var timePerNote = 0
var length = 0

function frequency(pitch) {
    freq = pitch / 10000
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime+((timePerNote/1000)-0.1))
}

function line() {
    y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq * 0.5 * length))
    ctx.lineTo(x, y)
    ctx.stroke()
    x += 1
    counter++
    if (counter > (timePerNote/20)) {
        clearInterval(interval)
    }
}

function drawWave() {
    clearInterval(interval)
    if (reset) {
        ctx.clearRect(0, 0, width, height)
        x = 0
        y = height/2
        ctx.moveTo(x, y)
        ctx.beginPath()
    }
    counter = 0
    interval = setInterval(line, 20)
    reset = false
}

function handle() {
    reset = true
    audioCtx.resume()
    gainNode.gain.value = 0

    userInput = String(input.value).toUpperCase()
    let noteList = []
    length = userInput.length
    timePerNote = (6000/length)


    for (let note=0;note<userInput.length;note++) {
        noteList.push(notenames.get(userInput[note]))
    }
    let j = 0
    repeat = setInterval(() => {
        if (j < noteList.length) {
            frequency(parseInt(noteList[j]))
            drawWave()
            j++
        } else {
            clearInterval(repeat)
        }

    }, timePerNote)

}

