function startGame() {
    displayAllCards();
    displayMyCards();
    displayMyDeck();
    drawAvatars();
    loop();
}

/*
 * Game loop
 */
function loop() {
    // Your game loop
    requestAnimationFrame(loop);
}

// Let's the game start!
startGame();