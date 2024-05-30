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
    devFunctions.beforeSlider();
    devFunctions.formSubmit()




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
        // if (scrollY > 0) {
        //     document.querySelector('.header').classList.add('scroll')
        // } else {
        //     setTimeout(() => {
        //         document.querySelector('.header').classList.remove('scroll')
        //     }, 100)
        // }
        document.body.style.setProperty("--header-height", document.querySelector('.header').offsetHeight + "px")
    })
















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




