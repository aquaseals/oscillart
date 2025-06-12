// completed on: june 11 2025 by haya :P

const input = document.getElementById('input')
const colorPicker = document.getElementById('color')
const volume = document.getElementById("volume")
const recordingToggle = document.getElementById("toggle")

const audioCtx = new AudioContext()
const gainNode = audioCtx.createGain()

const oscillator = audioCtx.createOscillator()
oscillator.connect(gainNode)
gainNode.connect(audioCtx.destination)
oscillator.type = "sine"

oscillator.start()
gainNode.gain.value = 0

let song = []
let isRecording = false
let x = 0
let y = height/2
let freq = 0

var blob, recorder = null
var chunks = []

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

var counter = 0
var interval = null

var reset = false
var timePerNote = 0
var length = 0

function frequency(pitch) {
    freq = pitch / 10000
    gainNode.gain.setValueAtTime(volume.value, audioCtx.currentTime)
    setting = setInterval(() => {
        gainNode.gain.value = volume.value
    }, 1)
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime)
    setTimeout(() => {
        clearInterval(setting)
        gainNode.gain.value = 0
    }, ((timePerNote)-10))
}

function decimalToHexColor(decimal) {
  decimal = Math.max(0, Math.min(decimal, 16777215));

  let hex = decimal.toString(16).padStart(6, '0');

  return `#${hex}`;
}

function line() {
    y = height/2 + volume.value * Math.sin(x * 2 * Math.PI * freq * 0.5 * length)
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
    if (reset && !isRecording) {
        ctx.clearRect(0, 0, width, height)
        x = 0
        y = height/2
        ctx.moveTo(x, y)
        ctx.beginPath()
    } else if (reset) {
        y = height/2
        ctx.moveTo(x, y)
    }

    counter = 0
    interval = setInterval(function() {
        // extra custom feature, party mode to change color as it draws melodies
    if (document.getElementById('customColor').checked) {
        ctx.strokeStyle = decimalToHexColor(freq*1000000)
    } else {
        ctx.strokeStyle = colorPicker.value
    }
    line()
    }, 20)
    reset = false
}

function handle(song) {
    ctx.clearRect(0, 0, width, height);
    y = height/2
    reset = true
    audioCtx.resume()
    gainNode.gain.value = 0

    // from this line to 129 is irrelvant (was a separate sidequest)
    if (song.length > 0) {
        length = song.length
        timePerNote = (6000/length)

        let j = 0
        repeat = setInterval(() => {
            if (j < song.length) {
                frequency(parseInt(song[j]))
                drawWave()
                j++
            } else {
                clearInterval(repeat)
            }

        }, timePerNote)
    } else {
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

}

// custom feature: piano that draws each note as a sine wave and plays the note as you press keys. can be activated or deactivated

keyboard = new Map() // a lot of keys if you couldn't tell
keyboard.set("q", 130.81)
keyboard.set("w", 146.83)
keyboard.set("e", 164.81)
keyboard.set("r", 174.61)
keyboard.set("t", 196)
keyboard.set("y", 220)
keyboard.set("u", 246.94)
keyboard.set("i", notenames.get("C"))
keyboard.set("o", notenames.get("D"))
keyboard.set("p", notenames.get("E"))
keyboard.set("z", notenames.get("F"))
keyboard.set("x", notenames.get("G"))
keyboard.set("c", notenames.get("A"))
keyboard.set("v", notenames.get("B"))
keyboard.set("b", 523.25)
keyboard.set("n", 587.33)
keyboard.set("m", 659.25)
keyboard.set(",", 698.46)
keyboard.set(".", 783.99)
keyboard.set("/", 880)
keyboard.set("\'", 987.77)
keyboard.set("2", 138.59)
keyboard.set("3", 155.56)
keyboard.set("4", 185)
keyboard.set("5", 207.65)
keyboard.set("6", 233.08)
keyboard.set("7", 277.18)
keyboard.set("8", 311.13)
keyboard.set("9", 369.99)
keyboard.set("0", 415.3)
keyboard.set("s", 466.16)
keyboard.set("d", 554.37)
keyboard.set("f", 622.25)
keyboard.set("h", 739.99)
keyboard.set("j", 830.61)
keyboard.set("l", 932.33)

function record() {
    alert('piano activated: you can now draw one note at a time using the keyboard/piano key map below DONT FORGET TO STOP WHEN DONE!!')
    document.addEventListener('keypress', handleRecord)
    song = []
    isRecording = true
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    x = 0
    y = height/2
    ctx.moveTo(0, height/2);
}

function handleRecord(key) {
 audioCtx.resume()
 let k = String(key.key)
 let f = keyboard.get(k)
 if (f > 0) {
    console.log(f)
    song.push(String(f))
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(f, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime+0.7)
    freq = f / 10000
    counter =0
    reset = false
    drawOneWave([f])
 }
}

function drawOneWave(song) {
    y = height/2
    reset = false
    audioCtx.resume()
    gainNode.gain.value = 0

        length = 1 // only one note
        timePerNote = 500 // sets a fix time per note bc its only paying 1 note at a time while piano is activated, so it needs to make space for more possible notes

        let j = 0
        repeat = setInterval(() => {
            if (j < song.length) {
                gainNode.gain.setValueAtTime(100, audioCtx.currentTime)
                oscillator.frequency.setValueAtTime(parseInt(song[j]), audioCtx.currentTime)
                gainNode.gain.setValueAtTime(0, audioCtx.currentTime+0.7)
                freq = parseInt(song[j]) / 10000
                drawWave()
                j++
            } else {
                clearInterval(repeat)
            }

        }, timePerNote)
}

function stopRecord() {
 document.removeEventListener('keypress', handleRecord)
 console.log(song)
 isRecording = false
 ctx.clearRect(0, 0, width, height);
 alert('piano deactivated: your keyboard keys will no longer act as piano keys, feel free to record again or type out a full melody in the input!')
}


// recording canvas
function recordVideo() {
    const canvasStream = canvas.captureStream(20)

    const audioDestination  = audioCtx.createMediaStreamDestination()

    gainNode.connect(audioDestination)

    const combinedStream = new MediaStream()

    canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

    audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track))

    recorder = new MediaRecorder(combinedStream, {mimeType: 'video/webm'})

    recorder.ondataavailable = e => {
    if (e.data.size > 0) {
    chunks.push(e.data);
    }
    };
    
    recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url);
    };

    recorder.start()
}

var isRecordingVideo = false
function toggle() {
    isRecordingVideo = !isRecordingVideo
    if (isRecordingVideo) {
        chunks = []
        recordingToggle.innerHTML = "Stop Recording Video"
        recordVideo()
    } else {
        recordingToggle.innerHTML = "Start Recording Video"
        recorder.stop()
    }
}