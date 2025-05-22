
import IMask from 'imask';
import { codeArray } from './codes.js';

export const intInputMask = () => {
    const inputs = document.querySelectorAll("input[type='tel']");

    inputs.forEach(input => {
        const mask = IMask(input, {
            mask: codeArray,
            dispatch: (appended, dynamicMasked) => {
                const number = (dynamicMasked.value + appended).replace(/\D/g, '');


                return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0);
            }
        });

        input.addEventListener('focus', () => {

            if (input.value.trim() === '') {
                mask.value = '+7';
            }
        });

        input.addEventListener('input', () => {
            if (input.value === '8') {
                mask.value = '+7';
            }
            if (input.value === '9') {
                mask.value = '+79';
            }
        });
    });
};
