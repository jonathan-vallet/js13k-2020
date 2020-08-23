function generateDice(number) {
    let dice = createElement('ol');
    dice.classList.add('c-dice');
    random() > 0.5 && dice.classList.add('-odd-roll');
    let roll = getRandomNumber(1, 6);
    let facesHTML = '';
    let dotsHtml = '';
    for (let faceNumber = 1; faceNumber < 7; ++faceNumber) {
        dotsHtml += `<span class="c-dice__dot"></span>`;
        facesHTML += `<li class="c-dice__face" data-side="${faceNumber}">${dotsHtml}</li>`;
    }
    dice.innerHTML = facesHTML;
    $('c-diceList').append(dice);
}

function rollDices() {
    [...$$('.c-dice')].forEach(dice => {
        dice.classList.toggle('-odd-roll');
        let roll = getRandomNumber(1, 6);
        dice.setAttribute('data-roll', roll);
        let dragabbleDice = dice.querySelector(`[draggable]`);
        dragabbleDice && dragabbleDice.removeAttribute('draggable');
        dice.querySelector(`[data-side="${roll}"]`).setAttribute('draggable', 'true');
    });
}