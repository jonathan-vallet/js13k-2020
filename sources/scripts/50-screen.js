function showScreen(screen) {
    document.querySelector('.l-screen.-active').classList.remove('-active');
    $(screen).classList.add('-active');
    $userBar.style.display = $(screen).classList.contains('-overBar') ? 'none' : '';
    
    if(screen == 'screen-class-choice') {
        // Inits player data
        setMyAvatar('w', 'm');
        player.p = 0;
        player.l = player.m;
        player.sh = 0;
        player.stun = 0;
        player.burn = 0;
        player.freeze = 0;
        player.f = 0;
        player.g = 100;
        player.s = '';
    }
    if(screen == 'screen-map') {
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
        } else if(player.f >= LEVEL_STAGE_NUMBER + 2) {
            showScreen('screen-end');
            return;
        } else {
            $lastFloor = $$(`[data-floor="${player.f - 1}"].-selected`);
            for(let stageX of stageList[player.f - 1][$lastFloor.getAttribute('data-x')].l) {
                $$(`[data-floor="${player.f}"][data-x="${stageX}"]`).classList.add('-active');
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
    if(screen == 'screen-reward') {
        if(player.s == 'map') { // Reward stage
            ++player.f;
        }
        // Get gold reward from mob difficulty
        player.g += opponent.m;
        $('gold-reward').innerText = `💰: ${opponent.m}`;
    }
    if(screen == 'screen-end') {
        let score = 0;
        let scoreText = '';
        let floorScore = player.f * 5;
        scoreText += `<li>Floors (${player.f}): <b>${floorScore}</b></li>`;
        score += floorScore;
        let monsterRoomNumber = 0;
        let eliteRoomNumber = 0;
        let bossRoomNumber = 0;
        [...$$$('#screen-map .js-screen-link.-selected')].forEach($floor => {
            let y = +$floor.dataset.floor;
            let x = +$floor.dataset.x;
            let stage = stageList[y][x];
            if(stage.e == 'm') {
                ++monsterRoomNumber;
            }
            if(stage.e == 'e') {
                ++eliteRoomNumber;
            }
            if(stage.e == 'b') {
                ++bossRoomNumber;
            }
        });

        let monsterScore = monsterRoomNumber * 20;
        scoreText += `<li>Monsters killed (${monsterRoomNumber}): <b>${monsterScore}</b></li>`;
        score += monsterScore;
        
        let eliteScore = eliteRoomNumber * 100;
        scoreText += `<li>Elite monsters killed (${eliteRoomNumber}): <b>${eliteScore}</b></li>`;
        score += eliteScore;
        
        let bossScore = bossRoomNumber * 500;
        scoreText += `<li>Boss killed (${bossRoomNumber}): <b>${bossScore}</b></li>`;
        score += bossScore;
        
        $(getRandomNumber(0, 1) ? 'js-victory-content' : 'js-defeat-content').style.display = 'none';
        $('js-end-score-list').insertAdjacentHTML('beforeend', scoreText);
        $('js-end-score').innerText = `Score: ${score}`;
    }
}