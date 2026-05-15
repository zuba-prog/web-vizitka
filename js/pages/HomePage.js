import { BasePage } from './BasePage.js';
import { SessionTracker } from '../utils/SessionTracker.js';

export class HomePage extends BasePage {
    constructor() {
        super();
        this.visits = parseInt(localStorage.getItem('visits') || '0');
        this.totalTime = parseInt(localStorage.getItem('totalTime') || '0');
        this.startTime = Date.now();

        this.sessionTracker = new SessionTracker(this.startTime);
    }

    setGreeting() {
        const greetingBox = document.getElementById('user-greeting');
        if (!greetingBox) return;

        const currentHour = new Date().getHours();
        let greetingText = '';

        if (currentHour >= 5 && currentHour < 12) greetingText = 'Доброе утро!';
        else if (currentHour >= 12 && currentHour < 18) greetingText = 'Добрый день!';
        else if (currentHour >= 18 && currentHour < 23) greetingText = 'Добрый вечер!';
        else greetingText = 'Доброй ночи!';

        greetingBox.textContent = greetingText;
    }

    showStats() {
        const avgTime = this.visits > 0 ? Math.floor(this.totalTime / this.visits) : 0;

        const visitCountEl = document.getElementById('visit-count');
        const avgTimeEl = document.getElementById('avg-time');

        if (visitCountEl) visitCountEl.textContent = this.visits;
        if (avgTimeEl) avgTimeEl.textContent = avgTime;
    }


    closeStats() {
        const statsWindow = document.getElementById('stats-window');
        if (statsWindow) statsWindow.style.display = 'none';
    }

    init() {
        super.init();

        this.setGreeting();
        this.visits += 1;
        localStorage.setItem('visits', this.visits);
        this.showStats();


        const closeBtn = document.querySelector('#stats-window button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeStats());
        }

        this.sessionTracker.start();
        
        console.log('Главная страница запущена');
    }
}