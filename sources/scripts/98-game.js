function startGame() {
    displayAllCards();
    generateMap();
    // displayMyCards();
    drawAvatars();
    bindEvents();

    // Check continue game
    if(!getFromLS('avatar')) {
        $continueButton.setAttribute('disabled', 'disabled');
    }
}

function bindEvents() {
    // Sets screen changes for some buttons
    document.body.onclick = (e) => {
        if(e.target.classList.contains('js-screen-link')) {
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
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 500)
    }
    if(screen == 'screen-game') {
        startFight();
    }
    if(screen == 'screen-class-choice') {
        setMyAvatar('w', 'w');
        createDeck();
    }
    if(screen == 'screen-reward') {
        generateRewards();
    }
}

var currentTurn = 0;
var currentStage = 0;
function startFight() {
    generateOpponent();
    // TODO: update to max only at first figt
    updateLifePoints(playerList[0], playerList[0].m);
    // TODO: déterminer le type (élite, mob...)
    shuffleDeck();
    displayDeck();
    startNextTurn();
    showPlayerAvatar();
}

function endFight() {
    ++currentStage;
    if(playerList[0].l <= 0) {
        console.log('you lose');
    } else {
        showScreen('screen-reward');
    }
}

function generateRewards() {
    console.log('nexx step: add a card to deck');
}

function generateOpponent() {
    var classIdList = Object.keys(BASE_CLASS_LIST);
    // Generates a random class for opponent;
    playerList[1].c = classIdList[getRandomNumber(0, classIdList.length - 1)] + classIdList[getRandomNumber(0, classIdList.length - 1)];
    // Draws opponent avatar
    $opponentAvatar.firstChild && $opponentAvatar.firstChild.remove();
    $opponentAvatar.append(createAvatar(playerList[1].c[0], playerList[1].c[1]));
    // Sets opponent life points from stage and monster type (monster, elite, boss)
    playerList[1].m = 20;
    updateLifePoints(playerList[1], playerList[1].m);
}

function showPlayerAvatar() {
    let avatarCode = getFromLS('avatar');
    $playerAvatar.firstChild && $playerAvatar.firstChild.remove();
    $playerAvatar.append(createAvatar(avatarCode[0], avatarCode[1]));
}

function startNextTurn() {
    ++currentTurn;
    // Générer un nouveau dé suivant le tour
    if([1, 2, 3, 4, 6].includes(currentTurn)) {
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