function displayAllCards() {
    for (const cardId of Object.keys(cardList)) {
        let cardElement = displayCard(cardId);
        addHoverEffect(cardElement);
        $allcardList.append(cardElement);
    }
}

function displayMyDeck() {
    displayCardList(player.d, $myDeckList);
}

function displaySoldCards() {
    let soldCardList = [];
    
    for(cardId in cardList) {
        if(getCardTypes(cardId) == 'n') {
            soldCardList.push(cardId);
        }
        if(getCardTypes(cardId) == getCardTypes(player.c)) {
            soldCardList.push(cardId);
        }
    }

    displayCardList(soldCardList, $sellerCardList);

    // Adds card price
    [...$sellerCardList.querySelectorAll('.c-card')].forEach(($card, index) => {
        let $price = createElement('p');
        let cardPrice = cardList[soldCardList[index]].r == 1 ? 60 : cardList[soldCardList[index]].r == 2 ? 150: 250;
        $price.classList.add('c-card__price');
        $price.innerText = `💰: ${cardPrice}`;
        if(player.g >= cardPrice) {
            $card.classList.add('-buyable');
            $card.onclick = () => {
                if(player.g >= cardPrice) {
                    player.g -= cardPrice;
                    player.d.push(soldCardList[index]);
                    soldCardList.splice(index, 1);
                    $card.remove();
                    // Update other cards price
                    [...$sellerCardList.querySelectorAll('.c-card')].forEach(($card, index) => {
                        let cardPrice = cardList[soldCardList[index]].r == 1 ? 60 : cardList[soldCardList[index]].r == 2 ? 150: 250;
                        if(player.g < cardPrice) {
                            $card.classList.remove('-buyable');
                        }
                    });
                    if(player.g < 100) {
                        $removeCardLink.setAttribute('disabled', 'disabled');
                    }
                }
            }
        }
        $card.append($price);
    });
}

function displayRewardCards() {
    // gets 3 random rewards. One of each type, the last from both or double card. No duplicate choice
    let firstRewardList = [];
    let secondRewardList = [];
    let thirdRewardList = [];
    for(cardId in cardList) {
        if(getCardTypes(cardId) == player.c[0]) {
            firstRewardList.push(cardId);
        }
        if(getCardTypes(cardId) == player.c[1]) {
            secondRewardList.push(cardId);
        }
        if([player.c[0], player.c[1], getCardTypes(player.c)].indexOf(getCardTypes(cardId)) >= 0) {
            thirdRewardList.push(cardId);
        }
    }
    let firstReward = getRandomItem(firstRewardList);
    secondRewardList = secondRewardList.filter(cardId => cardId != firstReward); // In case player selected a single class, removes first reward from choices
    let secondReward = getRandomItem(secondRewardList);
    thirdRewardList = thirdRewardList.filter(cardId => [firstReward, secondReward].indexOf(cardId) < 0); // Removes selected rewards from choices
    displayCardList([firstReward, secondReward, getRandomItem(thirdRewardList)], $rewardCardList, (cardId) => {
        player.d.push(cardId);
        showScreen('screen-map');
    });
}

function displayCardList(cardList, $wrapper, callback) {
    $wrapper.innerHTML = '';
    for (const cardId of Object.values(cardList)) {
        let $card = displayCard(cardId);
        addHoverEffect($card);
        $wrapper.append($card);
        if(callback) {
            $card.style.cursor = 'pointer';
            $card.onclick = () => { callback(cardId); };
        }
    }
}

function displayCard(cardId, handCardIndex = -1) {
    let card = cardList[cardId];
    let cardType = getCardTypes(cardId);
    let cardContent = `<div class="c-card__content -${cardType} -rarity${card.r}"><div class="c-card__dieList">`;
    
    card.d.split('|').forEach((die, dieIndex) => {
        cardContent += drawCardDie(die, handCardIndex, dieIndex);
    });
    cardContent += `</div><p class="c-card__effect">${getCardEffect(card.e)}</p>`;

    let cardElement = createElement('div');
    cardElement.classList.add('c-card');
    if(handCardIndex >= 0) {
        cardElement.dataset.hand = handCardIndex;
    }
    cardElement.innerHTML = cardContent;
    return cardElement;
}

// Get card type orderded to get a cardId from player class (not ordered for avatar), or card id
function getCardTypes(cardId) {
    let cardType = cardId.replace(/\d+/, '');
    return cardType.length < 2 || cardType[0] == cardType[1] ? cardType[0] : cardType.split('').sort().join('');
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
        element.firstChild.style.transform = `rotate3d(${posY / hypotenuseCursor}, ${-posX / hypotenuseCursor}, 0, ${ratio * maxAngle}deg)`;
        element.firstChild.style.filter = `brightness(${1.2 - y / height / 2})` // 0.6 = offset, brightness will be from 0.6 to 1.6
    };

    element.onmouseleave = () => {
        element.firstChild.style.transform = '';
        element.firstChild.style.filter = '';
    };
}

function drawCardDie(die, handCardIndex = -1, dieNumber) {
    let dataHand = handCardIndex >= 0 ? `data-hand="${handCardIndex}"` : '';
    let match = die.match(/([-+*]?)([0-9])/);
    let dieContent = die;
    if (match) {
        let pre = '';
        switch (match[1]) {
            case '-': pre = 'max<br/>'; break;
            case '+': pre = 'min<br/>'; break;
        }
        dieContent = pre + match[2];
    } 
    return `<p class="c-card__die" ${dataHand} data-die="${dieNumber}">${dieContent}</p>`;
}

