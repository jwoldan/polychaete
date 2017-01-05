
import Tone from 'tone';


class SoundHandler {

  constructor() {

    let shrimpOscillatorPlaying = false;

    this.createSynth();
    this.createLaserSynth();
    this.createStepNoise();
    this.createExplosionNoise();
    this.createBombIncrementSequence();
    this.createSpiderSequence();
    this.createShrimpOscillator();
    this.resetBPM();
  }

  synthChainCreated() {
    return (
      (typeof this.synthDistortion !== 'undefined') &&
      (typeof this.synthVolume !== 'undefined')
    );
  }

  createSynthChain() {
    this.synthDistortion = new Tone.Distortion({
      distortion: 1,
      oversample: '4x',
      wet: 0.7,
    });

    this.synthVolume = new Tone.Volume({
      volume: -12,
    }).toMaster();
    this.synthDistortion.connect(this.synthVolume);
  }

  createSynth() {
    this.synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { release: 0.2 },
    });

    if (!this.synthChainCreated()) this.createSynthChain();
    this.synth.connect(this.synthDistortion);
  }

  createLaserSynth() {
    this.laserSynth = new Tone.MonoSynth({
      oscillator: {
        type: 'square',
      },
      envelope: {
        release: 0.7,
      },
      filterEnvelope: {
        release: 1,
        baseFrequency: "D#7",
        octaves: 10,
      },
    });

    if (!this.synthChainCreated()) this.createSynthChain();
    this.laserSynth.connect(this.synthDistortion);
  }

  createStepNoise() {
    this.stepNoise = new Tone.NoiseSynth({
      noise: {
        type: 'pink',
      },
      envelope: {
        decay: 0.01,
      },
    });

    const stepVolume = new Tone.Volume({
      volume: -16,
    }).toMaster();

    this.stepNoise.connect(stepVolume);
  }

  createExplosionNoise() {
    this.explosionNoise = new Tone.NoiseSynth("white");

    const explosionFilter = new Tone.AutoFilter({
      frequency: "100hz",
      min: 200,
      max: 1000,
    }).start();

    const explosionReverb = new Tone.JCReverb(0.2);

    const explosionVolume = new Tone.Volume({
      volume: -12,
    }).toMaster();

    explosionReverb.connect(explosionVolume);
    explosionFilter.connect(explosionReverb);
    this.explosionNoise.connect(explosionFilter);
  }

  createBombIncrementSequence() {
    this.bombIncrementSequence = new Tone.Sequence((time, note) => {
      if (note) {
        this.synth.triggerAttackRelease(note, '60hz', undefined, 0.5);
      } else {
        this.bombIncrementSequence.stop();
      }
    }, ['E5', 'E5', 'E5', 'E5', false], "16n");
    this.bombIncrementSequence.loop = false;
  }

  createSpiderSequence() {
    this.spiderSequence = new Tone.Sequence((time, note) => {
      this.synth.triggerAttackRelease(note, '60hz', undefined, 0.1);
    }, ['C4', 'D4', 'G4', 'F#4'], "16n");
    this.spiderSequence.humanize = true;
  }

  createShrimpOscillator() {
    this.shrimpOscillator = new Tone.Oscillator();

    const oscillatorDistortion = new Tone.Distortion({
      distortion: 1,
      oversample: '4x',
      wet: 0.5,
    });

    const oscillatorVolume = new Tone.Volume({
      volume: -20,
    }).toMaster();

    oscillatorDistortion.connect(oscillatorVolume);
    this.shrimpOscillator.connect(oscillatorDistortion);
  }

  pauseTransport(paused) {
    if (paused) {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start();
    }
  }

  playLaserSound() {
    this.laserSynth.triggerAttackRelease('D#4', '60hz', undefined, 0.2);
  }

  playSeaSpongeHit() {
    this.synth.triggerAttackRelease('A2', '40hz');
  }

  playSeaSpongeDestroy() {
    this.synth.triggerAttackRelease('A1', '40hz');
  }

  playSegmentHit() {
    this.synth.triggerAttackRelease('F3', '40hz');
  }

  playSpiderHit() {
    this.synth.triggerAttackRelease('G#4', '20hz');
  }

  playShrimpHit() {
    this.synth.triggerAttackRelease('A5', '20hz');
  }

  playSegmentStep() {
    this.stepNoise.triggerAttackRelease('1hz');
  }

  playBombIncrement() {
    this.bombIncrementSequence.start();
  }

  playExplosionNoise() {
    this.explosionNoise.triggerAttackRelease('60hz');
  }

  startSpiderSequence() {
    this.spiderSequence.start();
  }

  stopSpiderSequence() {
    this.spiderSequence.stop();
  }

  startShrimpOscillator(speed = 0) {
    this.shrimpOscillator.frequency.value = 1000;
    this.shrimpOscillator.start();
    this.shrimpOscillator.frequency.rampTo(200, (5 / (speed + 1)));
    this.shrimpOscillatorPlaying = true;
  }

  pauseShrimpOscillator(paused) {
    if (paused) {
      this.shrimpOscillator.stop();
    } else if (this.shrimpOscillatorPlaying) {
      this.startShrimpOscillator();
    }
  }

  stopShrimpOscillator() {
    this.shrimpOscillator.stop();
    this.shrimpOscillatorPlaying = false;
  }

  incrementBPM(increase) {
    Tone.Transport.bpm.value += increase;
  }

  resetBPM() {
    Tone.Transport.bpm.value = 120;
  }

  pause(paused) {
    this.pauseTransport(paused);
    this.pauseShrimpOscillator(paused);
  }

  reset() {
    this.stopSpiderSequence();
    this.stopShrimpOscillator();
    this.pauseTransport(true);
  }
}

export default SoundHandler;
