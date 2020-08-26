function displayAllCards() {
    for (const cardId of Object.keys(cardList)) {
        var cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        $allcardList.append(cardElement);
    }
}


function displayCard(cardId, handCardIndex = -1) {
    var card = cardList[cardId];
    var cardType = getCardTypes(cardId);
    var cardContent = `<div class="c-card__content -${cardType}"><p class="c-card__class">${CLASS_NAME_LIST[cardType]}</p><span class="c-card__rarity -rarity${card.rarity}"></span><div class="c-card__diceList">`;
    card.dice.split('|').forEach((dice, diceIndex) => {
        cardContent += drawCardDice(dice, handCardIndex, diceIndex);
    });
    cardContent += `</div><p class="c-card__effect">${getCardEffect(card.effect)}</p>`;

    // TODO: utiliser createaFromHTML?
    var cardElement = createElement('div');
    cardElement.classList.add('c-card');
    if(handCardIndex >= 0) {
        cardElement.dataset.hand = handCardIndex;
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
    element.onmousemove = event => {
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
    };

    element.onmouseleave = () => {
        element.querySelector(':first-child').style.transform = '';
        element.querySelector(':first-child').style.filter = '';
    };
}

function drawCardDice(dice, handCardIndex = -1, diceNumber) {
    let dataHand = handCardIndex >= 0 ? `data-hand="${handCardIndex}"` : '';
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
    return `<p class="c-card__dice" ${dataHand} data-dice="${diceNumber}">${diceContent}</p>`;
}

function getCardEffect(effectCode, diceValue) {
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
            case 'stun':
                effectText += `Stun a dice`;
                break;
            case 'updice':
                effectText += `Increase dice value of <b>${effectValue}</b>`;
                break;
            case 'fire':
                effectText += `Fire a dice`;
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
    return effectText;
}

function createDeck() {
    // TODO: create from selected classes
    myDeckList = ['w1', 'w1', 'w2', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'm2', 'mw1']; // TODO: get / save in localstorage
    setFromLS('deck', myDeckList);
}

function playCard($card) {
    $card.classList.add('-played');
    resolveCardEffect($card);
    setTimeout(() => {
        discardCard($card.dataset.hand);
    }, 500);
}

function resolveCardEffect($card) {
    let cardId = myHandList[$card.dataset.hand];
    let diceValue = $card.querySelector('[data-dice]').dataset.value;
    console.log('resolve', $card, cardId, diceValue);
    let effectCode = cardList[cardId].effect;
    var effectList = effectCode.split(',');
    effectList.forEach((effect, index) => {
        var split = effect.split('|')
        var effectValue = getEffectValue(split[1], +diceValue);
        switch (split[0]) {
            case 'damage':
                console.log('damage', effectValue);
                updateLifePoints(2, -effectValue);
                break;
            case 'stun':
                break;
            case 'updice':
                generateDice(effectValue);
                break;
        }
    });
}

function getEffectValue(effectTextValue, diceValue) {
    let effectValue = 0;
    let operator = 1;
    for(let char of effectTextValue) {
        if(char == 'X') {
            effectValue += diceValue;
        }
        if(char == '-') {
            operator = -1;
        }
        if(!isNaN(char)) {
            effectValue += operator * +char;
        }
    }
    console.log('getEffectValue', effectTextValue, +diceValue, effectValue);
    return effectValue;
}