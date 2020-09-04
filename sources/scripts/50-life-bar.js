// negative value: damage, positive: heal
function updateLifePoints(player, value) {
    let newLifePoints = Math.max(0, Math.min(100, player.l + ~~value));
    showImpact(newLifePoints, player);
    player.l = newLifePoints;
    [...$$$(`.c-life[data-p="${player.id}"] p`)].forEach($lifeBar => {
        $lifeBar.style.width = `${~~(player.l / player.m * 100)}%`;
    });
    
    if(newLifePoints <= 0) {
        setTimeout(() => {
            endFight();
        }, 1000);
    }
}

function showImpact(newLifePoints, player) {
    let impactList = [];
    for(var index = 0; index < ~~(1 + Math.abs(newLifePoints - player.l) / 10); ++index) {
        var impact = createElement('p');
        impact.innerText = newLifePoints > player.l ? '➕' : '💢';
        impact.style.top = `${getRandomNumber(20, 150)}px`;
        impact.style.left = `${getRandomNumber(20, 150)}px`;
        // TODO: factoriser player/opponent pour les cibler avec moins de code
        player.id === 1 ? $playerAvatar.append(impact) : $opponentAvatar.append(impact);
        impact.offsetWidth;
        impact.classList.add('-loaded');
        impactList.push(impact);
    }

    setTimeout(() => {
        for(var impact of impactList) {
            impact.remove();
        }
    }, 500);
}