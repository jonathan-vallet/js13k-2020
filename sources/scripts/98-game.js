function startGame() {
    displayAllCards();
    displayMyCards();

    startFight();
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
            $($link.getAttribute('data-screen')).classList.add('-active');
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
    var keys = Object.keys(CLASS_LIST);
    opponentClass = keys[getRandomNumber(0, keys.length - 1)] + keys[getRandomNumber(0, keys.length - 1)];
}

function showPlayerAvatar() {
    let avatarCode = getFromLS('avatar');
    $playerAvatar.appendChild(createAvatar(avatarCode[0], avatarCode[1]));
}

function showOpponentAvatar() {
    $opponentAvatar.appendChild(createAvatar(opponentClass[0], opponentClass[1]));
}


function startNextTurn() {
    ++currentTurn;
    // TODO: générer un dé suivant le tour
    if([1, 2, 3, 4, 6].includes(currentTurn)) {
        generateDice();
    }
    document.body.offsetHeight;
    rollDices();
    drawCards();
}

function endTurn() {
    startNextTurn();
}

function drawCards() {
    // TODO: prendre une carte dans le deck. Elle pase en main. Quand elle est jouée elle passe en défausse. Quand la pioche est vide la défausse devient la pioche et on mélange
}

function shuffleDeck() {
    for (let i = myDeckList.length - 1; i > 0; i--) {
        const j = getRandomNumber(0, i);
        [myDeckList[i], myDeckList[j]] = [myDeckList[j], myDeckList[i]];
    }
    displayMyDeck();
}

// Let's the game start!
startGame();
// init some things while edev