export const initHeaderObserver = () => {

    const headerWrapper = document.querySelector('.header__wrapper');
    if (headerWrapper) {
        const updateHeaderHeight = () => {
            document.body.style.setProperty("--header-height", `${headerWrapper.offsetHeight}px`);
        };
        new ResizeObserver(updateHeaderHeight).observe(headerWrapper);
    }

    const headerElement = document.querySelector('.header');
    const scrollTrigger = document.createElement('div');
    Object.assign(scrollTrigger.style, { position: 'absolute', top: '0', height: '1px', width: '1px', opacity: '0', pointerEvents: 'none' });
    document.body.prepend(scrollTrigger);

    new IntersectionObserver((entries) => {
        headerElement.classList.toggle('scroll', !entries[0].isIntersecting);
    }).observe(scrollTrigger);


    const saleBanner = document.querySelector('.sale-banner');

    if (saleBanner) {
        const saleBannerWrapper = saleBanner.querySelector('.sale-banner__wrapper');
        const closeBtn = saleBanner.querySelector('.sale-banner__close');
        const storageKey = 'sale-banner-closed';


        const closeBanner = () => {
            saleBanner.classList.remove('visible');
            sessionStorage.setItem(storageKey, 'true');

            setTimeout(() => {
                if (saleBannerWrapper) saleBannerWrapper.style.transform = '';
            }, 300);
        };


        if (!sessionStorage.getItem(storageKey)) {
            setTimeout(() => {
                saleBanner.classList.add('visible');
            }, 3000);
        }


        closeBtn?.addEventListener('click', (e) => { e.preventDefault(); closeBanner(); });


        saleBanner.addEventListener('click', (e) => {
            if (e.target === saleBanner) closeBanner();
        });


        if (saleBannerWrapper) {
            let startY = 0;
            let currentY = 0;
            let isDragging = false;


            saleBannerWrapper.addEventListener('touchstart', (e) => {
                if (!saleBanner.classList.contains('visible')) return;

                startY = e.touches[0].clientY;
                isDragging = true;

                saleBannerWrapper.style.transition = 'none';
            }, { passive: true });


            saleBannerWrapper.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentY = e.touches[0].clientY;
                const diff = currentY - startY;


                if (diff > 0) {
                    saleBannerWrapper.style.transform = `translateY(${diff}px)`;
                }
            }, { passive: true });


            saleBannerWrapper.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;

                const diff = currentY - startY;
                const threshold = 100;

                saleBannerWrapper.style.transition = '';

                if (diff > threshold) {
                    saleBannerWrapper.style.transform = `translateY(calc(100% + 50px))`;
                    setTimeout(closeBanner, 300);
                } else {
                    saleBannerWrapper.style.transform = '';
                }
            });
        }
    }
}