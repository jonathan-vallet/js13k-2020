function startGame() {
    displayAllCards();
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