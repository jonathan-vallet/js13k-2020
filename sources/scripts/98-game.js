function startGame() {
    displayAllCards();
    displayMyCards();
    displayMyDeck();
    drawAvatars();
    generateDice();
    generateDice();
    generateDice();
    generateDice();

    [...$$screenLinkList].forEach($link => {
        $link.onclick = () => {
            document.querySelector('.l-screen.-active').classList.remove('-active');
            $($link.getAttribute('data-screen')).classList.add('-active');
        }
    });
}

// Let's the game start!
startGame();