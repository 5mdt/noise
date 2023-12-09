const types = {
    pink: "pink",
    brown: "brown",
    white: "white",
}
const timerInput = document.getElementById("timer");
const useTimer = (callback, ms) => {
    let intervalId;

    function intervalWrapper(...args) {
        intervalId = setInterval(() => callback(...args), ms);
    }

    function clearIntervalWrapper() {
        clearInterval(intervalId);
    }

    return [intervalWrapper, clearIntervalWrapper];
}

function updateTimerInput(value) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;
    timerInput.value = `${ padZero(hours) }:${ padZero(minutes) }:${ padZero(
      seconds) }`;
}

async function handleStartNoise(type) {
    const durationInSeconds = getUserDuration();
    if (audioContext) {
        await handleStopNoise();
    }

    if (durationInSeconds) {
        await generateNoise(type);
        startNoiseTimer();
    } else {
        await generateNoise(type);
    }
}

async function handleStopNoise() {
    await audioContext.close();
    audioContext = null;
    stopNoiseTimer();
}

const noiseTimer = () => {
    let duration = getUserDuration();
    duration--;
    if (duration <= 0) {
        handleStopNoise();
    }
    updateTimerInput(duration);
}

const [startNoiseTimer, stopNoiseTimer] = useTimer(noiseTimer, 1000)

const getUserDuration = () => {
    const duration = getDurationInSeconds(timerInput.value);
    return duration
}

let audioContext;
const generateNoise = async (type) => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 96000 });
    await audioContext.audioWorklet.addModule("RandomNoiseProcessor.js");
    const randomNoiseNode = new AudioWorkletNode(
        audioContext,
        "RandomNoiseProcessor",
        {
            processorOptions: {
                type,
            }
        }
    );
    randomNoiseNode.connect(audioContext.destination);
}

function getDurationInSeconds(timeValue) {
    const [hours, minutes, seconds] = timeValue.split(":").map(Number);
    const duration = (hours * 60 * 60) + (minutes * 60) + (seconds || 0)
    return duration
}

function padZero(number) {
    return number < 10 ? `0${number}` : number;
}
