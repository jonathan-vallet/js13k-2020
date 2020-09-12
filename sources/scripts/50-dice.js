function generateDie(roll) {
    let dieWrapper = createElement('div');
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
    die.id = `die-${++turnDieId}` ;
    let dieRoll = roll || getRandomNumber(1, 6);
    die.setAttribute('data-roll', dieRoll);
    die.onmouseover = (event) => {
        if(gameLoadingState > 0) {
            return;
        }
        checkPlayableCards(player, event.currentTarget.getAttribute('data-roll'), ($card) => {
            $card.classList.add('-highlight');
        });
    }
    die.ondragstart = (event) => {
        if(gameLoadingState > 0) {
            return;
        }
        draggedDieId = event.target.parentNode.id;
        checkPlayableCards(player, event.currentTarget.getAttribute('data-roll'), ($card) => {
            $card.classList.add('-highlight');
        });
    }
    die.onmouseleave = (event) => {
        checkPlayableCards(player, event.currentTarget.getAttribute('data-roll'), ($card) => {
            $card.classList.remove('-highlight');
        });
    }
    die.ondragend = (event) => {
        [...$$$('.c-card.-highlight')].forEach($card => {
            $card.classList.remove('-highlight');
        })
    }
    dieWrapper.append(die);
    $dieList.append(dieWrapper);
    dieList.push(dieRoll);

    if(roll) {
        rollDie(die, roll);
    }
}

function rollDice() {
    [...$$$('.c-die')].forEach(die => {
        rollDie(die);
    });
}

function rollDie($die, roll) {
    if(!roll) {
        $die.classList.toggle('-odd-roll');
        roll = getRandomNumber(1, 6);
    }
    $die.setAttribute('data-roll', roll);
    let dragabbleDie = $die.querySelector(`[draggable]`);
    dragabbleDie && dragabbleDie.removeAttribute('draggable');
    $die.querySelector(`[data-side="${roll}"]`).setAttribute('draggable', 'true');
}

function addDieEffect($die, effect) {
    let $effect = $die.nextSibling;
    if(!$effect) {
        $effect = createElement('p');
        $effect.classList.add('c-die__effect');
        $die.after($effect);
    }
    $effect.innerText += effect;
}

function checkPlayableCards(guy, dieValue, callback) {
    guy.hand.forEach((cardId, handCardIndex) => {
        if(isCardPlayable(cardId, dieValue)) {
            let $card = $myHand.querySelector(`[data-hand="${handCardIndex}"]`);
            callback($card);
        }
    });
}

function isCardPlayable(cardId, dieValue, dieId = null) {
    if(!cardId) { // Unknown bug for opponent with undefined id
        return false;
    }
    let cardDieList = cardList[cardId].d.split('|');
    let isPlayable = false;
    let isDieChecked = false;
    let secondRemovedDie = null;
    if(cardDieList.length > 1) {
        isPlayable = isDiePlayable(cardDieList[0], dieValue);
        if(isPlayable) {
            isPlayable = [...$dieList.querySelectorAll('.c-die')].some((die, dieIndex) => {
                let secondDieValue = die.getAttribute('data-roll');
                if(!isDieChecked && secondDieValue == dieValue) {
                    if(die.id != dieId) {
                        secondRemovedDie = die;
                    }
                    isDieChecked = true;
                    return false;
                }
                if(isDiePlayable(cardDieList[1], secondDieValue)) {
                    if(!secondRemovedDie) {
                        secondRemovedDie = die;
                    }
                }
                return isDiePlayable(cardDieList[1], secondDieValue);
            });
        } else {
            isPlayable = isDiePlayable(cardDieList[1], dieValue);
            if(isPlayable) {
                isPlayable = [...$dieList.querySelectorAll('.c-die')].some(die => {
                    let secondDieValue = die.getAttribute('data-roll');
                    if(!isDieChecked && secondDieValue == dieValue) {
                        if(die.id != dieId) {
                            secondRemovedDie = die;
                        }
                        isDieChecked = true;
                        return false;
                    }
                    if(isDiePlayable(cardDieList[0], secondDieValue)) {
                        if(!secondRemovedDie) {
                            secondRemovedDie = die;
                        }
                    }
                    return isDiePlayable(cardDieList[0], secondDieValue);
                });
            }
        }
    } else if(cardDieList[0] == 'double') {
        isPlayable = [...$dieList.querySelectorAll('.c-die')].some(die => {
            let secondDieValue = die.getAttribute('data-roll');
            if(!isDieChecked && secondDieValue == dieValue) {
                if(die.id != dieId) {
                    secondRemovedDie = die;
                }
                isDieChecked = true;
                return false;
            }
            if(secondDieValue == dieValue && !secondRemovedDie) {
                secondRemovedDie = die;
            }
            return secondDieValue == dieValue;
        });
    } else {
        isPlayable = isDiePlayable(cardDieList[0], dieValue);
    }
    if(dieId) {
        if(secondRemovedDie) {
            secondRemovedDie.parentNode.remove();
        }
        if($(dieId).dataset.stun) { // If die is stunned, half chance to be useless 
            isPlayable = random() > 0.5;
        }
        $(dieId).parentNode.remove();
    }
    return isPlayable;
}

function isDiePlayable(cardDieValue, dieValue) {
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
        return true;
    }
    if(cardDieValue === 'odd') {
        return dieValue % 2;
    }
    if(cardDieValue === 'even') {
        return dieValue % 2 == 0;
    }
}

function moveDieToCard($die, $card) {
    let diePosition = $die.getBoundingClientRect();
    let cardPosition = $card.getBoundingClientRect();
    let translate = `translate(${- diePosition.x + cardPosition.x + cardPosition.width / 2}px, ${- diePosition.y + cardPosition.y + cardPosition.height * 0.4}px)`
    $die.style.transform = translate;
}