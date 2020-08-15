// Utils functions
var $ = id=> document.getElementById(id);
var createElement = type => document.createElement(type);

var PI = Math.PI;
var CIRCLE_ANGLE = 2 * PI;
// TODO: faire un alias pour Math.random();

// TODO: faire une fonction au lieu d'un prototype
Array.prototype.getRandom = function(){
    return this[~~(Math.random()*this.length)];
}

function getRandomNumber(min, max) {
    return ~~(Math.random() * (max - min + 1)) + min;
}