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
    die.id = `die-${++turnDieId}` ;
    die.setAttribute('data-roll', roll || getRandomNumber(1, 6));
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
        if(isCardPlayable(cardId, dieValue)) {
            let $card = $myHand.querySelector(`[data-hand="${handCardIndex}"]`);
            callback($card);
        }
    });
}

function isCardPlayable(cardId, dieValue, dieId = null) {
    let cardDieList = cardList[cardId].d.split('|');
    let isPlayable = false;
    let isDieChecked = false;
    let secondRemovedDie = null;
    if(cardDieList.length > 1) {
        isPlayable = isDiePlayable(cardDieList[0], dieValue);
        if(isPlayable) {
            isPlayable = [...$dieList.childNodes].some((die, dieIndex) => {
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
                isPlayable = [...$dieList.childNodes].some(die => {
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
        isPlayable = [...$dieList.childNodes].some(die => {
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
            secondRemovedDie.remove();
        }
        $(dieId).remove();
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