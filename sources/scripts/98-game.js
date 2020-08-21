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
    $("end-turn-button").addEventListener("click", endTurn);

}

var opponentClass;
var currentTurn = 0;
function startFight() {
    generateOpponent();
    // TODO: déterminer le type (élite, mob...)
    initLifeBar();
    shuffleDeck();
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
    displayDeck();
    setTimeout(() => {
        drawCards();
    }, 800);
}

function endTurn() {
    startNextTurn();
}

function drawCards() {
    // TODO: prendre une carte dans le deck. Elle pase en main. Quand elle est jouée elle passe en défausse. Quand la pioche est vide la défausse devient la pioche et on mélange
    console.log(myDeckList);
    for(var cardNumber = 0; cardNumber < 5; ++cardNumber) {
        timeoutCardDraw(cardNumber);
    }
}

function timeoutCardDraw(cardNumber) {
    setTimeout(() => {
        drawCard(myDeckList[cardNumber]);
    }, cardNumber * 100);
}

function drawCard(cardId) {
    $myHand.append(displayCard(cardId));
    // TODO: prendre une carte dans le deck. Elle pase en main. Quand elle est jouée elle passe en défausse. Quand la pioche est vide la défausse devient la pioche et on mélange
    removeCardFromDeck();
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

function removeCardFromDeck() {
    $myDeck.removeChild($myDeck.lastElementChild);
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