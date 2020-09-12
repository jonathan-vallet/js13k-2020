function startGame() {
    initGameBackground();
    displayAllCards();
    // displayMyCards();
    drawAvatars();
    bindEvents();

    // Check continue game
    // if(!getFromLS('avatar')) {
    //     $continueButton.setAttribute('disabled', 'disabled');
    // }
}

function bindEvents() {
    // Sets screen changes for some buttons
    document.body.onclick = (e) => {
        if(e.target.classList.contains('js-screen-link')) {
            let screen = e.target.getAttribute('data-screen');
            if(screen == 'back') {
                screen = `screen-${player.s}`;
            }
            if(e.target.hasAttribute('data-floor')) {
                let floor = e.target.getAttribute('data-floor');
                player.fx = e.target.getAttribute('data-x');
                if(!e.target.classList.contains('-active')) {
                    return;
                }
                [...$$$(`[data-floor="${floor}"]`)].forEach($floor => {
                    $floor.classList.remove('-active');
                });
                e.target.classList.add('-selected');
            }
            showScreen(screen);
        }
    }

    // Sets the end of turn
    $endTurnButton.onclick = () => { 
        if(gameLoadingState > 0) {
            return;
        }
        endTurn(player);
    };
}

function startFight() {
    ++player.f;
    player.t = 0;
    if(player.f == 1) {
        updateLifePoints(player, player.m);
    }
    // Sets life to max at first floor only
    player.deck = [...player.d]; // Clone deck to get separate instance
    player.hand = [];
    player.discard = [];
    $myHand.innerHTML = '';
    shuffleDeck(player);
    displayDeck(player);
    startNextTurn(1);
    showPlayerAvatar();
    
    generateOpponent();
}

function endFight() {
    if(player.l <= 0) {
        console.log('you lose');
    } else {
        showScreen('screen-reward');
    }
}

function generateOpponent() {
    var classIdList = Object.keys(BASE_CLASS_LIST);
    // Generates a random class for opponent;
    opponent.c = classIdList[getRandomNumber(0, classIdList.length - 1)] + classIdList[getRandomNumber(0, classIdList.length - 1)];
    createDeck(opponent);
    opponent.deck = [...opponent.d]; // Clone deck to get separate instance
    opponent.hand = [];
    opponent.discard = [];
    // Draws opponent avatar
    $opponentAvatar.firstChild && $opponentAvatar.firstChild.remove();
    $opponentAvatar.append(createAvatar(opponent.c[0], opponent.c[1]));
    // Sets opponent life points from stage and monster type (monster, elite, boss)
    let stageType = stageList[player.f - 1][player.fx].e;
    let multiplier = stageType == 'b' ? 3 : stageType == 'e' ? 1.5 : 1;
    // TODO: ajouter "l'acte" en plus
    opponent.m = ~~(Math.log2(player.f + 1) * 14 * multiplier);
    updateLifePoints(opponent, opponent.m);
}

function setOpponentTurn() {
    resolveTurnStart(opponent);
    if(opponent.l > 0) {
        wait(1000, () => playOpponentCard());
    }
}

function playOpponentCard() {
    let playableMoveList = {};
    [...$dieList.childNodes].forEach(die => {
        playableMoveList[die.id] = [];
        checkPlayableCards(opponent, die.getAttribute('data-roll'), $card => {
            playableMoveList[die.id].push($card);
        });
    });

    // Plays die with lower possibilities first
    if(!Object.keys(playableMoveList).length) {
        wait(1500, () => endTurn(opponent));
        return;
    }

    let dieToPlay = Object.keys(playableMoveList)[0];
    let shortestCardList = Object.values(playableMoveList)[0];
    for (const [die, cardList] of Object.entries(playableMoveList)) {
        if(cardList.length < shortestCardList.length) {
            shortestCardList = cardList;
            dieToPlay = die;
        }
    }
    if(shortestCardList.length) {
        let cardToPlay = getRandomItem(shortestCardList);
        wait(1500, () => {
            let $die = $(dieToPlay);
            let dieRoll = $die.dataset.roll;
            if(isCardPlayable(opponent.hand[cardToPlay.dataset.hand], dieRoll, dieToPlay)) {
                playCard(opponent, cardToPlay, dieRoll);
            }
            playOpponentCard();
        });
    } else {
        endTurn(opponent);
    }
}

function showPlayerAvatar() {
    $playerAvatar.firstChild && $playerAvatar.firstChild.remove();
    $playerAvatar.append(createAvatar(player.c[0], player.c[1]));
}

function startNextTurn(guyId) {
    if(guyId == 2) {
        setOpponentTurn();
        $endTurnButton.innerText = 'Opponent turn';
        return;
    }

    $endTurnButton.innerText = 'End turn';
    ++player.t; // Increase turn number
    resolveTurnStart(player);
}

