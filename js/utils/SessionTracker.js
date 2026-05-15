export class SessionTracker {
    constructor(startTime) {
        this.startTime = startTime;
    }

    start() {
        window.addEventListener('beforeunload', () => {
            const sessionTime = Math.floor((Date.now() - this.startTime) / 1000);
            const currentTotal = parseInt(localStorage.getItem('totalTime') || '0');
            const newTotal = currentTotal + sessionTime;
            localStorage.setItem('totalTime', newTotal);
        });
    }
}