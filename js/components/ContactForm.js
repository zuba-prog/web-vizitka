export class ContactForm {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.form = null;
        this.fioInput = null;
        this.phoneInput = null;
        this.dateInput = null;
        this.photoInput = null;
        this.messageInput = null;
        this.today = new Date().toISOString().split('T')[0];
    }

    render() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Контейнер "${this.containerId}" не найден!`);
            return;
        }

        this.container.innerHTML = '';

        const section = document.createElement('section');
        section.className = 'contact-section';

        const h2 = document.createElement('h2');
        h2.textContent = 'Свяжитесь со мной';
        section.appendChild(h2);

        const p = document.createElement('p');
        p.className = 'contact-description';
        p.textContent = 'Если вас заинтересовал мой сайт-визитка или вы хотите заказать подобный, оставьте свои данные и я свяжусь с вами';
        section.appendChild(p);

        this.form = document.createElement('form');
        this.form.className = 'contact-form';
        this.form.id = 'contact-form';
        this.form.method = 'POST';
        this.form.action = '#';

        const groupFio = this.createInputGroup('fio', 'text', 'ФИО (только буквы)', 'Иванов Иван Иванович', true);
        this.form.appendChild(groupFio);

        const groupDate = this.createInputGroup('desired-date', 'date', 'Желаемая дата связи', '', true);
        this.form.appendChild(groupDate);

        const groupPhone = this.createInputGroup('phone', 'tel', 'Номер телефона', '+7 (___) ___-__-__', true);
        this.form.appendChild(groupPhone);

        const groupPhoto = this.createInputGroup('photo-upload', 'file', 'Загрузить фотографию', '', false);
        this.form.appendChild(groupPhoto);

        const groupMessage = this.createTextareaGroup('message', 'Сообщение (необязательно)', 'Расскажите о вашем проекте', 4);
        this.form.appendChild(groupMessage);

        const btn = document.createElement('button');
        btn.type = 'submit';
        btn.className = 'submit-btn';
        btn.textContent = 'Отправить';
        this.form.appendChild(btn);

        section.appendChild(this.form);
        this.container.appendChild(section);

        this.cacheElements();
        this.initValidation();
    }

    createInputGroup(id, type, label, placeholder, required) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.textContent = label;

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        input.placeholder = placeholder;
        if (required) input.required = true;
        if (id === 'desired-date') input.min = this.today;

        group.appendChild(labelEl);
        group.appendChild(input);
        return group;
    }

    createTextareaGroup(id, label, placeholder, rows) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.textContent = label;

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.name = id;
        textarea.rows = rows;
        textarea.placeholder = placeholder;

        group.appendChild(labelEl);
        group.appendChild(textarea);
        return group;
    }

    cacheElements() {
        this.fioInput = document.getElementById('fio');
        this.phoneInput = document.getElementById('phone');
        this.dateInput = document.getElementById('desired-date');
        this.photoInput = document.getElementById('photo-upload');
        this.messageInput = document.getElementById('message');
    }

    initValidation() {
        if (this.dateInput) {
            this.dateInput.addEventListener('change', () => this.validateDate());
        }

        this.validateFIO();

        this.validatePhone();

        this.handlePhotoUpload();

        this.handleSubmit();
    }

    validateDate() {
        if (!this.dateInput) return;
        const selected = new Date(this.dateInput.value);
        const current = new Date(this.today);
        if (selected < current) {
            this.dateInput.setCustomValidity('Дата не может быть раньше текущей');
            this.dateInput.style.borderColor = 'red';
        } else {
            this.dateInput.setCustomValidity('');
            this.dateInput.style.borderColor = '#aaa';
        }
    }

    validateFIO() {
        if (!this.fioInput) return;
        this.fioInput.maxLength = 50;
        
        this.fioInput.addEventListener('beforeinput', (e) => {
            if (e.data && !/^[а-яА-ЯёЁa-zA-Z\s\-']+$/.test(e.data)) {
                e.preventDefault();
            }
        });

        this.fioInput.addEventListener('input', () => {
            const val = this.fioInput.value.trim();
            if (!val) this.fioInput.style.borderColor = '#aaa';
            else if (val.length < 3) this.fioInput.style.borderColor = 'orange';
            else this.fioInput.style.borderColor = 'green';
        });

        this.fioInput.addEventListener('blur', () => {
            const val = this.fioInput.value.trim();
            if (!val) {
                this.fioInput.setCustomValidity('Введите ФИО');
                this.fioInput.style.borderColor = 'red';
            } else if (val.length < 3) {
                this.fioInput.setCustomValidity('Минимум 3 символа');
                this.fioInput.style.borderColor = 'red';
            } else {
                this.fioInput.setCustomValidity('');
            }
        });

        this.fioInput.addEventListener('focus', () => {
            this.fioInput.setCustomValidity('');
            this.fioInput.style.borderColor = '#aaa';
        });
    }

    validatePhone() {
        if (!this.phoneInput) return;

        this.phoneInput.addEventListener('beforeinput', (e) => {
            if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') return;
            if (e.data && !/^\d$/.test(e.data)) {
                e.preventDefault();
                return;
            }
            const currentDigits = this.phoneInput.value.replace(/\D/g, '');
            if (currentDigits.length >= 11) e.preventDefault();
        });

        this.phoneInput.addEventListener('input', () => {
            const digits = this.phoneInput.value.replace(/\D/g, '');
            if (!digits) {
                this.phoneInput.style.borderColor = '#aaa';
                return;
            }
            if (digits[0] !== '7' && digits[0] !== '8') {
                this.phoneInput.style.borderColor = 'red';
                return;
            }
            if (digits.length < 11) this.phoneInput.style.borderColor = 'orange';
            else this.phoneInput.style.borderColor = 'green';
        });

        this.phoneInput.addEventListener('blur', () => {
            let digits = this.phoneInput.value.replace(/\D/g, '');
            if (!digits) {
                this.phoneInput.setCustomValidity('');
                this.phoneInput.style.borderColor = '#aaa';
                return;
            }
            if (digits[0] === '8') digits = '7' + digits.slice(1);
            if (digits[0] !== '7') digits = '7' + digits;

            if (digits.length !== 11) {
                this.phoneInput.setCustomValidity('Номер должен содержать ровно 11 цифр');
                this.phoneInput.style.borderColor = 'red';
                return;
            }

            const formatted = '+' + digits[0] + ' (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9, 11);
            this.phoneInput.value = formatted;
            this.phoneInput.setCustomValidity('');
            this.phoneInput.style.borderColor = 'green';
        });

        this.phoneInput.addEventListener('focus', () => {
            this.phoneInput.setCustomValidity('');
            this.phoneInput.style.borderColor = '#aaa';
        });
    }

    handlePhotoUpload() {
        if (!this.photoInput) return;
        this.photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста, выберите файл изображения.');
                this.photoInput.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Размер файла не должен превышать 5 МБ.');
                this.photoInput.value = '';
                return;
            }
        });
    }

    handleSubmit() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            let errors = [];

            if (this.fioInput) {
                const val = this.fioInput.value.trim();
                if (!val) errors.push('Введите ФИО');
                else if (val.length < 3) errors.push('ФИО слишком короткое (минимум 3 символа)');
            }

            if (this.phoneInput) {
                let digits = this.phoneInput.value.replace(/\D/g, '');
                if (digits.startsWith('8')) digits = '7' + digits.slice(1);
                if (digits.length > 0 && !digits.startsWith('7')) digits = '7' + digits;
                if (digits.length !== 11) errors.push('Некорректный номер: нужно ровно 11 цифр');
            }

            if (this.dateInput && this.dateInput.value) {
                const selected = new Date(this.dateInput.value);
                const current = new Date(this.today);
                selected.setHours(0, 0, 0, 0);
                current.setHours(0, 0, 0, 0);
                if (selected < current) errors.push('Дата не может быть раньше сегодняшней');
            }

            if (errors.length > 0) {
                alert('Исправьте ошибки:\n\n' + errors.join('\n'));
                return;
            }

            alert('Форма успешно отправлена!');
            this.form.reset();
        });
    }
}