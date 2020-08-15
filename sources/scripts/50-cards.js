function displayAllCards() {
    for (const cardId of Object.keys(cardList)) {
        var cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        $allcardList.append(cardElement);
    }
}

function displayMyCards() {
    myCardList.forEach(cardId => {
        var cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        cardElement.addEventListener('click', () => {
            myDeckList.push(cardId);
        });
        $myCardList.append(cardElement);
    });
}

function displayMyDeck() {
    myDeckList.forEach(cardId => {
        var cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        $myDeckList.append(cardElement);
    });
}

function displayMyHand() {
    myCardList.forEach(cardIndex => {
        var cardElement = displayCard(cardList[cardIndex]);
    });
}

function displayCard(cardId) {
    var card = cardList[cardId];
    var cardType = getCardTypes(cardId);
    var cardContent = `<div class="c-card__content -${cardType}">
        <p class="c-card__class">${getClassName(cardType)}</p>
        <span class="c-card__rarity -rarity${card.rarity}"></span>
        <div class="c-card__diceList">`;
    card.dice.split('|').forEach(dice => {
        cardContent += drawDice(dice);
    });
    cardContent += `</div>${getCardEffect(card.effect)}`;

    var cardElement = createElement('div');
    cardElement.classList.add('c-card');
    cardElement.innerHTML = cardContent;
    return cardElement;
}

function getCardTypes(cardId) {
    var cardType = cardId.replace(/\d+/, '');
    return cardType.length < 2 ? cardType : (cardType[0] == cardType[1] ? cardType[0] : (cardType[0] < cardType[1] ? cardType[0] + cardType[1] : cardType[1] + cardType[0]));
}

function getClassName(cardType) {
    switch (cardType) {
        case 'w':
            return 'warrior';
        case 'm':
            return 'mage';
        case 't':
            return 'thief';
        case 'a':
            return 'assassin';
        case 'p':
            return 'protector';
        case 'h':
            return 'heal';
        case 'mw':
            return 'battlemage';
        case 'tw':
            return 'rogue';
        case 'aw':
            return 'slayer';
        case 'pw':
            return 'paladin';
        case 'hw':
            return 'templar';
        case 'mt':
            return 'warlock';
        case 'am':
            return 'dreamkiller';
        case 'mp':
            return 'guardian';
        case 'hm':
            return 'runemaster';
        case 'at':
            return 'ninja';
        case 'pt':
            return 'brigand';
        case 'ht':
            return 'trickster';
        case 'ap':
            return 'ranger';
        case 'ah':
            return 'avenger';
        case 'hp':
            return 'sage';
    };
}

function addHoverEffect(element) {
    element.addEventListener('mousemove', event => {
        let bounding = event.currentTarget.getBoundingClientRect();
        let x = Math.max(0, event.pageX - Math.round(bounding.left));
        let y = Math.max(0, event.pageY - window.scrollY - Math.round(bounding.top));
        let width = Math.round(bounding.width);
        let height = Math.round(bounding.height);

        let posX = width / 2 - x;
        let posY = height / 2 - y;
        let hypotenuseCursor = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));
        let hypotenuseMax = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
        let ratio = hypotenuseCursor / hypotenuseMax;

        var maxAngle = 20;
        element.querySelector(':first-child').style.transform = `rotate3d(${posY / hypotenuseCursor}, ${-posX / hypotenuseCursor}, 0, ${ratio * maxAngle}deg)`;
        element.querySelector(':first-child').style.filter = `brightness(${1.2 - y / height / 2})` // 0.6 = offset, brightness will be from 0.6 to 1.6
    });

    element.addEventListener('mouseleave', e => {
        element.querySelector(':first-child').style.transform = '';
        element.querySelector(':first-child').style.filter = '';
    });
}

function drawDice(dice) {
    var match = dice.match(/([-+*]?)([0-9])/);
    if (match) {
        var pre = '';
        var suf = '';
        var className = '';
        switch (match[1]) {
            case '-': suf = 'max'; break;
            case '+': suf = 'min'; break;
            case '*': pre = '+'; className = '-bonus'; break;
        }
        return `<p class="c-card__dice ${className}">${pre}${match[2]}${suf}</p>`;
    } else {
        if (dice === 'double') {
            return `<p class="c-card__dice">${dice}</p><p class="c-card__dice">${dice}</p>`;
        }
        return `<p class="c-card__dice">${dice}</p>`;
    }
}

function getCardEffect(effectCode) {
    var effectText = '';
    var effectList = effectCode.split(',');
    effectList.forEach((effect, index) => {
        effectText += index > 0 ? `<br>` : '';
        var split = effect.split('|');
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
