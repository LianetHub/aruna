"use strict";


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
    devFunctions.beforeSlider();
    devFunctions.formSubmit();
    devFunctions.animation()




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
    if (document.querySelectorAll('.product-info__slider').length > 0) {

        document.querySelectorAll('.product-info__slider').forEach(slider => {
            let wrapper = slider.closest('.product-info__block');
            let prev = wrapper.querySelector('.product-info__block-prev');
            let next = wrapper.querySelector('.product-info__block-next');

            new Swiper(slider, {
                slidesPerView: "auto",
                navigation: {
                    nextEl: next,
                    prevEl: prev
                },
                spaceBetween: 12,
                grabCursor: true,
                breakpoints: {
                    767.98: {
                        slidesPerView: "auto",
                        spaceBetween: 20,
                    },
                    1199.98: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    }
                }
            })
        })
    }


    if (document.querySelector('.product-info__nav')) {

        const navLinks = document.querySelectorAll('.product-info__nav-link');
        let swiperInstance;


        function removeActiveClasses() {
            navLinks.forEach(link => link.classList.remove('active'));
        }

        function addActiveClass(targetId) {
            removeActiveClasses();
            const activeLink = document.querySelector(`.product-info__nav-link[href="#${targetId}"]`);
            activeLink.classList.add('active');


            const activeIndex = Array.from(navLinks).indexOf(activeLink);
            if (swiperInstance) {
                swiperInstance.slideTo(activeIndex);
            }
        }

        function getStickyHeaderHeight() {
            const header = document.querySelector('header');
            return header ? header.offsetHeight : 0;
        }

        function getNavbarHeight() {
            const navbar = document.querySelector('.product-info__navbar');
            return navbar ? navbar.offsetHeight : 0;
        }


        gsap.registerPlugin(ScrollTrigger);



        const sections = document.querySelectorAll('.product-info__block');

        sections.forEach(section => {
            let trigger = ScrollTrigger.create({
                trigger: section,
                start: () => {

                    return `top top+=${getStickyHeaderHeight() + getNavbarHeight()}`
                },
                end: `bottom top+=${getStickyHeaderHeight() + getNavbarHeight()} `,
                onEnter: () => addActiveClass(section.id),
                onEnterBack: () => addActiveClass(section.id),
                // markers: true,
                onLeave: ({ direction }) => {
                    if (direction === 1) {
                        const nextSection = sections[Array.from(sections).indexOf(section)];
                        if (nextSection) addActiveClass(nextSection.id);
                    }
                },
                onEnterBack: ({ direction }) => {

                    if (direction === -1) {
                        const prevSection = sections[Array.from(sections).indexOf(section)];
                        if (prevSection) addActiveClass(prevSection.id);
                    }
                }
            });

            window.addEventListener('scroll', () => {
                trigger.update()
            })

        });



        window.addEventListener('scroll', () => {
            const activeLink = document.querySelector('.product-info__nav-link.active');
            if (activeLink) {
                const activeIndex = Array.from(navLinks).indexOf(activeLink);
                if (swiperInstance) {
                    swiperInstance.slideTo(activeIndex, 0);
                }
            }
        });


        if (document.querySelector('.product-info__navbar')) {
            swiperInstance = new Swiper('.product-info__navbar', {
                slidesPerView: "auto",
                grabCursor: true,
                slideToClickedSlide: true
            });
        }
    }

    window.addEventListener('scroll', function (e) {
        if (scrollY > 0) {
            document.querySelector('.header').classList.add('scroll')
        } else {
            setTimeout(() => {
                document.querySelector('.header').classList.remove('scroll')
            }, 100)
        }
        document.body.style.setProperty("--header-height", document.querySelector('.header').offsetHeight + "px")
    })



    // configurator

    if (document.querySelectorAll('.configurator__block-input').length > 0) {
        let updateSidePanel = () => {
            let configuratorProps = document.getElementById('configurator-props');
            let anyChecked = document.querySelectorAll('.configurator__block-input:checked').length > 0;
            if (anyChecked) {
                configuratorProps.classList.add('active');
            } else {
                configuratorProps.classList.remove('active');
            }
        };

        let updateProductNumber = () => {
            let optics = document.querySelector('input[name="optics"]:checked')?.value || '';
            let led = document.querySelector('input[name="led"]:checked')?.value || '';
            let color = document.querySelector('input[name="color"]:checked')?.value || '';
            let extras = document.querySelector('input[name="extras"]:checked')?.value || '';

            let productNumber = [optics, led, color, extras].filter(Boolean).join('-');
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


                let followingRow = row.nextElementSibling;
                while (followingRow) {
                    followingRow.classList.remove('active');
                    followingRow.querySelector('.configurator__side-value').textContent = '';
                    followingRow = followingRow.nextElementSibling;
                }
            }
        };

        document.querySelectorAll('.configurator__block-input').forEach(configuratorInput => {
            configuratorInput.addEventListener('change', (e) => {
                let checkbox = e.target;
                let options = checkbox.closest('.configurator__block-options');
                let stepCheckboxes = options.querySelectorAll('.configurator__block-input');
                let parentBlock = checkbox.closest('.configurator__block');
                let nextBlock = parentBlock.nextElementSibling;

                if (checkbox.checked) {
                    stepCheckboxes.forEach(stepCheckbox => {
                        if (stepCheckbox !== checkbox) {
                            stepCheckbox.disabled = true;
                        }
                    });
                    if (nextBlock) {
                        nextBlock.classList.add('active');
                    }
                } else {
                    stepCheckboxes.forEach(stepCheckbox => {
                        stepCheckbox.disabled = false;
                    });

                    let followingBlock = parentBlock.nextElementSibling;
                    while (followingBlock) {
                        let followingCheckboxes = followingBlock.querySelectorAll('.configurator__block-input');
                        followingCheckboxes.forEach(followingCheckbox => {
                            followingCheckbox.checked = false;
                            followingCheckbox.disabled = false;
                        });
                        followingBlock.classList.remove('active');
                        followingBlock = followingBlock.nextElementSibling;
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
                } else if (name === 'optics') {
                    if (checkbox.checked) {
                        row.classList.add('active');
                        row.querySelector('.configurator__side-value').textContent = checkbox.nextElementSibling.textContent;
                    }
                    updateProductNumber();
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
        });
    }

    if (document.querySelector('[data-product-id]')) {

        const caseColorInputs = document.querySelectorAll('input[name="case-color"]');
        const ledColorInputs = document.querySelectorAll('input[name="led-color"]');
        const productImage = document.querySelector('.product-card__image img');
        const productId = productImage.getAttribute('data-product-id');

        function updateProductImage() {
            const caseColor = document.querySelector('input[name="case-color"]:checked').value;
            const ledColor = document.querySelector('input[name="led-color"]:checked').value;
            const newSrc = `img/products/spotlights/${productId}-${caseColor}-${ledColor}.png`;
            productImage.setAttribute('src', newSrc);

            productImage.classList.remove('fade-in');

            setTimeout(() => {
                productImage.src = newSrc;
                productImage.classList.add('fade-in');
            }, 300);

        }

        caseColorInputs.forEach(input => {
            input.addEventListener('change', updateProductImage);
        });

        ledColorInputs.forEach(input => {
            input.addEventListener('change', updateProductImage);
        });


        updateProductImage();
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







})




