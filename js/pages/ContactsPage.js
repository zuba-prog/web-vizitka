import { BasePage } from './BasePage.js';
import { ContactForm } from '../components/ContactForm.js';

export class ContactsPage extends BasePage {
    constructor() {
        super();
        this.contactForm = new ContactForm('contact-form-container');
    }

    init() {
        super.init();
        this.contactForm.render();
    }
}