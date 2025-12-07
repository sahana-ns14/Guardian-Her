export class SirenAudio {
    private ctx: AudioContext | null = null;
    private osc: OscillatorNode | null = null;
    private gain: GainNode | null = null;
    private isPlaying = false;

    constructor() {
        // Initialize lazily on user interaction
    }

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    start() {
        if (this.isPlaying) return;
        this.init();
        if (!this.ctx) return;

        this.isPlaying = true;
        this.osc = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();

        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);

        this.osc.type = 'sawtooth';
        this.osc.frequency.setValueAtTime(800, this.ctx.currentTime);

        // Siren modulation (Wailing sound)
        // 800Hz to 1200Hz ramp
        const now = this.ctx.currentTime;
        this.osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
        this.osc.frequency.linearRampToValueAtTime(800, now + 1.0);

        // LFO for modulation loop would be better but simple repeat for now via interval in manager 
        // or just set a periodic wave. using simple ramp for initial burst.
        // For a continuous siren, we attach an LFO.

        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 2; // 2Hz cycle
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 400; // +/- 400Hz modulation

        lfo.connect(lfoGain);
        lfoGain.connect(this.osc.frequency);
        lfo.start();

        this.osc.start();
        this.gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

        // Resume context if suspended (browser setup)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    stop() {
        if (!this.isPlaying) return;
        if (this.osc) {
            try {
                this.osc.stop();
                this.osc.disconnect();
            } catch (e) { }
        }
        this.isPlaying = false;
    }
}

export const siren = new SirenAudio();
