import { SKILLS } from '../data/constants.js';

export class SkillFilter {
    constructor(containerId, searchInputId, skillsData = SKILLS) {
        this.containerId = containerId;
        this.searchInputId = searchInputId;
        this.skillsData = skillsData;
        
        this.container = null;
        this.searchInput = null;
    }

    render(filterText = '') {
        if (!this.container) return;

        const filteredSkills = this.skillsData.filter(skill => {
            const searchLower = filterText.toLowerCase();
            return skill.title.toLowerCase().includes(searchLower) ||
                skill.tags.some(tag => tag.toLowerCase().includes(searchLower));
        });

        if (filteredSkills.length === 0) {
            this.container.innerHTML = '<p class="no-results">Ничего не найдено 😕</p>';
            return;
        }

        const skillsHTML = filteredSkills.map(skill => `
            <div class="card">
                <h3>${skill.title}</h3>
                <img src="${skill.image}" alt="${skill.title}">
                <p>Опыт: ${skill.experience}</p>
                <p>Уровень: ${skill.level}</p>
            </div>
        `).join('');

        this.container.innerHTML = skillsHTML;
    }

    init() {
        this.container = document.getElementById(this.containerId);
        this.searchInput = document.getElementById(this.searchInputId);

        if (!this.container) {
            console.error(`Контейнер с ID "${this.containerId}" не найден!`);
            return;
        }

        if (this.searchInput) {
            this.render();
            this.searchInput.addEventListener('input', (e) => {
                this.render(e.target.value);
            });
        } else {
            this.render();
        }
    }
}