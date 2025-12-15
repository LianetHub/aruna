export const cookies = () => {
    window.onload = function () {
        function getCookie(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        function setCookie(name, value, options) {
            options = options || {};
            var expires = options.expires;

            if (typeof expires == "number" && expires) {
                var d = new Date();
                d.setTime(d.getTime() + expires * 1000);
                expires = options.expires = d;
            }
            if (expires && expires.toUTCString) {
                options.expires = expires.toUTCString();
            }
            value = encodeURIComponent(value);
            var updatedCookie = name + "=" + value;

            for (var propName in options) {
                updatedCookie += "; " + propName;
                var propValue = options[propName];
                if (propValue !== true) {
                    updatedCookie += "=" + propValue;
                }
            }

            document.cookie = updatedCookie;
        }

        var noticed = getCookie('cookie_notice');
        if (typeof noticed === 'undefined' || noticed != 1) {
            var noticeDiv = document.createElement('div');
            noticeDiv.classList.add('cookie', 'cookie--hidden');
            noticeDiv.innerHTML =
                '<div class="cookie__text">' +
                'Мы используем файлы cookie, чтобы сайт работал&nbsp;лучше. Оставаясь с нами, вы соглашаетесь на использование файлов cookie.' +
                '</div>' +
                '<button type="button" class="cookie__accept btn btn-white-outline btn-sm">Хорошо</button>';

            document.body.appendChild(noticeDiv);

            setTimeout(() => {
                noticeDiv.classList.remove('cookie--hidden');
            }, 100);

            document.querySelector('.cookie__accept').addEventListener('click', function () {
                setCookie('cookie_notice', 1, { expires: 180 * 24 * 60 * 60, path: '/' });
                noticeDiv.classList.add('cookie--hidden');

                setTimeout(() => {
                    noticeDiv.remove();
                }, 500);
            });
        }
    }
}