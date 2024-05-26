"use strict";


// import Swiper from 'swiper';
import * as devFunctions from './modules/functions.js';

//  init Fancybox
if (typeof Fancybox !== "undefined" && Fancybox !== null) {
    Fancybox.bind("[data-fancybox]", {
        dragToClose: false,
        closeButton: false
    });
}

document.addEventListener('DOMContentLoaded', () => {

    devFunctions.OS();
    devFunctions.isWebp();
    devFunctions.intInputMask();
    devFunctions.beforeSlider()




    // event handlers

    document.addEventListener('click', (e) => {

        const target = e.target;


        if (target.closest('.icon-menu') || (target.classList.contains('menu') && document.querySelector('.header').classList.contains('open-menu'))) {
            getMenu()
        }

        if (target.classList.contains('banner__close')) {
            target.closest('.banner').classList.add('banner-hidden');
        }


    });

    function getMenu() {
        document.body.classList.toggle('lock');
        document.querySelector('.header').classList.toggle('open-menu');
    }


    // if (document.querySelectorAll('.form__textarea').length > 0) {
    //     document.querySelectorAll('.form__textarea').forEach(textarea => {
    //         let parentBlock = textarea.closest('.form__row');
    //         let maxLengthBox = parentBlock.querySelector('.form__maxlength');

    //         if (!maxLengthBox) return;

    //         let maxLengthCurrent = maxLengthBox.querySelector('.form__maxlength-current');
    //         let maxLengthTotal = maxLengthBox.querySelector('.form__maxlength-total');

    //         textarea.addEventListener('input', (e) => updateLength(e.target, maxLengthCurrent))

    //         updateLength(textarea, maxLengthCurrent);
    //     });

    //     function updateLength(textarea, currentBlock) {
    //         const currentLength = textarea.value.length;
    //         currentBlock.textContent = currentLength;
    //     }
    // }






    //  sliders

    if (document.querySelector('.products__slider')) {
        new Swiper('.products__slider', {
            slidesPerView: "auto",
            spaceBetween: 30,
            grabCursor: true,
            navigation: {
                nextEl: '.products__next',
                prevEl: '.products__prev'
            },
            breakpoints: {
                1199.98: {
                    spaceBetween: 48,
                }
            }
        })
    }
    if (document.querySelector('.reviews__slider')) {
        new Swiper('.reviews__slider', {
            slidesPerView: 1,
            navigation: {
                nextEl: '.reviews__next',
                prevEl: '.reviews__prev'
            },
        })
    }
    if (document.querySelector('.blog__slider')) {
        new Swiper('.blog__slider', {
            slidesPerView: "auto",
            spaceBetween: 16,
            grabCursor: true,
            navigation: {
                nextEl: '.blog__next',
                prevEl: '.blog__prev'
            },
            breakpoints: {
                1199.98: {
                    spaceBetween: 24,
                }
            }
        })
    }
    if (document.querySelector('.project__slider')) {
        new Swiper('.project__slider', {
            slidesPerView: 1,
            effect: "fade",
            fadeEffect: {
                crossFade: true,
            },
            navigation: {
                nextEl: '.project__next',
                prevEl: '.project__prev'
            },
            pagination: {
                el: '.project__pagination',
                clickable: true
            },
        })
    }
    if (document.querySelector('.projects__slider')) {
        new Swiper('.projects__slider', {
            slidesPerView: "auto",
            navigation: {
                nextEl: '.projects__next',
                prevEl: '.projects__prev'
            },
            spaceBetween: 12,
            grabCursor: true,
            breakpoints: {
                767.98: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                },
                1199.98: {
                    slidesPerView: 2,
                    spaceBetween: 100,
                }
            }
        })
    }



    // function getTabletSlider(sliderName, options) {

    //     let init = false;
    //     let swiper = null;

    //     function getSwiper() {
    //         if (window.innerWidth <= 1200) {
    //             if (!init) {
    //                 init = true;
    //                 swiper = new Swiper(sliderName, options);
    //             }
    //         } else if (init) {
    //             swiper.destroy();
    //             swiper = null;
    //             init = false;
    //         }
    //     }
    //     getSwiper();
    //     window.addEventListener("resize", getSwiper);
    // }


    // Fancybox.show([{
    //     src: "#booking",
    //     type: "inline"
    // }]);




})




