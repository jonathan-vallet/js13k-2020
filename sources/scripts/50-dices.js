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
    dice.ondragstart = (event) => {
        checkPlayableCards(event.currentTarget.dataset.roll, ($element) => {
            $element.style.background = 'red';
        });
    }
    dice.ondragend = (event) => {
        checkPlayableCards(event.currentTarget.dataset.roll, ($element) => {
            $element.style.background = '';
        });
    }
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

function checkPlayableCards(diceValue, callback) {
    myHandList.forEach((cardId, handCardIndex) => {
        let cardDice = cardList[cardId].dice;
        cardDice.split('|').forEach((dice, cardDiceIndex) => {
            let isPlayable = isDicePlayable(diceValue, dice);
            if(isPlayable) {
                callback($(`hand-card-${handCardIndex}-${cardDiceIndex}`));
            }
        });
    });
}

function isDicePlayable(diceValue, cardDice) {
    var match = cardDice.match(/([-+*]?)([0-9])/);
    if (match) {
        let cardDiceValue = match[2];
        switch (match[1]) {
            case '-': return diceValue <= cardDiceValue;
            case '+': return diceValue >= cardDiceValue;
            default: return cardDiceValue == diceValue;
        }
    }
     if (cardDice === 'double') {
        // TODO: check if other dice is "played" or not
        return true;
    }
    if(cardDice === 'odd') {
        return diceValue % 2;
    }
    if(cardDice === 'even') {
        return diceValue % 2 == 0;
    }
}