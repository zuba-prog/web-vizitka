import { NAVIGATION_LINKS } from '../data/constants.js';


export class Header {
    constructor(containerId = 'header-container') {
        this.container = document.getElementById(containerId);
    
        const pathParts = window.location.pathname.split('/');
        this.currentPage = pathParts.pop() || 'index.html';
        
        if (!this.currentPage.endsWith('.html')) {
            this.currentPage = 'index.html';
        }
    }

    render() {
        const navItemsHTML = NAVIGATION_LINKS.map(({ href, title, target = '_self' }) => {
            const isActive = this.currentPage === href ? 'class="active"' : '';
            const targetAttr = target === '_blank' ? 'target="_blank"' : '';
            
            return `<li><a href="${href}" ${targetAttr} ${isActive}>${title}</a></li>`;
        }).join('');

        return `
            <nav class="main-nav">
                <input type="checkbox" id="menu-toggle">
                <label for="menu-toggle" class="menu-icon">
                    <span></span><span></span><span></span>
                </label>
                <ul class="nav-list">${navItemsHTML}</ul>
            </nav>
        `;
    }

    init() {
        if (this.container) {
            this.container.innerHTML = this.render();
            console.log('Навигация загружена');
        }
    }
}