function resolveTurnStart(guy) {
    turnDieId = 0; // Resets die id each turn
    guy.sh = 0; // Resets shield
    if(guy.p) { // Apply poison
        updateLifePoints(guy, -guy.p--);
    }
    // Removes all die and generate new ones during 5 firstturns
    $dieList.innerHTML = '';
    for(let dieNumber = 0; dieNumber < Math.min(5, player.t); ++dieNumber) {
        generateDie();
    }

    if(guy.freeze) {
        // Reduce highest dice to 1
        for(let i = 0; i < guy.freeze; ++i) {
            let $highestDie = $dieList.firstChild;
            [...$dieList.childNodes].forEach(($die) => {
                if($die.dataset.roll < $highestDie.dataset.roll) {
                    $highestDie = $die;
                }
            });
            console.log($highestDie);
            $highestDie.dataset.roll = 1;
            $effect = addDieEffect($highestDie, '❄');
        }
        guy.freeze = 0;
    }
    if(guy.burn) {
        // Burn a random die
        for(let i = 0; i < guy.burn; ++i) {
            $notBurnedDieList = $dieList.querySelectorAll('.c-die:not([data-burn]');
            if(!$notBurnedDieList) {
                break;
            }
            $dieToBurn = $notBurnedDieList.item(getRandomNumber(0, $notBurnedDieList.length - 1));
            $dieToBurn.dataset.burn = 1;
            $effect = addDieEffect($dieToBurn, '🔥');
        }
        
        guy.burn = 0;
    }
    if(guy.stun) {
        // Stun a random die
        for(let i = 0; i < guy.stun; ++i) {
            $notStunedDieList = $dieList.querySelectorAll('.c-die:not([data-burn]');
            if(!$notStunedDieList) {
                break;
            }
            $dieToStun = $notStunedDieList.item(getRandomNumber(0, $notStunedDieList.length - 1));
            $dieToStun.dataset.stun = 1;
            $effect = addDieEffect($dieToStun, '😵');
        }
        guy.stun = 0;
    }

    document.body.offsetWidth;
    rollDice();
    wait(300, () => drawCards(guy));
}

function endTurn(guy) {
    discardHand(guy);
    wait(500, () => startNextTurn(guy.id % 2 + 1)); // TODO: timeout = au nombre de cartes à défausser
}

function discardHand(guy) {
    for(var cardNumber = 0; cardNumber < guy.hand.length; ++cardNumber) {
        setTimeout(() => {
            discardCard(guy, 0);
        }, cardNumber * 100);
    }
}

function discardCard(guy, handCardIndex) {
    guy.discard.push(guy.hand[handCardIndex]);
    guy.hand.splice(handCardIndex, 1);
    $myHand.removeChild($myHand.children.item(handCardIndex));
    // Updates index of other cards
    [...$myHand.querySelectorAll('.c-card')].forEach(($card, index) => {
        $card.dataset.hand = index;
    });
}

function drawCards(guy) {
    for(var cardNumber = 0; cardNumber < 5; ++cardNumber) {
        timeoutCardDraw(guy, cardNumber);
    }
}

function timeoutCardDraw(guy, cardNumber) {
    wait(cardNumber * 100, () => {
        if(!guy.deck.length) {
            guy.deck = guy.discard;
            guy.discard = [];
            shuffleDeck(guy);
            displayDeck(guy);
        }
        if(guy.deck.length) { // Checks if cards are not already in hand
            drawCard(guy);
        }
    });
}

function drawCard(guy) {
    let cardId = guy.deck[0];
    guy.hand.push(cardId);
    guy.deck.shift();
    let $card = displayCard(cardId, $myHand.childElementCount);
    if(guy.id == 1) {
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
            if(isCardPlayable(cardId, dieValue)) {
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
                $cardDieTarget = $cardDieTarget.closest('.c-card').querySelector('.c-card__die');
            }
            if(isCardPlayable(cardId, dieValue, draggedDieId)) {
                playCard(guy, $card, dieValue);
            }
        };
    
        $card.ondragover = (event) => {
            event.preventDefault();
        }

        $myDeck.removeChild($myDeck.lastElementChild);
    }

    $myHand.append($card);
}

function displayDeck(guy) {
    $myDeck.innerHTML = '';
    guy.deck.forEach((cardId, index) => {
        let $card = createElement('div');
        $card.classList.add('c-card')
        $card.innerHTML = `<p class="c-card__back">0</p>`;
        $myDeck.append($card);
        $card.style.transition = `all ${index / 20}s linear`;
        $card.offsetWidth;
        $card.style.transform = `translate(${index * 2}px, ${index * 2}px)`;
    });
}

function shuffleDeck(guy) {
    for (let i = guy.deck.length - 1; i > 0; i--) {
        const j = getRandomNumber(0, i);
        [guy.deck[i], guy.deck[j]] = [guy.deck[j], guy.deck[i]];
    }
}

// Let's the game start!
startGame();