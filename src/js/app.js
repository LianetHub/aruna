"use strict";


import * as devFunctions from './modules/functions.js';
import { configurator } from './modules/configurator.js';


//  init Fancybox
if (typeof Fancybox !== "undefined" && Fancybox !== null) {

    const defaultTitles = new WeakMap();

    Fancybox.bind("[data-fancybox]", {
        dragToClose: false,
        closeButton: false,
        on: {
            reveal: (fancybox, slide) => {

                const customTitle = slide?.title;
                const slideContent = slide.el;

                if (!slideContent) return;


                const popupTitle = slideContent.querySelector('.popup__title');
                if (!popupTitle) return;


                if (!defaultTitles.has(popupTitle)) {
                    defaultTitles.set(popupTitle, popupTitle.textContent.trim());
                }

                const defaultTitle = defaultTitles.get(popupTitle);
                popupTitle.textContent = customTitle || defaultTitle;
            }
        }
    });



    Fancybox.bind('[data-fancybox-video]', {
        closeButton: false,
        on: {
            reveal: (instance) => {

                const slide = instance.getSlide();

                const trigger = slide?.triggerEl;
                if (!trigger) return;

                const videoCode = trigger.dataset.videoCode;
                const ownerId = trigger.dataset.ownerId;
                const container = document.querySelector("#vk-video-container");

                if (videoCode && ownerId && container) {
                    const vkVideoUrl = `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoCode}&hd=2&autoplay=1&mute=0`;

                    const iframe = document.createElement("iframe");
                    iframe.src = vkVideoUrl;
                    iframe.frameBorder = "0";
                    iframe.allow = "autoplay; encrypted-media";
                    iframe.allowFullscreen = true;
                    iframe.width = "100%";
                    iframe.height = "100%";

                    container.innerHTML = "";
                    container.appendChild(iframe);
                }
            },

            close: () => {

                const container = document.querySelector("#vk-video-container");
                if (container) container.innerHTML = "";
            },
        },
    });
}


