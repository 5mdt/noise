const tempo = 30;
const types = {
  pink: "pink",
  brown: "brown",
  white: "white",
}

function generateBrownNoise(buffer) {
  let lastOut = 0.0;

  for (let i = 0; i < buffer.length; i++) {
    const whiteNoise = (Math.random() * 2 - 1) / tempo;
    buffer[i] = (lastOut + (0.02 * whiteNoise)) / 1.02;
    lastOut = buffer[i];
    buffer[i] *= 3.5; // Amplify the sound
  }
}

// Function to generate Pink noise
function generatePinkNoise(buffer) {
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  for (let i = 0; i < buffer.length; i++) {
    const whiteNoise = (Math.random() * 2 - 1) / tempo;
    b0 = 0.99886 * b0 + whiteNoise * 0.0555179;
    b1 = 0.99332 * b1 + whiteNoise * 0.0750759;
    b2 = 0.96900 * b2 + whiteNoise * 0.1538520;
    b3 = 0.86650 * b3 + whiteNoise * 0.3104856;
    b4 = 0.55000 * b4 + whiteNoise * 0.5329522;
    b5 = -0.7616 * b5 - whiteNoise * 0.0168980;
    buffer[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + whiteNoise * 0.5362;
    buffer[i] *= 0.11; // Amplify the sound
    b6 = whiteNoise * 0.115926;
  }
}

// Function to generate White noise
function generateWhiteNoise(buffer) {

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = (Math.random() * 2 - 1) / tempo;
  }
}

class RandomNoiseProcessor extends AudioWorkletProcessor {
  constructor (options) {
    super();
    this.type = options.processorOptions.type;
  };
  process(inputs, outputs) {
    const output = outputs[0];
    output.forEach((channel) => {
      switch (this.type) {
        case types.brown:
          generateBrownNoise(channel);
          break;
        case types.pink:
          generatePinkNoise(channel);
          break;
        case types.white:
          generateWhiteNoise(channel);
          break;
        default:
          break;
      }
    });
    return true;
  }
}

registerProcessor("RandomNoiseProcessor", RandomNoiseProcessor);
