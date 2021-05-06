const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react("resources/js/app.js", "public/js")
    .sass("resources/sass/app.scss", "public/css")
    .options({
        processCssUrls: false
    })
    .browserSync({
        proxy: "localhost:8000",
        files: [
            "app/**/*",
            "public/**/*",
            "resources/views/**/*",
            "resources/lang/**/*",
            "routes/**/*"
        ],
        notify: {
            styles: {
                top: "auto",
                bottom: "0"
            }
        },
        ghostMode: false,
        logFileChanges: true,
        watch: true,
        mode: "production"
    });
mix.disableNotifications();
