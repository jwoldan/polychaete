
import Tone from 'tone';


class SoundHandler {
  constructor() {
    const distortion = new Tone.Distortion(1).toMaster();
    this.synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { release: 0.2 },
    });
    this.synth.connect(distortion);
  }

  playLaserSound() {
    this.synth.triggerAttackRelease("C4", "60hz", undefined, .5);
  }

  playSeaSpongeHit() {
    this.synth.triggerAttackRelease("A2", "40hz", undefined, .1);
  }

  playSeaSpongeDestroy() {
    this.synth.triggerAttackRelease("A1", "40hz", undefined, .1);
  }

  playSegmentHit() {
    this.synth.triggerAttackRelease("F3", "40hz", undefined, .2);
  }

  playSegmentStep() {
    this.synth.triggerAttackRelease("D0", "10hz", undefined, .05);
  }
}

export default SoundHandler;
