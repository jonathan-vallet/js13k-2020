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

document.getElementById("roll-button").addEventListener("click", rollDice);