export const initHeaderObserver = () => {
    const headerWrapper = document.querySelector('.header__wrapper');

    if (headerWrapper) {
        const updateHeaderHeight = () => {
            const height = headerWrapper.offsetHeight;
            document.body.style.setProperty("--header-height", `${height}px`);
        };


        const observer = new ResizeObserver(updateHeaderHeight);
        observer.observe(headerWrapper);
    }

    const headerElement = document.querySelector('.header');

    const scrollTrigger = document.createElement('div');
    scrollTrigger.style.position = 'absolute';
    scrollTrigger.style.top = '0';
    scrollTrigger.style.height = '1px';
    scrollTrigger.style.width = '1px';
    scrollTrigger.style.opacity = '0';
    scrollTrigger.style.pointerEvents = 'none';
    document.body.prepend(scrollTrigger);

    const scrollCallback = (entries) => {

        if (!entries[0].isIntersecting) {
            headerElement.classList.add('scroll');
        } else {
            headerElement.classList.remove('scroll');
        }
    };

    const headerObserver = new IntersectionObserver(scrollCallback);
    headerObserver.observe(scrollTrigger);



    const saleBanner = document.querySelector('.sale-banner');

    if (saleBanner) {
        const saleBannerWrapper = saleBanner.querySelector('.sale-banner__wrapper');
        const closeBtn = saleBanner.querySelector('.sale-banner__close');
        const storageKey = 'sale-banner-closed';


        const closeBanner = () => {
            saleBanner.classList.remove('visible');

            sessionStorage.setItem(storageKey, 'true');
        };

        const isClosedInSession = sessionStorage.getItem(storageKey);

        if (!isClosedInSession) {

            setTimeout(() => {
                saleBanner.classList.add('visible');

            }, 3000);
        }


        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeBanner();
            });
        }

        saleBanner.addEventListener('click', (e) => {
            closeBanner();
        });

        if (saleBannerWrapper) {
            saleBannerWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
}