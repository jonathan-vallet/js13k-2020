function displayAllCards() {
    cardList.forEach(card => {
        displayCard(card);
    });
}

function displayCard(card) {
    var cardContent = `<p class="c-card__class">${card.type}</p>`;
    cardContent += `<span class="c-card__rarity -rarity${card.rarity}"></span>`;
    cardContent += `<div class="c-card__diceList">`;
    card.dice.split('|').forEach(dice => {
        cardContent += drawDice(dice);
    });
    cardContent += `</div>`;
    cardContent += getCardEffect(card.effect);
    var cardElement = createElement('div');
    cardElement.classList.add('c-card');
    cardElement.classList.add(`-${card.type}`);
    cardElement.innerHTML = cardContent;
    document.body.append(cardElement);
}

function drawDice(dice) {
    var match = dice.match(/([-+*]?)([0-9])/);
    if(match) {
        var pre = '';
        var suf = '';
        var className = '';
        switch(match[1]) {
            case '-': suf = 'max'; break;
            case '+': suf = 'min'; break;
            case '*': pre = '+';className = '-bonus'; break;
        }
        return `<p class="c-card__dice ${className}">${pre}${match[2]}${suf}</p>`;
    } else {
        if(dice === 'double') {
            return `<p class="c-card__dice">${dice}</p><p class="c-card__dice">${dice}</p>`;
        }
        return `<p class="c-card__dice">${dice}</p>`;
    }
}

function getCardEffect(effect) {
    var split = effect.split('|');
    var effectValue = split[1];
    var effectText = '';
    switch(split[0]) {
    case 'damage':
        effectText = `Inflict <b>${effectValue}</b> damages`;
        break;
    case 'poison':
        effectText = `Inflict <b>${effectValue}</b> poison damages`;
        break;
    case 'magic':
        effectText = `Inflict <b>${effectValue}</b> magical damages`;
        break;
    case 'heal':
        effectText = `Heal <b>${effectValue}</b> life points`;
        break;
    case 'split':
        effectText = `Split dice in <b>${effectValue}</b>`;
        break;
    case 'protection':
        effectText = `Add <b>${effectValue}</b> shield`;
        break;
    }
    return `<p class="c-card__effect">${effectText}</p>`;
}
