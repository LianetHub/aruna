export const configurator = () => {

    // configurator

    if (document.querySelectorAll('.configurator__block-input').length == 0) return;



    let updateSidePanel = () => {
        let configuratorProps = document.getElementById('configurator-props');
        let anyChecked = document.querySelectorAll('.configurator__block-input:checked').length > 0;


        if (anyChecked) {
            configuratorProps.classList.add('active');
        } else {
            configuratorProps.classList.remove('active');
        }

        // Показать/скрыть блок с фотометрическими данными
        let codeChecked = document.querySelector('input[name="code"]:checked');
        let opticsChecked = document.querySelector('input[name="optics"]:checked');
        let ledChecked = document.querySelector('input[name="led"]:checked');
        let photometricData = document.querySelector('[data-photometric]');

        let otherChecked = document.querySelectorAll('.configurator__block-input:not([name="code"]):not([name="optics"]):not([name="led"]):checked').length > 0;


        if (codeChecked && opticsChecked && ledChecked && !otherChecked) {

            let codeValue = transliterate(codeChecked.value.replace(/\s/g, "_"));
            let opticsValue = transliterate(opticsChecked.value);
            let ledValue = transliterate(ledChecked.value);
            let url = `/photometric_data/?art_no=${codeValue}_${opticsValue}_${ledValue}&check=Y`;



            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data === true) {
                        photometricData.classList.remove('hidden');
                        photometricData.querySelector('.configurator__side-link').href = `/photometric_data/?art_no=${codeValue}_${opticsValue}_${ledValue}`;
                        console.log(`Файл: /ies/${codeValue}/${codeValue}_${opticsValue}_${ledValue}.ies`);
                    }
                    else {
                        photometricData.classList.add('hidden');
                        photometricData.querySelector('.configurator__side-link').href = "";
                    }
                    updateSideListVisibility();
                })
                .catch(error => {
                    console.error('Error checking file:', error);
                    photometricData.classList.add('hidden');
                    photometricData.querySelector('.configurator__side-link').href = "";
                    updateSideListVisibility();
                });
        } else {
            if (!otherChecked) {
                photometricData.classList.add('hidden');
                photometricData.querySelector('.configurator__side-link').href = "";
            }
            updateSideListVisibility();
        }

        // Показать/скрыть блок со спецификацией
        let lastBlockChecked = document.querySelector('.configurator__block:nth-last-child(2) .configurator__block-input:checked');
        let specification = document.querySelector('[data-specification]');

        if (lastBlockChecked) {
            specification.classList.remove('hidden');
        } else {
            specification.classList.add('hidden');
        }
        updateSideListVisibility();
    };

    let updateSideListVisibility = () => {
        let photometricData = document.querySelector('[data-photometric]');
        let specification = document.querySelector('[data-specification]');
        let sideList = specification.closest('.configurator__side-list');

        if (!photometricData.classList.contains('hidden') || !specification.classList.contains('hidden')) {
            sideList.classList.remove('hidden');
        } else {
            sideList.classList.add('hidden');
        }
    };

    let filterLEDs = (checkbox = null) => {

        resetLEDs()
        if (!checkbox || !checkbox.checked) return;

        let filterValues = checkbox.getAttribute('data-filter');
        if (!filterValues || filterValues === '' || filterValues === '[]') return;

        filterValues = filterValues.replace(/[\[\]]/g, '').split(',').map(v => v.trim());

        document.querySelectorAll('input[name="led"]').forEach(ledInput => {
            let ledOpticsType = ledInput.getAttribute('value');
            if (filterValues.includes(ledOpticsType)) {
                ledInput.parentNode.classList.add('hidden');
            } else {
                ledInput.parentNode.classList.remove('hidden');
            }
        });
    };

    let resetLEDs = () => {
        document.querySelectorAll('input[name="led"]').forEach(ledInput => {
            ledInput.parentNode.classList.remove('hidden');
        });
    };

    let updateProductNumber = () => {
        const requiredNames = ['code', 'optics', 'led'];


        let productNumberParts = [];


        requiredNames.forEach(name => {

            let checkedInput = document.querySelector(`.configurator__block-input[name="${name}"]:checked`);
            if (checkedInput) {
                productNumberParts.push(checkedInput.value);
            }
        });

        let productNumber = productNumberParts.join('-');

        document.querySelector('.configurator__number').textContent = productNumber;
    };

    let updateRowActiveState = (name) => {
        let row = document.querySelector(`.configurator__side-item[data-row="${name}"]`);
        let anyChecked = document.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
        if (anyChecked) {
            row.classList.add('active');
        } else {
            row.classList.remove('active');
            row.querySelector('.configurator__side-value').textContent = '';


        }
        let followingRow = row.nextElementSibling;
        while (followingRow) {
            followingRow.classList.remove('active');
            followingRow.querySelector('.configurator__side-value').textContent = '';
            followingRow = followingRow.nextElementSibling;
        }
    };

    document.querySelectorAll('.configurator__block-input').forEach(configuratorInput => {
        configuratorInput.addEventListener('change', (e) => {


            let checkbox = e.target;
            let parentBlock = checkbox.closest('.configurator__block');
            let options = checkbox.closest('.configurator__block-options');
            let stepCheckboxes = options.querySelectorAll('.configurator__block-input');
            let nextBlock = parentBlock.nextElementSibling;

            let followingBlock = parentBlock.nextElementSibling;
            while (followingBlock) {
                let followingCheckboxes = followingBlock.querySelectorAll('.configurator__block-input');
                followingCheckboxes.forEach(followingCheckbox => {
                    followingCheckbox.checked = false;
                });
                followingBlock.classList.remove('active');
                followingBlock = followingBlock.nextElementSibling;
            }

            if (checkbox.checked) {
                stepCheckboxes.forEach(stepCheckbox => {
                    if (stepCheckbox !== checkbox) {
                        stepCheckbox.checked = false;
                    }
                });
                if (nextBlock) {
                    nextBlock.classList.add('active');
                }
            }

            let name = checkbox.getAttribute('name');
            let value = (name === "code") ? checkbox.value : checkbox.nextElementSibling.textContent;
            let row = document.querySelector(`.configurator__side-item[data-row="${name}"]`);
            if (name === 'code') {
                if (checkbox.checked) {
                    document.getElementById('product-name').textContent = value;
                    row.classList.add('active');
                    row.querySelector('.configurator__side-value').textContent = value;
                }
                updateProductNumber();
                resetLEDs()
            } else if (name === 'optics') {
                if (checkbox.checked) {
                    row.classList.add('active');
                    row.querySelector('.configurator__side-value').textContent = checkbox.nextElementSibling.textContent;
                }
                updateProductNumber();
                if (checkbox.hasAttribute('data-filter')) {
                    filterLEDs(checkbox);
                }
            } else {
                if (checkbox.checked) {
                    row.classList.add('active');
                    row.querySelector('.configurator__side-value').textContent = value;
                }
                updateProductNumber();
            }

            updateRowActiveState(name);
            updateSidePanel();
        });
        if (configuratorInput.checked) {
            configuratorInput.dispatchEvent(new Event('change'));
        } else {
            configuratorInput.checked = false
        }
    });

    function transliterate(str) {

        const translitMap = {
            'А': 'A', 'а': 'a',
            'Б': 'B', 'б': 'b',
            'В': 'V', 'в': 'v',
            'Г': 'G', 'г': 'g',
            'Д': 'D', 'д': 'd',
            'Е': 'E', 'е': 'e',
            'Ё': 'Yo', 'ё': 'yo',
            'Ж': 'Zh', 'ж': 'zh',
            'З': 'Z', 'з': 'z',
            'И': 'I', 'и': 'i',
            'Й': 'Y', 'й': 'y',
            'К': 'K', 'к': 'k',
            'Л': 'L', 'л': 'l',
            'М': 'M', 'м': 'm',
            'Н': 'N', 'н': 'n',
            'О': 'O', 'о': 'o',
            'П': 'P', 'п': 'p',
            'Р': 'R', 'р': 'r',
            'С': 'S', 'с': 's',
            'Т': 'T', 'т': 't',
            'У': 'U', 'у': 'u',
            'Ф': 'F', 'ф': 'f',
            'Х': 'Kh', 'х': 'kh',
            'Ц': 'Ts', 'ц': 'ts',
            'Ч': 'Ch', 'ч': 'ch',
            'Ш': 'Sh', 'ш': 'sh',
            'Щ': 'Shch', 'щ': 'shch',
            'Ъ': '', 'ъ': '',
            'Ы': 'Y', 'ы': 'y',
            'Ь': '', 'ь': '',
            'Э': 'E', 'э': 'e',
            'Ю': 'Yu', 'ю': 'yu',
            'Я': 'Ya', 'я': 'ya'
        };


        let result = '';

        for (const char of str) {
            result += translitMap[char] !== undefined ? translitMap[char] : char;
        }

        return result;
    }




    // end configurator
}
