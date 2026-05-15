import { BasePage } from './BasePage.js';
import { SportTable } from '../components/SportTable.js';

export class SportPage extends BasePage {
    constructor() {
        super();
        this.sportTable = new SportTable('sport-table-container');
    }

    init() {
        super.init();
        this.sportTable.render();
    }
}