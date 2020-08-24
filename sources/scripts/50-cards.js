function displayAllCards() {
    for (const cardId of Object.keys(cardList)) {
        var cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        $allcardList.append(cardElement);
    }
}

/*
// TODO: fonction plus utilisée pour le moment, à voir en fin de partie ou avec un menu pour voir son deck entier comme dans slay the Spire
function displayMyCards() {
    myHandCards.forEach(cardId => {
        var cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        cardElement.addEventListener('click', () => {
            myDeckList.push(cardId);
        });
        $myCardList.append(cardElement);
    });
}
function displayMyDeck() {
    /*myDeckList.forEach(cardId => {
        var cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        $myHandCards.append(cardElement);
    });
}
*/
function displayCard(cardId, cardElementId) {
    var card = cardList[cardId];
    var cardType = getCardTypes(cardId);
    var cardContent = `<div class="c-card__content -${cardType}"><p class="c-card__class">${CLASS_NAME_LIST[cardType]}</p><span class="c-card__rarity -rarity${card.rarity}"></span><div class="c-card__diceList">`;
    card.dice.split('|').forEach((dice, diceIndex) => {
        cardContent += drawCardDice(dice, cardElementId, diceIndex);
    });
    cardContent += `</div>${getCardEffect(card.effect)}`;

    // TODO: utiliser createaFromHTML?
    var cardElement = createElement('div');
    cardElement.classList.add('c-card');
    if(cardElementId) {
        cardElement.id = cardElementId;
    }
    cardElement.innerHTML = cardContent;
    return cardElement;
}

function getCardTypes(cardId) {
    var cardType = cardId.replace(/\d+/, '');
    // TODO: voir si on peut optimiser le 'w' ou 'ww'
    return cardType.length < 2 ? cardType : (cardType[0] == cardType[1] ? cardType[0] : (cardType[0] < cardType[1] ? cardType[0] + cardType[1] : cardType[1] + cardType[0]));
}

function addHoverEffect(element) {
    element.addEventListener('mousemove', event => {
        let bounding = event.currentTarget.getBoundingClientRect();
        let x = Math.max(0, event.pageX - ~~(bounding.left));
        let y = Math.max(0, event.pageY - window.scrollY - ~~(bounding.top));
        let width = ~~(bounding.width);
        let height = ~~(bounding.height);

        let posX = width / 2 - x;
        let posY = height / 2 - y;
        let hypotenuseCursor = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));
        let hypotenuseMax = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
        let ratio = hypotenuseCursor / hypotenuseMax;

        const maxAngle = 20;
        element.querySelector(':first-child').style.transform = `rotate3d(${posY / hypotenuseCursor}, ${-posX / hypotenuseCursor}, 0, ${ratio * maxAngle}deg)`;
        element.querySelector(':first-child').style.filter = `brightness(${1.2 - y / height / 2})` // 0.6 = offset, brightness will be from 0.6 to 1.6
    });

    element.addEventListener('mouseleave', e => {
        element.querySelector(':first-child').style.transform = '';
        element.querySelector(':first-child').style.filter = '';
    });
}

function drawCardDice(dice, diceElementId, diceNumber) {
    let match = dice.match(/([-+*]?)([0-9])/);
    let diceContent = dice;
    if (match) {
        var pre = '';
        var suf = '';
        switch (match[1]) {
            case '-': suf = 'max'; break;
            case '+': suf = 'min'; break;
        }
        diceContent = pre + match[2] + suf;
    } 
    return `<p class="c-card__dice" data-dice="${dice}" ${diceElementId ? ` id=${diceElementId}-${diceNumber}` : ''}>${diceContent}</p>`;
}

function getCardEffect(effectCode) {
    var effectText = '';
    var effectList = effectCode.split(',');
    effectList.forEach((effect, index) => {
        effectText += index > 0 ? `<br>` : '';
        var split = effect.split('|')
        var effectValue = split[1];
        switch (split[0]) {
            case 'damage':
                effectText += `Inflict <b>${effectValue}</b> damages`;
                break;
            case 'poison':
                effectText += `Inflict <b>${effectValue}</b> poison damages`;
                break;
            case 'magic':
                effectText += `Inflict <b>${effectValue}</b> magical damages`;
                break;
            case 'heal':
                effectText += `Heal <b>${effectValue}</b> life points`;
                break;
            case 'split':
                effectText += `Split dice in <b>${effectValue}</b>`;
                break;
            case 'protection':
                effectText += `Add <b>${effectValue}</b> shield`;
                break;
        }
    });
    return `<p class="c-card__effect">${effectText}</p>`;
}

function createDeck() {
    // TODO: create from selected classes
    myDeckList = ['w1', 'w1', 'w1', 'w2', 'w2', 'm1', 'm1', 'm1', 'm2', 'm2', 'mw1']; // TODO: get / save in localstorage
    setFromLS('deck', myDeckList);
}

function playCard($card) {
    $card.classList.add('-played');
    setTimeout(() => {
        $card.remove();
    }, 500);
}