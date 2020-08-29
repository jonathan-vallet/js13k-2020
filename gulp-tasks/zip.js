module.exports = function() {
    const gulp = require('gulp');
    const util = require('gulp-util');
    const replace = require('gulp-replace');
    const inlinesource = require('gulp-inline-source');
    const zip           = require('gulp-zip');
    const advzip = require('gulp-advzip');
    const checkFileSize = require('gulp-check-filesize');

    const config = util.env.boilerplate.config;
    const zipConfig = config.tasks.zip;

    var replaceList = {
        // Element ids
        'allCardList': 'acl',
        'myDeckList': 'mcl',
        'avatarChoiceList': 'ach',
        'myAvatar': 'ma',
        'continueButton': 'cb',
        'playerAvatar': 'pa',
        'opponentAvatar': 'oa',
        'myDeck': 'md',
        'myHand': 'mh',
        'endTurnButton': 'etb',
        'mapWrapper': 'mw',
        // Dices
        'c-diceList': 'dl',
        // Cards
        'c-card__card': 'cc',
        'c-card__content': 'co',
        'c-card__diceList': 'cdl',
        'c-card__dice': 'cd',
        'c-card__dot': 'ct',
        'c-card__effect': 'ce',
        'c-card__class': 'cl',
        'c-card__rarity': 'cr',
        'c-card': 'c',
        'c-dice__dot': 'dd',
        'c-dice__face': 'df',
        'c-dice': 'd',
        '-odd-roll': 'or',
        '-rarity': 'r',
        '-played': 'p',
        // Screens
        'screen-class-choice': 'scc',
        'screen-game': 'sg',
        'screen-map': 'sm',
        'data-screen': 'data-sc',
        'l-screen': 'ls',
        // Avatar
        'js-screen-link': 'jsl',
    }

    var valueList = [];
    for (var text in replaceList) {
        if (replaceList.hasOwnProperty(text)) {
            var value = replaceList[text];
            if(valueList.indexOf(value) >=0) {
                console.log('----------- duplicate replace value: "' + value + '"')
            } else {
                valueList.push(value);
            }
        }
    }
    
    gulp.task('zip', function () {
        var task = gulp.src(config.destinationRoot + zipConfig.source).pipe(inlinesource({
            compress: false
        }));
            
        for (var text in replaceList) {
            if (replaceList.hasOwnProperty(text)) {
                task = task.pipe(replace(text, replaceList[text]));
            }
        }

        return task.pipe(zip(zipConfig.filename))
            .pipe(advzip({optimizationLevel: 4}))
            .pipe(gulp.dest(zipConfig.destination))
            .pipe(checkFileSize({
                fileSizeLimit: 1024 * 13 * 2
            }));
    });
};