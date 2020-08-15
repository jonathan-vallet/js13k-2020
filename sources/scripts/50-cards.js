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
    var cardElement = document.createElement('div');
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
        effectText = `Inflict <strong>${effectValue}</strong> damages`;
        break;
    case 'poison':
        effectText = `Inflict <strong>${effectValue}</strong> poison damages`;
        break;
    case 'magic':
        effectText = `Inflict <strong>${effectValue}</strong> magical damages`;
        break;
    case 'heal':
        effectText = `Heal <strong>${effectValue}</strong> life points`;
        break;
    case 'split':
        effectText = `Split dice in <strong>${effectValue}</strong>`;
        break;
    case 'protection':
        effectText = `Add <strong>${effectValue}</strong> shield`;
        break;
    }
    return `<p class="c-card__effect">${effectText}</p>`;
}
