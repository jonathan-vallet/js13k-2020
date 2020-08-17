// alias functions
var $ = id=> document.getElementById(id);
var createElement = type => document.createElement(type);
var random = () => Math.random();
var PI = Math.PI;
var CIRCLE_ANGLE = 2 * PI;

// Get a random item from an array
function getRandomItem(array) {
    return array[~~(random() * array.length)];
}

// Get a random int in a range
function getRandomNumber(min, max) {
    return ~~(random() * (max - min + 1)) + min;
}