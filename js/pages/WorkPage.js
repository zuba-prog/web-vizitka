import { BasePage } from './BasePage.js';
import { Calculator } from '../components/Calculator.js';
import { SkillFilter } from '../components/SkillFilter.js';

export class WorkPage extends BasePage {
    constructor() {
        super();
        this.calculator = new Calculator('calculator-container');
        this.skillFilter = new SkillFilter('skills-container', 'skills-search');
    }

    init() {
        super.init();
        this.calculator.render();
        this.skillFilter.init();
    }
}