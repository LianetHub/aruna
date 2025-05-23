import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";
import rename from 'gulp-rename';

export const otf2ttf = () => {
    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "FONTS",
                    message: "Error: <%= error.message %>",
                })
            )
        )
        .pipe(
            fonter({
                formats: ["ttf"],
            })
        )
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
};

export const ttfToWoff = () => {
    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "FONTS",
                    message: "Error: <%= error.message %>",
                })
            )
        )
        .pipe(
            fonter({
                formats: ["woff"],
            })
        )
        .pipe(
            rename((file) => {
                if (file.basename === "icons") {
                    file.basename = `${file.basename}-${Date.now()}`;
                }
            })
        )
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        .pipe(ttf2woff2())
        .pipe(
            rename((file) => {
                if (file.basename === "icons") {
                    file.basename = `${file.basename}-${Date.now()}`;
                }
            })
        )
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
};
export const copyWoff = () => {
    return app.gulp
        .src(`${app.path.srcFolder}/fonts/*.woff`)
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.woff2`))
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
};

export const fontsStyle = () => {
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;

    // Проверяем наличие папки с шрифтами
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            // Если файл существует, удаляем его
            if (fs.existsSync(fontsFile)) {
                fs.unlinkSync(fontsFile);
                console.log("Файл scss/fonts.scss актуализирован");
            } else {
                console.log("Файл scss/fonts.scss создан");
            }

            // Создаем новый файл
            fs.writeFile(fontsFile, "", cb);
            let newFileOnly;

            for (let i = 0; i < fontsFiles.length; i++) {
                let fontFileName = fontsFiles[i].split(".")[0];
                if (newFileOnly !== fontFileName) {
                    let fontName = fontFileName.split("-")[0] ? fontFileName.split("-")[0] : fontFileName;
                    let fontWeight = fontFileName.split("-")[1] ? fontFileName.split("-")[1] : fontFileName;

                    switch (fontWeight.toLowerCase()) {
                        case "thin": fontWeight = 100; break;
                        case "extralight": fontWeight = 200; break;
                        case "light": fontWeight = 300; break;
                        case "book": fontWeight = 350; break;
                        case "medium": fontWeight = 500; break;
                        case "semibold":
                        case "demi": fontWeight = 600; break;
                        case "bold": fontWeight = 700; break;
                        case "extrabold":
                        case "heavy": fontWeight = 800; break;
                        case "black": fontWeight = 900; break;
                        default: fontWeight = 400; break;
                    }

                    let dateHash = Date.now();

                    fs.appendFile(fontsFile,
                        `@font-face {
                            font-family: '${fontName}';
                            font-display: swap;
                            src: url("../fonts/${fontFileName === "icons" ? `${fontFileName}-${dateHash}` : fontFileName}.woff") format("woff"), url("../fonts/${fontFileName === "icons" ? `${fontFileName}-${dateHash}` : fontFileName}.woff2") format("woff2");
                            font-weight: ${fontWeight};
                            font-style: normal;
                        }\r\n`, cb);
                    newFileOnly = fontFileName === "icons" ? `${fontFileName}-${dateHash}` : fontFileName;
                }
            }
        }
    });

    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() { }
};
