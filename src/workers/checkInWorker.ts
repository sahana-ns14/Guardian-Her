// Web Worker for reliable background timing
let timerId: ReturnType<typeof setInterval> | null = null;
let remainingTime = 0;

self.onmessage = (e: MessageEvent) => {
    const { type, duration } = e.data;

    if (type === 'START') {
        if (timerId) clearInterval(timerId);
        remainingTime = duration;

        timerId = setInterval(() => {
            remainingTime -= 1;
            self.postMessage({ type: 'TICK', remainingTime });

            if (remainingTime <= 0) {
                if (timerId) clearInterval(timerId);
                timerId = null;
                self.postMessage({ type: 'ALARM' });
            }
        }, 1000);
    } else if (type === 'STOP') {
        if (timerId) clearInterval(timerId);
        timerId = null;
        remainingTime = 0;
    }
};

export { }; // Ensure this is treated as a module