document.addEventListener('DOMContentLoaded', () => {

    devFunctions.OS();
    devFunctions.isWebp();
    devFunctions.intInputMask();
    devFunctions.beforeSlider();
    devFunctions.formSubmit();
    devFunctions.animation();

    configurator();

    document.querySelectorAll('.select')?.forEach(element => {
        new devFunctions.CustomSelect(element);
    });


    // event handlers

    document.addEventListener('click', (e) => {

        const target = e.target;


        if (target.closest('.icon-menu') || (target.classList.contains('menu') && document.querySelector('.header').classList.contains('open-menu'))) {
            getMenu()
        }

        if (target.classList.contains('banner__close')) {
            target.closest('.banner').classList.add('banner-hidden');
        }

        if (target.classList.contains('promo__btn')) {

            const contactsBlock = document.getElementById('feedback');
            const form = contactsBlock.querySelector('form');
            const firstInput = form.querySelector('input');

            if (firstInput) {

                setTimeout(() => {
                    firstInput.focus();
                }, 1000)
            }
        }

        if (target.classList.contains('product-info__nav-link')) {
            document.querySelectorAll('.product-info__nav-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll('.product-info__block').forEach(content => content.classList.remove('active'));

            let currentIndex = getIndexInParent(target.parentNode);
            document.querySelectorAll('.product-info__nav-link')[currentIndex].classList.add('active')
            document.querySelectorAll('.product-info__block')[currentIndex].classList.add('active')


        }


        if (target.matches('.configurator__side-btn')) {
            let currentInstance = Fancybox.getInstance();
            let configurator = document.querySelector('.configurator');
            let formDataConfigurator = new FormData(configurator);

            const jsonformDataConfigurator = {};

            formDataConfigurator.forEach((value, key) => {
                jsonformDataConfigurator[key] = value;
            });

            const jsonStringFormData = JSON.stringify(jsonformDataConfigurator);


            currentInstance.on('done', function () {
                let currentForm = currentInstance.container.querySelector('.popup__form');
                let input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'configurator-data';
                input.value = jsonStringFormData;
                currentForm.appendChild(input)
            });

            currentInstance.on('close', function () {
                document.querySelector('[name="configurator-data"]').remove();
            });
        }


    });

    function getMenu() {
        document.body.classList.toggle('lock');
        document.querySelector('.header').classList.toggle('open-menu');
    }


    function getIndexInParent(node) {
        var children = node.parentNode.childNodes;
        var num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == node) return num;
            if (children[i].nodeType == 1) num++;
        }
        return -1;
    }




    //  sliders

    if (document.querySelector('.products__slider')) {
        new Swiper('.products__slider', {
            slidesPerView: "auto",
            spaceBetween: 16,
            grabCursor: true,
            navigation: {
                nextEl: '.products__next',
                prevEl: '.products__prev'
            },
            breakpoints: {
                991.98: {
                    spaceBetween: 42,
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

    if (document.querySelector('.product-info__navbar')) {

        new Swiper('.product-info__navbar', {
            slidesPerView: "auto",
            grabCursor: true,
            slideToClickedSlide: true
        });
    }

    // animation header
    window.addEventListener('scroll', function (e) {

        document.body.style.setProperty("--header-height", Math.ceil(document.querySelector('.header__wrapper').offsetHeight) + "px")
    })


    const headerElement = document.querySelector('.header');

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            headerElement.classList.remove('scroll');
        } else {
            headerElement.classList.add('scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);


    // widget animation

    const widget = document.querySelector('.widgets');
    if (widget) {


        function toggleWidgetVisibility() {
            if (window.scrollY > 300) {
                widget.classList.add('visible');
            } else {
                widget.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', toggleWidgetVisibility);

        toggleWidgetVisibility()
    }



    // selecting colors

    if (document.querySelector('[data-product]')) {

        const caseColorInputs = document.querySelectorAll('input[name="case-color"]');
        const ledColorInputs = document.querySelectorAll('input[name="led-color"]');
        const productImage = document.querySelector('.product-card__image img');
        const productSource = document.querySelector('.product-card__image source');




        function updateProductImage() {
            const caseColor = document.querySelector('input[name="case-color"]:checked').value;
            const ledColor = document.querySelector('input[name="led-color"]:checked').value;

            if (typeof productImageData == "undefined" || productImageData == null) return;

            let imageKey = productImageData[caseColor + "_" + ledColor];


            const newSrc = imageKey.png;
            const newWebpSrc = imageKey.webp;

            productImage.src = newSrc;
            if (productSource) productSource.srcset = newWebpSrc;

        }

        function preloadImages() {
            const caseColors = Array.from(caseColorInputs).map(input => input.value);
            const ledColors = Array.from(ledColorInputs).map(input => input.value);
            const hiddenContainer = document.createElement('div');
            hiddenContainer.style.display = 'none';
            document.body.appendChild(hiddenContainer);

            caseColors.forEach(caseColor => {
                ledColors.forEach(ledColor => {
                    const img = document.createElement('img');
                    const source = document.createElement('source');

                    if (typeof productImageData == "undefined" || productImageData == null) return;
                    let imageKey = productImageData[caseColor + "_" + ledColor];
                    img.src = imageKey.png;
                    source.srcset = imageKey.webp;
                    hiddenContainer.appendChild(img);
                    hiddenContainer.appendChild(source);
                });
            });

            setTimeout(() => {
                document.body.removeChild(hiddenContainer);
            }, 3000);
        }

        caseColorInputs.forEach(input => {
            input.addEventListener('change', updateProductImage);
        });

        ledColorInputs.forEach(input => {
            input.addEventListener('change', updateProductImage);
        });


        updateProductImage();
        preloadImages();
    }


    const colorBlocks = document.querySelectorAll('.product-card__colors');
    if (colorBlocks.length > 0) {

        colorBlocks.forEach(block => {
            const currentColorDisplay = block.querySelector('.product-card__colors-current');
            const colorItems = block.querySelectorAll('.product-card__colors-item');

            colorItems.forEach(item => {
                const btn = item.querySelector('.product-card__colors-btn');
                const input = item.querySelector('input');

                btn.addEventListener('mouseenter', function () {
                    currentColorDisplay.textContent = btn.getAttribute('title');
                });

                btn.addEventListener('mouseleave', function () {
                    const checkedInput = block.querySelector('.product-card__colors-input:checked');
                    const checkedImg = checkedInput.nextElementSibling;
                    currentColorDisplay.textContent = checkedImg.getAttribute('title');
                });

                input.addEventListener('change', function () {
                    const checkedImg = input.nextElementSibling;
                    currentColorDisplay.textContent = checkedImg.getAttribute('title');
                });
            });
        });
    }

    // end selecting colors


    const selectType = document.querySelector('select[name="type"]');
    const buildingFields = document.querySelector('fieldset#building-fields');
    const bridgeFields = document.querySelector('fieldset#bridge-fields');
    const monumentFields = document.querySelector('fieldset#monument-fields');
    const parkFields = document.querySelector('fieldset#park-fields');
    const streetFields = document.querySelector('fieldset#street-fields');
    const customFields = document.querySelector('fieldset#custom-option-fields');

    selectType?.addEventListener('change', () => {

        buildingFields?.setAttribute('inert', 'true');
        bridgeFields?.setAttribute('inert', 'true');
        monumentFields?.setAttribute('inert', 'true');
        parkFields?.setAttribute('inert', 'true');
        streetFields?.setAttribute('inert', 'true');
        customFields?.setAttribute('inert', 'true');

        buildingFields?.setAttribute('disabled', 'true');
        bridgeFields?.setAttribute('disabled', 'true');
        monumentFields?.setAttribute('disabled', 'true');
        parkFields?.setAttribute('disabled', 'true');
        streetFields?.setAttribute('disabled', 'true');
        customFields?.setAttribute('disabled', 'true');


        switch (selectType.value) {
            case 'Здание':
                buildingFields?.removeAttribute('inert');
                buildingFields?.removeAttribute('disabled');
                break;
            case 'Мост':
                bridgeFields?.removeAttribute('inert');
                bridgeFields?.removeAttribute('disabled');
                break;
            case 'Памятник':
                monumentFields?.removeAttribute('inert');
                monumentFields?.removeAttribute('disabled');
                break;
            case 'Парк/сквер':
                parkFields?.removeAttribute('inert');
                parkFields?.removeAttribute('disabled');
                break;
            case 'Улица':
                streetFields?.removeAttribute('inert');
                streetFields?.removeAttribute('disabled');
                break;
            case 'Свой вариант/другое':
                customFields?.removeAttribute('inert');
                customFields?.removeAttribute('disabled');
                break;
            default:
                break;
        }
    });



})

