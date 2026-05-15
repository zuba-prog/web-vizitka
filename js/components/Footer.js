
import { FOOTER_INFO, SOCIAL_LINKS } from '../data/constants.js';

export class Footer {
    constructor(containerId = 'footer-container') {
        this.container = document.getElementById(containerId);
    }

    render() {
        const socialLinksHTML = SOCIAL_LINKS.map(social => `
            <a href="${social.url}" target="_blank" class="social-link">
                ${social.icon}
            </a>
        `).join('');

        return `
            <footer class="site-footer">
                <div class="footer-contacts">
                    <p> ${FOOTER_INFO.phone}</p>
                </div>
                <div class="footer-social">
                    ${socialLinksHTML}
                </div>
                <div class="footer-copyright">
                    <p>&copy; ${new Date().getFullYear()} Все права защищены</p>
                </div>
            </footer>
        `;
    }

    init() {
        if (this.container) {
            this.container.innerHTML = this.render();
            console.log('Футер загружен');
        }
    }
}