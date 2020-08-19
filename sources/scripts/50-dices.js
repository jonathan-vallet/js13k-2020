function generateDice(number) {
    let dice = createElement('ol');
    dice.classList.add('c-dice');
    random() > 0.5 && dice.classList.add('-odd-roll');
    dice.setAttribute('data-roll', getRandomNumber(1, 6));
    let facesHTML = '';
    let dotsHtml = '';
    for (let faceNumber = 1; faceNumber < 7; ++faceNumber) {
        dotsHtml += `<span class="c-dice__dot"></span>`;
        facesHTML += `<li class="c-dice__face" data-side="${faceNumber}">${dotsHtml}</li>`;
    }
    dice.innerHTML = facesHTML;
    $('c-diceList').appendChild(dice);
}

function rollDices() {
    [...$$('.c-dice')].forEach(die => {
        die.classList.toggle('-odd-roll');
        die.setAttribute('data-roll', getRandomNumber(1, 6));
    });
}