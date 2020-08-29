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
                if(floor != player.f) {
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

function showScreen(screen) {
    document.querySelector('.l-screen.-active').classList.remove('-active');
    $(screen).classList.add('-active');

    if(screen == 'screen-map') {
        if(player.f == 0) {
            [...$$$(`[data-floor="${player.f}"]`)].forEach($floor => {
                    $floor.classList.add('-active');
            });
        } else {
            $lastFloor = $$(`[data-floor="${player.f - 1}"].-selected`);
            console.log(stageList, player.f - 1, stageList[player.f - 1], $lastFloor.getAttribute('data-x'), stageList[player.f - 1][$lastFloor.getAttribute('data-x')])
            for(let stageX of stageList[player.f - 1][$lastFloor.getAttribute('data-x')].l) {
                console.log(stageX);
                $$(`[data-floor="${player.f}"][data-x="${stageX}"]`).classList.add('-active');
            }
        }
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 500)
    }
    if(screen == 'screen-game') {
        // TODO: une variable pour savoir si on est en combat ou l'étape actuelle, pour ne pas redémarrer un combat si on affiche la map pendnat le combat
        startFight();
    }
    if(screen == 'screen-class-choice') {
        // new game, inits player data
        setMyAvatar('w', 'w');
        player.g = 100;
        player.f = 0;
        createDeck();
    }
    if(screen == 'screen-reward') {
        generateRewards();
    }
}

function startFight() {
    ++player.f;
    player.t = 0;
    // TODO: update to max only at first figt
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

function generateRewards() {
    console.log('nexx step: add a card to deck');
}

function generateOpponent() {
    // TODO: déterminer le type (élite, mob...)
    var classIdList = Object.keys(BASE_CLASS_LIST);
    // Generates a random class for opponent;
    opponent.c = classIdList[getRandomNumber(0, classIdList.length - 1)] + classIdList[getRandomNumber(0, classIdList.length - 1)];
    // Draws opponent avatar
    $opponentAvatar.firstChild && $opponentAvatar.firstChild.remove();
    $opponentAvatar.append(createAvatar(opponent.c[0], opponent.c[1]));
    // Sets opponent life points from stage and monster type (monster, elite, boss)
    opponent.m = 20;
    updateLifePoints(opponent, opponent.m);
}

function showPlayerAvatar() {
    let avatarCode = player.c;
    $playerAvatar.firstChild && $playerAvatar.firstChild.remove();
    $playerAvatar.append(createAvatar(avatarCode[0], avatarCode[1]));
}

function startNextTurn() {
    ++player.t;
    // Removes all dices and generate new ones
    $diceList.innerHTML = '';
    for(let diceNumber = 0; diceNumber < Math.min(5, player.t); ++diceNumber) {
        generateDice();
    }
    
    document.body.offsetWidth;
    [...$diceList.querySelectorAll('.c-dice')].forEach($dice => $dice.classList.remove('-disabled'));
    rollDices();
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
        if(myDeckList.length) { // All deck cards are already in hand
            drawCard(myDeckList[0]);
        }
    }, cardNumber * 100);
}

function drawCard(cardId) {
    myHandList.push(myDeckList[0]);
    myDeckList.shift();
    let $card = displayCard(cardId, $myHand.childElementCount);
    $card.ondrop = event => {
        var $cardDiceTarget = event.target;
        var diceId = event.dataTransfer.getData("text/plain");
        let $dice = $(diceId);
        let diceValue = $dice.dataset.roll;
        console.log('drop', diceValue);
        if(!$cardDiceTarget.classList.contains('c-card__dice')) {
            // TODO: if multiple dices, get the first not empty
            $cardDiceTarget = $cardDiceTarget.closest('.c-card').querySelector('.c-card__dice');
        }
        if(isDicePlayable($card.dataset.hand, $cardDiceTarget.dataset.dice, diceValue)) {
            $dice.classList.add('-disabled');
            $cardDiceTarget.dataset.value = diceValue;
            // TODO: play dice only if card has 2 dices
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