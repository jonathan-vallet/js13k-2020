const $ = id=> document.getElementById(id);
const createElement = type => document.createElement(type);

function generateDice(number) {
    console.log('generate dice');
    let dice = createElement('ol');
    dice.classList.add('c-dice');
    dice.classList.add(`-${number === 1 ? 'odd' : 'even'}-roll`);
    dice.setAttribute('data-roll', 1);
    let facesHTML = '';
    for (let faceNumber = 1; faceNumber < 7; ++faceNumber) {
        facesHTML += `<li class="c-dice__face" data-side="${faceNumber}">`
        for (let dotNumber = 0; dotNumber < faceNumber; ++dotNumber) {
            facesHTML += `<span class="c-dice__dot"></span>`;
        }
        facesHTML += `</li>`
    }
    dice.innerHTML = facesHTML;
    document.querySelector('.c-diceList').appendChild(dice);
    console.log(dice);
}

generateDice(1);

function rollDice() {
    const dice = [...document.querySelectorAll(".c-dice")];
    dice.forEach(die => {
        toggleClasses(die);
        die.dataset.roll = getRandomNumber(1, 6);
    });
}

function toggleClasses(die) {
    die.classList.toggle("-odd-roll");
    die.classList.toggle("-even-roll");
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("roll-button").addEventListener("click", rollDice);