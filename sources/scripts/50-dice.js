function generateDie(roll) {
    let die = createElement('ol');
    die.classList.add('c-die');
    random() > 0.5 && die.classList.add('-odd-roll');
    let facesHTML = '';
    let dotsHtml = '';
    for (let faceNumber = 1; faceNumber < 7; ++faceNumber) {
        dotsHtml += `<span class="c-die__dot"></span>`;
        facesHTML += `<li class="c-die__face" data-side="${faceNumber}">${dotsHtml}</li>`;
    }
    die.innerHTML = facesHTML;
    die.id = `die-${$dieList.childElementCount}` ;
    die.setAttribute('data-roll', roll || getRandomNumber(1, 6));
    die.onmouseover = (event) => {
        if(gameLoadingState > 0) {
            return;
        }
        checkPlayableCards(player, event.currentTarget.getAttribute('data-roll'), ($element) => {
            $element.classList.add('-active');
        });
    }
    die.ondragstart = (event) => {
        if(gameLoadingState > 0) {
            return;
        }
        draggedDieId = event.target.parentNode.id;
        checkPlayableCards(player, event.currentTarget.getAttribute('data-roll'), ($element) => {
            $element.classList.add('-active');
        });
    }
    die.onmouseleave = (event) => {
        checkPlayableCards(player, event.currentTarget.getAttribute('data-roll'), ($element) => {
            $element.classList.remove('-active');
        });
    }
    die.ondragend = (event) => {
        checkPlayableCards(player, event.currentTarget.getAttribute('data-roll'), ($element) => {
            $element.classList.remove('-active');
        });
    }
    $dieList.append(die);
    if(roll) {
        rollDie(die, roll);
    }
}

function rollDice() {
    [...$$$('.c-die')].forEach(die => {
        rollDie(die);
    });
}

function rollDie(die, roll) {
    if(!roll) {
        die.classList.toggle('-odd-roll');
        roll = getRandomNumber(1, 6);
    }
    die.setAttribute('data-roll', roll);
    let dragabbleDie = die.querySelector(`[draggable]`);
    dragabbleDie && dragabbleDie.removeAttribute('draggable');
    die.querySelector(`[data-side="${roll}"]`).setAttribute('draggable', 'true');
}

function checkPlayableCards(guy, dieValue, callback) {
    guy.hand.forEach((cardId, handCardIndex) => {
        let cardDie = cardList[cardId].d;
        cardDie.split('|').forEach((die, cardDieIndex) => {
            let isPlayable = isDiePlayable(guy, handCardIndex, cardDieIndex, dieValue);
            if(isPlayable) {
                let $die = $myHand.querySelector(`[data-hand="${handCardIndex}"] [data-die="${cardDieIndex}"]`);
                callback($die);
            }
        });
    });
}

function isDiePlayable(guy, handCardIndex, cardDieIndex, dieValue) {
    let cardDieValue = cardList[guy.hand[handCardIndex]].d;
    var match = cardDieValue.match(/([-+*]?)([0-9])/);
    if (match) {
        cardDieValue = match[2];
        switch (match[1]) {
            case '-': return dieValue <= cardDieValue;
            case '+': return dieValue >= cardDieValue;
            default: return cardDieValue == dieValue;
        }
    }
    if (cardDieValue === '') {
        // TODO: check if other die is "played" or not
        return true;
    }
    if (cardDieValue === 'double') {
        // TODO: check if other die is "played" or not
        return true;
    }
    if(cardDieValue === 'odd') {
        return dieValue % 2;
    }
    if(cardDieValue === 'even') {
        return dieValue % 2 == 0;
    }
}