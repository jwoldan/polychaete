
import Tone from 'tone';


class SoundHandler {
  constructor() {

    // Add volume node - adjust master volume
    const synthVolume = new Tone.Volume({
      volume: -12,
    }).toMaster();

    // Add distortion effect
    const synthDistortion = new Tone.Distortion({
      distortion: 1,
      oversample: '4x',
      wet: 0.7,
    });

    synthDistortion.connect(synthVolume);

    const stepVolume = new Tone.Volume({
      volume: -16,
    }).toMaster();

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

    this.synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { release: 0.2 },
    });

    this.stepNoise = new Tone.NoiseSynth({
      noise: {
        type: 'pink',
      },
      envelope: {
        decay: 0.01,
      },
    });

    this.spiderSequence = new Tone.Sequence((time, note) => {
      this.synth.triggerAttackRelease(note, '60hz', undefined, 0.05);
    }, ['C4', 'D4', 'G4', 'F#4'], "16n");
    this.spiderSequence.humanize = true;

    // connect synths to distortion/volume/master chain
    this.laserSynth.connect(synthDistortion);
    this.synth.connect(synthDistortion);

    this.stepNoise.connect(stepVolume);

    this.resetBPM();
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

  playSegmentStep() {
    this.stepNoise.triggerAttackRelease('1hz');
  }

  startSpiderSequence() {
    this.spiderSequence.start();
  }

  stopSpiderSequence() {
    this.spiderSequence.stop();
  }

  incrementBPM(increase) {
    Tone.Transport.bpm.value += increase;
  }

  resetBPM() {
    Tone.Transport.bpm.value = 120;
  }
}

export default SoundHandler;
