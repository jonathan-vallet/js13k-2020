function generateDice(roll) {
    let dice = createElement('ol');
    dice.classList.add('c-dice');
    random() > 0.5 && dice.classList.add('-odd-roll');
    let facesHTML = '';
    let dotsHtml = '';
    for (let faceNumber = 1; faceNumber < 7; ++faceNumber) {
        dotsHtml += `<span class="c-dice__dot"></span>`;
        facesHTML += `<li class="c-dice__face" data-side="${faceNumber}">${dotsHtml}</li>`;
    }
    dice.innerHTML = facesHTML;
    dice.id = `dice-${$diceList.childElementCount}` ;
    dice.setAttribute('data-roll', roll || getRandomNumber(1, 6));
    dice.ondragstart = (event) => {
        event.dataTransfer.setData("text/plain", event.target.parentNode.id);
        checkPlayableCards(event.currentTarget.getAttribute('data-roll'), ($element) => {
            $element.classList.add('-active');
        });
    }
    dice.ondragend = (event) => {
        checkPlayableCards(event.currentTarget.getAttribute('data-roll'), ($element) => {
            $element.classList.remove('-active');
        });
    }
    $diceList.append(dice);
    if(roll) {
        rollDice(dice, roll);
    }
}

function rollDices() {
    [...$$$('.c-dice')].forEach(dice => {
        rollDice(dice);
    });
}

function rollDice(dice, roll) {
    if(!roll) {
        dice.classList.toggle('-odd-roll');
        roll = getRandomNumber(1, 6);
    }
    dice.setAttribute('data-roll', roll);
    let dragabbleDice = dice.querySelector(`[draggable]`);
    dragabbleDice && dragabbleDice.removeAttribute('draggable');
    dice.querySelector(`[data-side="${roll}"]`).setAttribute('draggable', 'true');
}

function checkPlayableCards(diceValue, callback) {
    myHandList.forEach((cardId, handCardIndex) => {
        let cardDice = cardList[cardId].d;
        cardDice.split('|').forEach((dice, cardDiceIndex) => {
            let isPlayable = isDicePlayable(handCardIndex, cardDiceIndex, diceValue);
            if(isPlayable) {
                let $dice = $myHand.querySelector(`[data-hand="${handCardIndex}"] [data-dice="${cardDiceIndex}"]`);
                callback($dice);
            }
        });
    });
}

function isDicePlayable(handCardIndex, cardDiceIndex, diceValue) {
    let cardDiceValue = cardList[myHandList[handCardIndex]].d;
    var match = cardDiceValue.match(/([-+*]?)([0-9])/);
    if (match) {
        cardDiceValue = match[2];
        switch (match[1]) {
            case '-': return diceValue <= cardDiceValue;
            case '+': return diceValue >= cardDiceValue;
            default: return cardDiceValue == diceValue;
        }
    }
     if (cardDiceValue === 'double') {
        // TODO: check if other dice is "played" or not
        return true;
    }
    if(cardDiceValue === 'odd') {
        return diceValue % 2;
    }
    if(cardDiceValue === 'even') {
        return diceValue % 2 == 0;
    }
}