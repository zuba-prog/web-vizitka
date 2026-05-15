import { BasePage } from './BasePage.js';
export class ApiTablePage extends BasePage {
    constructor() {
        super();
        this.tableBody = null;
        this.searchInput = null;
        this.userInput = null;
        this.loadBtn = null;
        this.errorMessage = null;
        
        this.originalData = [];
        this.currentData = [];
        this.sortColumn = null;
        this.sortDirection = 'asc';
    }

    
    async fetchData(username) {
        if (!username) return;
        
        this.tableBody.innerHTML = '<tr><td colspan="5">Загрузка данных...</td></tr>';
        
        this.errorMessage.style.display = 'none';

        try {
            const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) throw new Error('Пользователь не найден');
                throw new Error('Ошибка сети или лимит запросов');
            }

            const data = await response.json();
            
            if (data.length === 0) {
                this.tableBody.innerHTML = '<tr><td colspan="5">У пользователя нет публичных репозиториев.</td></tr>';
                this.originalData = [];
                return;
            }

            this.originalData = data;
            this.currentData = [...this.originalData];
            this.renderTable();
            
        } catch (error) {
            console.error('Ошибка:', error);
            this.errorMessage.textContent = `Ошибка: ${error.message}. Попробуйте другое имя.`;
            this.errorMessage.style.display = 'block';
            this.tableBody.innerHTML = '';
        }
    }

    renderTable() {
        if (!this.tableBody) return;

        if (this.currentData.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="5">Ничего не найдено</td></tr>';
            return;
        }

        this.tableBody.innerHTML = this.currentData.map(repo => {
            const date = new Date(repo.updated_at).toLocaleDateString('ru-RU');
            const lang = repo.language || 'N/A';
            const desc = repo.description ? repo.description.substring(0, 60) + '...' : 'Нет описания';
            
            return `
                <tr>
                    <td><a href="${repo.html_url}" target="_blank" style="color:#007bff; text-decoration:none;">${repo.name}</a></td>
                    <td title="${repo.description || ''}">${desc}</td>
                    <td>${lang}</td>
                    <td>${repo.stargazers_count}</td>
                    <td>${date}</td>
                </tr>
            `;
        }).join('');
    }

    sortData(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.currentData.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            
            if (valA === null || valA === undefined) valA = '';
            if (valB === null || valB === undefined) valB = '';

            
            if (column === 'stargazers_count') {
                valA = Number(valA);
                valB = Number(valB);
            } else {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
            }

            if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.renderTable();
        this.updateSortIndicators();
    }

    updateSortIndicators() {
        document.querySelectorAll('.data-table th').forEach(th => {
            const col = th.dataset.sort;
            if (col === this.sortColumn) {
                th.textContent = th.textContent.replace('↕', this.sortDirection === 'asc' ? '↑' : '↓');
            } else {

                if (!th.textContent.includes('↕')) {
                     th.textContent = th.textContent.replace(/[↑↓]/g, '') + ' ↕';
                }
            }
        });
    }

    filterData(query) {
        const lowerQuery = query.toLowerCase();
        this.currentData = this.originalData.filter(repo => 
            repo.name.toLowerCase().includes(lowerQuery) ||
            (repo.description && repo.description.toLowerCase().includes(lowerQuery)) ||
            (repo.language && repo.language.toLowerCase().includes(lowerQuery))
        );
        
        if (this.sortColumn) {
            this.sortData(this.sortColumn); 
        } else {
            this.renderTable();
        }
    }

    init() {
        super.init();

        this.tableBody = document.querySelector('#users-table tbody');
        this.searchInput = document.getElementById('table-search');
        this.userInput = document.getElementById('github-user-input');
        this.loadBtn = document.getElementById('load-btn');
        this.errorMessage = document.getElementById('error-message');

        if (this.loadBtn && this.userInput) {
            this.loadBtn.addEventListener('click', () => {
                const username = this.userInput.value.trim();
                if (username) this.fetchData(username);
            });

            this.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const username = this.userInput.value.trim();
                    if (username) this.fetchData(username);
                }
            });
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterData(e.target.value);
            });
        }

        const tableHead = document.querySelector('#users-table thead');
        if (tableHead) {
            tableHead.addEventListener('click', (e) => {
                if (e.target.tagName === 'TH' && e.target.dataset.sort) {
                    this.sortData(e.target.dataset.sort);
                }
            });
        }
        
       
    }
}