import IMask from 'imask';
import { codeArray } from './codes.js';

export const intInputMask = () => {




    const inputs = document.querySelectorAll("input[type='tel']");



    inputs.forEach(input => {

        const mask = IMask(input, {
            mask: codeArray,
            dispatch: (appended, dynamicMasked) => {
                const number = (dynamicMasked.value + appended).replace(/\D/g, '');

                const firstChar = number.charAt(0);

                if (firstChar === '7' || firstChar === '8' || firstChar === '9') {
                    return dynamicMasked.compiledMasks.find(m => m.startsWith === "7");
                }

                return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0);
            }

        })
    })
}
// dispatch: (appended, dynamicMasked) => {
//                 const number = (dynamicMasked.value + appended).replace(/\D/g, '');


//                 const firstChar = number.charAt(0);

//                 if (firstChar === '7' || firstChar === '8' || firstChar === '9') {
//                     return dynamicMasked.compiledMasks.find(m => m.startsWith === "7");
//                 }

//                 return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0)
//             }