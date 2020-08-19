function startGame() {
    displayAllCards();
    displayMyCards();
    displayMyDeck();
    drawAvatars();
    generateDice();
    generateDice();
    generateDice();
    generateDice();
    initLifeBar();

    [...$$screenLinkList].forEach($link => {
        $link.onclick = () => {
            document.querySelector('.l-screen.-active').classList.remove('-active');
            $($link.getAttribute('data-screen')).classList.add('-active');
        }
    });

    // Check continue game
    if(!getFromLS('avatar')) {
        $continueButton.setAttribute('disabled', 'disabled');
    }
}

// Let's the game start!
startGame();