function getCardEffect(effectCode) {
    let effectText = '';
    let effectList = effectCode.split(',');
    effectList.forEach((effect, index) => {
        effectText += index > 0 ? `<br>` : '';
        let split = effect.split('|');
        let split2 = split[0].split(':');
        let effectValue = split[1].replace('X', '<i></i>');
        effectValue = effectValue.replace('*', 'x');
        let effectCondition = split2.length > 1 ? split2[0] : '';
        let effectType = split2[split2.length - 1 ];
        effectText += effectCondition ? `On ${effectCondition}: `: '';
        switch (effectType) {
            case 'damage':
                effectText += `Do 💢<b>${effectValue}</b> damage`;
                break;
            case 'reflect':
                effectText += `Lose 💖<b>${effectValue}</b> life`;
                break;
            case 'poison':
                effectText += `Do 🤢<b>${effectValue}</b> poison`;
                break;
            case 'stun':
                effectText += `Stun 😵 <b>${effectValue}</b> di${effectValue > 1 ? 'c' : ''}e`;
                break;
            case 'reroll':
                effectText += `Roll a <b>${effectValue == '<' ? 'lower' : effectValue}</b> die`;
                break;
            case 'burn':
                effectText += `Burn 🔥 <b>${effectValue}</b> di${effectValue > 1 ? 'c' : ''}e`;
                break;
            case 'heal':
                effectText += `Heal ➕<b>${effectValue}</b> life points`;
                break;
            case 'split':
                effectText += `Split die in two`;
                break;
            case 'duplicate':
                effectText += `Duplicate die <b>${effectValue}</b>`;
                break;
            case 'shield':
                effectText += `Add 🛡 <b>${effectValue}</b> shield`;
                break;
            case 'freeze':
                effectText += `Freeze ❄ <b>${effectValue}</b> di${effectValue > 1 ? 'c' : ''}e`;
                break;
        }
    });
    return effectText;
}

// Generate basic deck from class combination
function createDeck(guy) {
    if(guy.id == 1) {
        // Player deck
        guy.d = [
            `${guy.c[0]}1`,
            `${guy.c[0]}1`,
            `${guy.c[1]}1`,
            `${guy.c[1]}1`,
            `${guy.c[0]}2`,
            `${guy.c[1]}2`,
            `${guy.c[0]}3`,
            `${guy.c[1]}3`,
            `${getCardTypes(guy.c)}1`
        ]
    } else {
        // Opponent deck
        guy.d = [
            `${guy.c[0]}1`,
            `${guy.c[0]}1`,
            `${guy.c[1]}1`,
            `${guy.c[1]}1`,
            `${guy.c[0]}2`,
            `${guy.c[0]}2`,
            `${guy.c[1]}2`,
            `${guy.c[1]}2`,
            `${getCardTypes(guy.c)}1`
        ]
    }
}

function playCard(guy, $card, dieValue) {
    $card.classList.add('-played');
    resolveCardEffect(guy, $card, dieValue);
    wait(500, () => discardCard(guy, $card.dataset.hand));
}
 
function resolveCardEffect(guy, $card, dieValue) {
    let guyOpponent = guy.id == 1 ? opponent : player;
    let cardId = guy.hand[$card.dataset.hand];
    let effectCode = cardList[cardId].e;
    let effectList = effectCode.split(',');
    effectList.forEach((effect, index) => {
        let split = effect.split('|');
        let split2 = split[0].split(':');
        let effectCondition = split2.length > 1 ? split2[0] : '';
        let effectType = split2[split2.length - 1 ];

        let effectValue = getEffectValue(split[1], +dieValue, guy, guyOpponent);
        if(isDiePlayable(effectCondition, dieValue)) {
            switch (effectType) {
                case 'damage':
                    updateLifePoints(guyOpponent, -effectValue);
                    break;
                case 'reflect':
                    updateLifePoints(guy, -effectValue);
                    break;
                case 'shield':
                    guy.sh += effectValue;
                    break;
                case 'poison':
                    guyOpponent.p += effectValue;
                    break;
                case 'stun':
                    ++guyOpponent.stun;
                    break;
                case 'heal':
                    updateLifePoints(guy, effectValue);
                    break;
                case 'freeze':
                    ++guyOpponent.freeze;
                    break;
                case 'burn':
                    ++guyOpponent.burn;
                    break;
                case 'reroll':
                    generateDie(effectValue);
                    break;
                case 'split':
                    let firstNumber = getRandomNumber(1, effectValue - 1);
                    let secondNumber = effectValue - firstNumber;
                    generateDie(firstNumber);
                    generateDie(secondNumber);
                    break;
                case 'duplicate':
                    generateDie(effectValue);
                    generateDie(effectValue);
                    break;
            }
        }   
    });
}

function getEffectValue(effectTextValue, dieValue, guy, guyOpponent) {
    let effectValue = 0;
    let operator = 1;
    for(let charIndex = 0; charIndex < effectTextValue.length; ++charIndex) {
        let char = effectTextValue[charIndex];
        if(char == 'X') {
            effectValue += dieValue;
        }
        if(char == 's') { // shield damages
            effectValue += guy.s;
        }
        if(char == 'p') { // poison damages
            effectValue += guyOpponent.p;
        }
        if(char == '-') {
            operator = -1;
        }
        if(char == '*') {
            effectValue *= effectTextValue[++charIndex];
        }
        if(char == '<') {
            effectValue += getRandomNumber(1, dieValue - 1);
        }
        if(!isNaN(char)) {
            effectValue += operator * +char;
        }
    }
    return effectValue;
}