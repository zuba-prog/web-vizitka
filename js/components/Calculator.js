export class Calculator {
    constructor(containerId = 'calculator-container') {
        this.containerId = containerId;
        this.container = null;
        
        this.firstNumInput = null;
        this.operationSelect = null;
        this.secondNumInput = null;
        this.expressionDisplay = null;
        this.resultDisplay = null;
        
        this.hasFocus = false;
    }

    render() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Контейнер с ID "${this.containerId}" не найден!`);
            return;
        }
        
        this.container.innerHTML = '';

        const calculatorDiv = document.createElement('div');
        calculatorDiv.className = 'calculator';

        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'calc-inputs';

        const group1 = this.createInputGroup('Первое число', 'text', 'calc-first-num', 'Введите первое число');
        inputsDiv.appendChild(group1);

        const group2 = this.createOperationGroup();
        inputsDiv.appendChild(group2);

        const group3 = this.createInputGroup('Второе число', 'text', 'calc-second-num', 'Введите второе число');
        inputsDiv.appendChild(group3);

        calculatorDiv.appendChild(inputsDiv);

        const resultDiv = document.createElement('div');
        resultDiv.className = 'calc-result';
        
        const resultLabel = document.createElement('label');
        resultLabel.textContent = 'Результат';
        
        this.expressionDisplay = document.createElement('div');
        this.expressionDisplay.id = 'calc-expression';
        this.expressionDisplay.className = 'expression-display';
        
        this.resultDisplay = document.createElement('div');
        this.resultDisplay.id = 'calc-final-result';
        this.resultDisplay.className = 'result-display';
        this.resultDisplay.textContent = '0';

        resultDiv.appendChild(resultLabel);
        resultDiv.appendChild(this.expressionDisplay);
        resultDiv.appendChild(this.resultDisplay);
        
        calculatorDiv.appendChild(resultDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'calc-actions';

        const calcBtn = document.createElement('button');
        calcBtn.className = 'calc-btn calculate-btn';
        calcBtn.dataset.action = 'calculate';
        calcBtn.textContent = 'Вычислить';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'calc-btn clear-btn';
        clearBtn.dataset.action = 'clear';
        clearBtn.textContent = 'Очистить';

        actionsDiv.appendChild(calcBtn);
        actionsDiv.appendChild(clearBtn);

        calculatorDiv.appendChild(actionsDiv);

        this.container.appendChild(calculatorDiv);

        this.setElements();
        this.attachEvents();
    }

    createInputGroup(labelText, type, id, placeholder) {
        const group = document.createElement('div');
        group.className = 'input-group';

        const label = document.createElement('label');
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.placeholder = placeholder;

        group.appendChild(label);
        group.appendChild(input);

        return group;
    }

    createOperationGroup() {
        const group = document.createElement('div');
        group.className = 'input-group';

        const label = document.createElement('label');
        label.textContent = 'Операция';

        const select = document.createElement('select');
        select.id = 'calc-operation';

        const operations = [
            { value: '+', text: '+' },
            { value: '-', text: '−' },
            { value: '*', text: '×' },
            { value: '/', text: '÷' }
        ];

        operations.forEach(op => {
            const option = document.createElement('option');
            option.value = op.value;
            option.textContent = op.text;
            select.appendChild(option);
        });

        group.appendChild(label);
        group.appendChild(select);

        return group;
    }

    setElements() {
        this.firstNumInput = this.container.querySelector('#calc-first-num');
        this.operationSelect = this.container.querySelector('#calc-operation');
        this.secondNumInput = this.container.querySelector('#calc-second-num');
        
        [this.firstNumInput, this.secondNumInput].forEach(input => {
            input.addEventListener('focus', () => { this.hasFocus = true; });
            input.addEventListener('blur', () => { this.hasFocus = false; });
        });
        
        this.updateExpression();
    }

    updateExpression() {
        const first = this.firstNumInput.value || '0';
        const operation = this.operationSelect.value;
        const second = this.secondNumInput.value || '0';
        
        const opSymbol = this.getOperationSymbol(operation);
        this.expressionDisplay.textContent = `${first} ${opSymbol} ${second}`;
    }

    getOperationSymbol(op) {
        const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
        return symbols[op] || op;
    }

    calculate() {
        const val1 = this.firstNumInput.value.trim();
        const val2 = this.secondNumInput.value.trim();
        const operation = this.operationSelect.value;
        
        if (val1 === '' || val2 === '') {
            this.resultDisplay.textContent = 'Введите числа';
            return;
        }

        const num1 = parseFloat(val1);
        const num2 = parseFloat(val2);
        
        if (isNaN(num1) || isNaN(num2)) {
            this.resultDisplay.textContent = 'Ошибка ввода';
            return;
        }
        
        let result;
        switch (operation) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/':
                if (num2 === 0) {
                    this.resultDisplay.textContent = 'На ноль делить нельзя';
                    return;
                }
                result = num1 / num2;
                break;
            default: return;
        }
        
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8)); 
        }
        
        this.resultDisplay.textContent = result.toString();
        this.updateExpression();
    }

    clear() {
        this.firstNumInput.value = '';
        this.secondNumInput.value = '';
        this.resultDisplay.textContent = '0';
        this.updateExpression();
        this.firstNumInput.focus();
    }

    attachEvents() {
        const filterInput = (event) => {
            const key = event.key;
            
            if (['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                return; 
            }

            if (key >= '0' && key <= '9') {
                return;
            }

            if (key === '.' || key === ',') {
                const currentValue = event.target.value;
                const selectionStart = event.target.selectionStart;
                const partBeforeCursor = currentValue.substring(0, selectionStart);
                
                if (partBeforeCursor.includes('.')) {
                    event.preventDefault();
                } else {
                    if (key === ',') {
                        event.preventDefault();
                        document.execCommand('insertText', false, '.');
                    }
                }
                return;
            }

            event.preventDefault();
        };

        [this.firstNumInput, this.secondNumInput].forEach(input => {
            input.addEventListener('keydown', filterInput);
            input.addEventListener('input', () => this.updateExpression());
            input.addEventListener('change', () => this.updateExpression());
            
            input.addEventListener('focus', () => { this.hasFocus = true; });
            input.addEventListener('blur', () => { this.hasFocus = false; });
        });

        this.operationSelect.addEventListener('change', () => this.updateExpression());
        
        const calculateBtn = this.container.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }
        
        const clearBtn = this.container.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clear());
        }
        
        document.addEventListener('keydown', (event) => {
            if (!this.hasFocus) return;
            
            if (['+', '-', '*', '/'].includes(event.key)) {
                event.preventDefault();
                this.operationSelect.value = event.key;
                this.updateExpression();
                if (this.firstNumInput.value && document.activeElement === this.firstNumInput) {
                    this.secondNumInput.focus();
                }
            }
            
            if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                this.calculate();
            }
            
            if (event.key === 'Escape') {
                event.preventDefault();
                this.clear();
            }
        });
    }
}