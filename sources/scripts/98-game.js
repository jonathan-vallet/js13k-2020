function startGame() {
    displayAllCards();
    generateMap();
    // displayMyCards();
    drawAvatars();
    bindEvents();

    // Check continue game
    // TODO: Vérifier l'objet player (et redirgier vers la bonne étape en cours, stockée dans le LS aussi, ou suivant la valeur de certains champs?)
    if(!getFromLS('avatar')) {
        $continueButton.setAttribute('disabled', 'disabled');
    }
}

function bindEvents() {
    // Sets screen changes for some buttons
    document.body.onclick = (e) => {
        if(e.target.classList.contains('js-screen-link')) {
            if(e.target.hasAttribute('data-floor')) {
                let floor = e.target.getAttribute('data-floor');
                if(!e.target.classList.contains('-active')) {
                    return;
                }
                [...$$$(`[data-floor="${floor}"]`)].forEach($floor => {
                    $floor.classList.remove('-active');
                });
                e.target.classList.add('-selected');
            }
            showScreen(e.target.getAttribute('data-screen'));
        }
    }

    // Sets the end of turn
    $endTurnButton.onclick = () => { endTurn() };
}

function startFight() {
    ++player.f;
    player.t = 0;
    // Sets life to max at first floor only
    player.f == 0 && updateLifePoints(player, player.m);
    myDeckList = [...player.d];
    myHandList = [];
    myDiscardList = [];
    $myHand.innerHTML = '';
    updateLifePoints(player, player.m);
    generateOpponent();
    shuffleDeck();
    displayDeck();
    startNextTurn();
    showPlayerAvatar();
}

function endFight() {
    if(player.l <= 0) {
        console.log('you lose');
    } else {
        showScreen('screen-reward');
    }
}

function generateOpponent() {
    // TODO: déterminer le type (élite, mob...) depuis stageList
    var classIdList = Object.keys(BASE_CLASS_LIST);
    // Generates a random class for opponent;
    opponent.c = classIdList[getRandomNumber(0, classIdList.length - 1)] + classIdList[getRandomNumber(0, classIdList.length - 1)];
    // Draws opponent avatar
    $opponentAvatar.firstChild && $opponentAvatar.firstChild.remove();
    $opponentAvatar.append(createAvatar(opponent.c[0], opponent.c[1]));
    // Sets opponent life points from stage and monster type (monster, elite, boss)
    opponent.m = 2;
    updateLifePoints(opponent, opponent.m);
}

function showPlayerAvatar() {
    let avatarCode = player.c;
    $playerAvatar.firstChild && $playerAvatar.firstChild.remove();
    $playerAvatar.append(createAvatar(avatarCode[0], avatarCode[1]));
}

function startNextTurn() {
    ++player.t; // Increase turn number
    // Removes all die and generate new ones during 5 firstturns
    $dieList.innerHTML = '';
    for(let dieNumber = 0; dieNumber < Math.min(5, player.t); ++dieNumber) {
        generateDie();
    }
    
    document.body.offsetWidth;
    rollDice();
    setTimeout(() => {
        drawCards();
    }, 800);
}

function endTurn() {
    discardHand();
    setTimeout(() => {
        startNextTurn();
    }, 500); // TODO: timeout = au nombre de cartes à défausser
}

function discardHand() {
    for(var cardNumber = 0; cardNumber < myHandList.length; ++cardNumber) {
        setTimeout(() => {
            discardCard(0);
        }, cardNumber * 100);
    }
}

function discardCard(handCardIndex) {
    myDiscardList.push(myHandList[handCardIndex]);
    myHandList.splice(handCardIndex, 1);
    $myHand.removeChild($myHand.children.item(handCardIndex));
    // Updates index of other cards
    [...$myHand.querySelectorAll('.c-card')].forEach(($card, index) => {
        $card.dataset.hand = index;
    });
}

function drawCards() {
    // TODO: prendre une carte dans le deck. Elle pase en main. Quand elle est jouée elle passe en défausse. Quand la pioche est vide la défausse devient la pioche et on mélange
    for(var cardNumber = 0; cardNumber < 5; ++cardNumber) {
        timeoutCardDraw(cardNumber);
    }
}

// TODO: rempalcer tous les setTimeout par des await/async...
function timeoutCardDraw(cardNumber) {
    setTimeout(() => {
        if(!myDeckList.length) {
            myDeckList = myDiscardList;
            myDiscardList = [];
            shuffleDeck();
            displayDeck();
        }
        if(myDeckList.length) { // Checks if cards are not already in hand
            // TODO: retirer l'argument, on pioche toujours la carte du dessus du deck
            drawCard(myDeckList[0]);
        }
    }, cardNumber * 100);
}

function drawCard(cardId) {
    myHandList.push(myDeckList[0]);
    myDeckList.shift();
    let $card = displayCard(cardId, $myHand.childElementCount);
    $card.ondragenter = event => {
        var $cardDieTarget = event.target;
        let $die = $(draggedDieId);
        let dieValue = $die.dataset.roll;
        let $card = $cardDieTarget.closest('.c-card');
        let dragoverCounter = $card.dataset.dragCounter || 0;
        $card.dataset.dragCounter = ++dragoverCounter;
        if(!$cardDieTarget.classList.contains('c-card__die')) {
            // TODO: if multiple die, get the first not empty
            $cardDieTarget = $card.querySelector('.c-card__die');
        }
        if(isDiePlayable($card.dataset.hand, $cardDieTarget.dataset.dice, dieValue)) {
            $card.classList.add('-active');
        }
    };
    $card.ondragleave = event => {
        let dragoverCounter = $card.dataset.dragCounter || 0;
        $card.dataset.dragCounter = --dragoverCounter;
        if($card.dataset.dragCounter <= 0) {
            $card.classList.remove('-active');
        }
    };
    $card.ondrop = event => {
        var $cardDieTarget = event.target;
        let $die = $(draggedDieId);
        let dieValue = $die.dataset.roll;
        if(!$cardDieTarget.classList.contains('c-card__die')) {
            // TODO: if multiple die, get the first not empty
            $cardDieTarget = $cardDieTarget.closest('.c-card').querySelector('.c-card__die');
        }
        if(isDiePlayable($card.dataset.hand, $cardDieTarget.dataset.dice, dieValue)) {
            $die.remove();
            $cardDieTarget.dataset.value = dieValue;
            // TODO: play die only if card has 2 die
            playCard($card);
            // resolveCardEffect();
        }
    };

    $card.ondragover = (event) => {
        event.preventDefault();
    }

    $myHand.append($card);
    $myDeck.removeChild($myDeck.lastElementChild);
}

function displayDeck() {
    $myDeck.innerHTML = '';
    myDeckList.forEach((cardId, index) => {
        let $card = createElement('div');
        $card.classList.add('c-card')
        $card.innerHTML = `<p class="c-card__back">0</p>`;
        $myDeck.append($card);
        $card.style.transition = `all ${index / 20}s linear`;
        $card.offsetWidth;
        $card.style.transform = `translate(${index * 2}px, ${index * 2}px)`;
    });
}

function shuffleDeck() {
    for (let i = myDeckList.length - 1; i > 0; i--) {
        const j = getRandomNumber(0, i);
        [myDeckList[i], myDeckList[j]] = [myDeckList[j], myDeckList[i]];
    }
}

// Let's the game start!
startGame();