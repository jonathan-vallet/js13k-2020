function showScreen(screen) {
    document.querySelector('.l-screen.-active').classList.remove('-active');
    $(screen).classList.add('-active');

    if(screen == 'screen-map') {
        if(player.f != 'map') {
            player.s = 'map';
            if(player.f == 0) {
                [...$$$(`[data-floor="${player.f}"]`)].forEach($floor => {
                    $floor.classList.add('-active');
                });
            } else {
                $lastFloor = $$(`[data-floor="${player.f - 1}"].-selected`);
                for(let stageX of stageList[player.f - 1][$lastFloor.getAttribute('data-x')].l) {
                    $$(`[data-floor="${player.f}"][data-x="${stageX}"]`).classList.add('-active');
                }
            }
        }
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight - window.innerHeight - (player.f - 1) * MAP_Y_SPACE, behavior: 'smooth' });
        }, 500);
    }
    if(screen == 'screen-game') {
        if(!player.d) {
            createDeck(player);
        }
        if(player.s != 'game') {
            player.s = 'game';
            startFight();
        }
    }
    if(screen == 'screen-my-deck') {
        displayMyDeck();
    }
    if(screen == 'screen-heal') {
        ++player.f;
        // Heal player of 30% of missing life
        updateLifePoints(player, player.m * 0.3);
    }
    if(screen == 'screen-card-add') {
        displayRewardCards();
    }
    if(screen == 'screen-class-choice') {
        // new game, inits player data
        setMyAvatar('w', 'w');
        player.g = 100;
        player.f = 0;
    }
    if(screen == 'screen-reward') {
        // Get gold reward from mob difficulty?
        player.g += 50;
    }
}