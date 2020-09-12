function showScreen(screen) {
    document.querySelector('.l-screen.-active').classList.remove('-active');
    $(screen).classList.add('-active');
    $userBar.style.display = $(screen).classList.contains('-overBar') ? 'none' : '';
    
    if(screen == 'screen-map') {
        if(player.s != 'map') {
            player.s = 'map';
            if(!player.d) {
                createDeck(player);
            }
            if(!isMapGenerated) {
                generateMap();
                isMapGenerated = true;
            }
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
        if(player.s != 'game') {
            player.s = 'game';
            startFight();
        }
    }
    if(screen == 'screen-my-deck') {
        $('my-deck-remove-mention').style.display = 'none';
        displayMyDeck();
        if(player.s == 'seller' && player.g > 100) {
            $('my-deck-remove-mention').style.display = '';
            [...$myDeckList.querySelectorAll('.c-card')].forEach(($card, index) => {
                $card.onclick = () => {
                    if(player.g >= 100) {
                        player.g -= 100;
                        player.d.splice(index, 1);
                        $card.remove();
                    }
                    showScreen('screen-seller');
                }
            });
        }
    }
    if(screen == 'screen-seller') {
        if(player.s != 'seller') {
            ++player.f;
            player.s = 'seller';
        }
        if(player.g < 100) {
            $removeCardLink.setAttribute('disabled', 'disabled');
        } else {
            $removeCardLink.removeAttribute('disabled');
        }
        displaySoldCards();
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
        setMyAvatar('w', 'm');
    }
    if(screen == 'screen-reward') {
        // Get gold reward from mob difficulty
        player.g += opponent.m;
        $('gold-reward').innerText = `💰: ${opponent.m}`;
    }
}