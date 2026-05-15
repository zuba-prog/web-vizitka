

import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { WorkPage } from './pages/WorkPage.js';
import { ContactsPage } from './pages/ContactsPage.js';
import { ApiTablePage } from './pages/ApiTablePage.js';
import { SportPage } from './pages/SportPage.js';
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'index.html':
            new HomePage().init();
            break;

        case 'work.html':
            new WorkPage().init();
            break;

        case 'contackts.html':
            new ContactsPage().init();
            break;

        case 'api-table.html':
            new ApiTablePage().init();
            break;
        case 'sport.html':
            new SportPage().init();
            break;

        default:
            const header = new Header('header-container');
            header.init();
            const footer = new Footer('footer-container');
            footer.init();
            break;
    }
});