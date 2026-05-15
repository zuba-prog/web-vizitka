export class SportTable {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
    }

    render() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Контейнер с ID "${this.containerId}" не найден!`);
            return;
        }

        this.container.innerHTML = '';

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';

        const table = document.createElement('table');
        
        const caption = document.createElement('caption');
        caption.textContent = 'Моя карьера';
        table.appendChild(caption);

        const tableData = [
            {
                image: './img/tyag.jpg',
                alt: 'Тяга',
                description: 'На данном фото моя рекордная становая, по лицу видно, легко пошла 187,5кг'
            },
            {
                image: './img/moto.jpg',
                alt: 'Мотокросс',
                description: 'На этой фотке была тренировка в лесу с моим отцом'
            },
            {
                image: './img/footbol.jpg',
                alt: 'Футбол',
                description: 'На этой фотке одни из первых соревнований по футболу'
            }
        ];

        const imgRow = document.createElement('tr');
        tableData.forEach(item => {
            const td = document.createElement('td');
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.alt;
            td.appendChild(img);
            imgRow.appendChild(td);
        });
        table.appendChild(imgRow);

        const descRow = document.createElement('tr');
        tableData.forEach(item => {
            const td = document.createElement('td');
            td.textContent = item.description;
            descRow.appendChild(td);
        });
        table.appendChild(descRow);

        tableWrapper.appendChild(table);
        
        this.container.appendChild(tableWrapper);
    }
}