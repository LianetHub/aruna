export class CustomSelect {

    static openDropdown = null;

    constructor(selectElement) {
        this.$select = selectElement;
        this.placeholder = this.$select.dataset.placeholder;
        this.defaultText = this.getDefaultText();
        this.selectName = this.$select.getAttribute('name');
        this.$options = this.$select.querySelectorAll('option');
        this.isSearchable = this.$select.hasAttribute('data-searchable');
        this.$dropdown = null;
        this.initialState = {};
        this.init();
    }

    init() {
        if (!this.$select) return;
        this.saveInitialState();
        this.$select.classList.add('hidden');
        this.renderDropdown();
        this.setupEvents();
    }

    saveInitialState() {
        const selectedOption = this.$select.options[this.$select.selectedIndex];
        this.initialState = {
            selectedText: selectedOption.text,
            selectedValue: selectedOption.value,
        };
    }

    getDefaultText() {
        const selectedOption = this.$select.querySelector('option[selected]');
        if (selectedOption) {
            return selectedOption.text;
        } else {
            return this.placeholder || this.$select.options[this.$select.selectedIndex].text;
        }
    }

    renderDropdown() {
        const isDisabled = this.$select.disabled;

        let controlTemplate;

        if (this.isSearchable) {
            controlTemplate = `
               <span class="dropdown__input-wrapper">
                     <span class="icon-chevron"></span>
               <input type="text" class="dropdown__input" 
                  autocomplete="off" 
                  value="${this.defaultText}" 
                />
               </span>
             `;
        } else {
            controlTemplate = `
        <button type="button" class="dropdown__button icon-chevron" 
                aria-expanded="false" 
                aria-haspopup="true" 
                ${isDisabled ? 'disabled' : ''}>
            <span class="dropdown__button-text">${this.defaultText}</span>
        </button>
    `;
        }


        this.$dropdown = document.createElement('div');
        this.$dropdown.classList.add('dropdown');

        this.$dropdown.innerHTML = `
            ${controlTemplate}
            <div class="dropdown__body" aria-hidden="true">
               <div class="dropdown__content">
                    <ul class="dropdown__list" role="listbox"></ul>
                </div>
            </div>
        `;

        const list = this.$dropdown.querySelector('.dropdown__list');
        this.$options.forEach(option => {
            const value = option.value;
            const text = option.text;
            const isSelected = option.selected;
            const isDisabled = option.disabled;

            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'option');
            listItem.setAttribute('data-value', value);
            listItem.classList.add('dropdown__list-item');
            if (isSelected && !this.isSearchable) listItem.classList.add('selected');
            if (isSelected) listItem.setAttribute('aria-checked', true);
            if (isDisabled) listItem.classList.add('disabled');
            if (isDisabled) listItem.setAttribute('aria-disabled', 'true');
            listItem.textContent = text;
            list.appendChild(listItem);
        });

        this.$select.after(this.$dropdown);
    }

    setupEvents() {
        const button = this.$dropdown.querySelector('.dropdown__button');
        button?.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = this.$dropdown.classList.contains('visible');
            this.toggleDropdown(!isOpen);
        });

        const input = this.$dropdown.querySelector('.dropdown__input');


        input?.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = this.$dropdown.classList.contains('visible');
            this.toggleDropdown(!isOpen);
        });

        const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
        listItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                if (!item.classList.contains('disabled')) {
                    this.selectOption(item);
                }
            });
        });

        if (this.isSearchable) {
            const input = this.$dropdown.querySelector('.dropdown__input');

            input.addEventListener('input', () => {
                const term = input.value.toLowerCase();
                const items = this.$dropdown.querySelectorAll('.dropdown__list-item');

                items.forEach(item => {
                    const text = item.textContent;
                    const match = text.toLowerCase().includes(term);

                    item.style.display = match ? '' : 'none';


                    if (match && term.length > 0) {
                        const regex = new RegExp(`(${term})`, 'gi');
                        item.innerHTML = text.replace(regex, '<mark>$1</mark>');
                    } else {
                        item.innerHTML = text;
                    }

                    item.classList.remove('selected');
                    item.setAttribute('aria-checked', 'false');
                });


                this.$select.removeAttribute('name');
                input.setAttribute('name', this.selectName);
            });


        }

        document.addEventListener('click', () => this.closeDropdown());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.closeDropdown();
        });

        this.$select.closest('form').addEventListener('reset', () => this.restoreInitialState());

        const observerDisabled = new MutationObserver(() => {
            const isSelectDisabled = this.$select.disabled;
            const button = this.$dropdown.querySelector('.dropdown__button');

            button.disabled = isSelectDisabled;
        });

        observerDisabled.observe(this.$select, {
            attributes: true,
            attributeFilter: ['disabled']
        });

        const observerSelected = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    const option = mutation.target;
                    const value = option.value;
                    const isDisabled = option.disabled;
                    const listItem = this.$dropdown.querySelector(`.dropdown__list-item[data-value="${value}"]`);

                    listItem.classList.toggle('disabled', isDisabled);
                    if (isDisabled) {
                        listItem.setAttribute('aria-disabled', 'true');
                    } else {
                        listItem.removeAttribute('aria-disabled');
                    }
                }

                if (mutation.type === 'attributes' && mutation.attributeName === 'selected') {
                    this.syncSelectedOption();
                }
            });
        });

        observerSelected.observe(this.$select, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['selected', 'disabled']
        });
    }

    toggleDropdown(isOpen) {
        if (isOpen && CustomSelect.openDropdown && CustomSelect.openDropdown !== this) {
            CustomSelect.openDropdown.closeDropdown();
        }

        const body = this.$dropdown.querySelector('.dropdown__body');
        const list = this.$dropdown.querySelector('.dropdown__list');
        const items = this.$dropdown.querySelectorAll('.dropdown__list-item');
        const hasScroll = list.scrollHeight > list.clientHeight;

        this.$dropdown.classList.toggle('visible', isOpen);
        this.$dropdown.querySelector('.dropdown__button')?.setAttribute('aria-expanded', isOpen);
        body.setAttribute('aria-hidden', !isOpen);

        if (isOpen) {
            items.forEach(item => item.removeAttribute("style"));

            CustomSelect.openDropdown = this;
            this.$dropdown.classList.remove('dropdown-top');
            const dropdownRect = body.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            if (dropdownRect.bottom > viewportHeight) {
                this.$dropdown.classList.add('dropdown-top');
            }

            list.classList.toggle('has-scroll', hasScroll);
        } else {
            if (CustomSelect.openDropdown === this) {
                CustomSelect.openDropdown = null;
            }
        }
    }

    closeDropdown() {
        this.toggleDropdown(false);
    }

    selectOption(item) {
        const value = item.dataset.value;
        const text = item.textContent;

        const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
        listItems.forEach(listItem => {
            listItem.classList.remove('selected');
            listItem.setAttribute('aria-checked', 'false');
        });
        item.classList.add('selected');
        item.setAttribute('aria-checked', 'true');


        this.$select.setAttribute('name', this.selectName);
        if (this.isSearchable) {
            const input = this.$dropdown.querySelector('.dropdown__input');
            input.removeAttribute('name');
            input.value = text;
        }


        this.$dropdown.querySelector('.dropdown__button')?.classList.add('selected');
        if (this.$dropdown.querySelector('.dropdown__button-text')) {
            this.$dropdown.querySelector('.dropdown__button-text').textContent = text;
        }
        this.$select.value = value;
        this.$select.dispatchEvent(new Event('change'));
        this.closeDropdown();
    }

    restoreInitialState() {
        const state = this.initialState;
        this.$select.value = state.selectedValue;
        this.$select.dispatchEvent(new Event('change'));

        const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
        listItems.forEach(listItem => {
            listItem.classList.remove('selected');
            listItem.setAttribute('aria-checked', 'false');
        });

        if (this.isSearchable) {
            const input = this.$dropdown.querySelector('.dropdown__input');
            input.value = state.selectedText;
            input.removeAttribute('name');
        }
        this.$select.setAttribute('name', this.selectName);

        const selectedItem = this.$dropdown.querySelector(`.dropdown__list-item[data-value="${state.selectedValue}"]`);

        selectedItem.classList.add('selected');
        selectedItem.setAttribute('aria-checked', 'true');

        this.$dropdown.querySelector('.dropdown__button-text').textContent = state.selectedText;
    }

    syncSelectedOption() {
        const selectedOption = this.$select.options[this.$select.selectedIndex];
        const selectedValue = selectedOption.value;
        const selectedText = selectedOption.text;

        const listItems = this.$dropdown.querySelectorAll('.dropdown__list-item');
        listItems.forEach(listItem => {
            listItem.classList.remove('selected');
            listItem.setAttribute('aria-checked', 'false');
        });

        const selectedItem = this.$dropdown.querySelector(`.dropdown__list-item[data-value="${selectedValue}"]`);
        selectedItem.classList.add('selected');
        selectedItem.setAttribute('aria-checked', 'true');

        this.$dropdown.querySelector('.dropdown__button-text').textContent = selectedText;
    }
}
