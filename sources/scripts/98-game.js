function startGame() {
    displayAllCards();
    // displayMyCards();

    drawAvatars();
    createDeck();

    bindEvents();

    // Check continue game
    if(!getFromLS('avatar')) {
        $continueButton.setAttribute('disabled', 'disabled');
    }
}

function bindEvents() {
    // Sets screen changes for some buttons
    [...$$screenLinkList].forEach($link => {
        $link.onclick = () => {
            document.querySelector('.l-screen.-active').classList.remove('-active');
            let screen = $link.getAttribute('data-screen');
            $(screen).classList.add('-active');
            if(screen == 'screen-game') {
                startFight();
            } else if(screen == 'screen-class-choice') {
                setMyAvatar('w', 'w');
            }
        }
    });

    // Sets the end of turn
    $endTurnButton.addEventListener("click", endTurn);
}

var opponentClass;
var currentTurn = 0;
function startFight() {
    generateOpponent();
    // TODO: déterminer le type (élite, mob...)
    initLifeBar();
    shuffleDeck();
    displayDeck();
    startNextTurn();
    showPlayerAvatar();
    showOpponentAvatar();
}

function generateOpponent() {
    var keys = Object.keys(BASE_CLASS_LIST);
    opponentClass = keys[getRandomNumber(0, keys.length - 1)] + keys[getRandomNumber(0, keys.length - 1)];
}

function showPlayerAvatar() {
    let avatarCode = getFromLS('avatar');
    $playerAvatar.append(createAvatar(avatarCode[0], avatarCode[1]));
}

function showOpponentAvatar() {
    $opponentAvatar.append(createAvatar(opponentClass[0], opponentClass[1]));
}

function startNextTurn() {
    ++currentTurn;
    // Générer un nouveau dé suivant le tour
    if([1, 2, 3, 4, 6].includes(currentTurn)) {
        generateDice();
    }
    document.body.offsetWidth;
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
    $myHand.removeChild($myHand.firstElementChild);
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
    $myHand.append(displayCard(cardId));
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
// init some things while edev