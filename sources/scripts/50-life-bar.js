// negative value: damage, positive: heal
function updateLifePoints(guy, value) {
    // If damage are taken, check shield before decrease life points
    if(value < 0 && guy.sh) {
        if(guy.sh >= -value) {
            guy.sh += value;
            return;
        } else {
            value += guy.sh;
            guy.sh = 0;
        }
    }
    let newLifePoints = Math.max(0, Math.min(guy.m, guy.l + ~~value));
    showImpact(newLifePoints, guy);
    guy.l = newLifePoints;
    [...$$$(`.c-life[data-p="${guy.id}"] p`)].forEach($lifeBar => {
        $lifeBar.style.width = `${~~(guy.l / guy.m * 100)}%`;
    });
    
    if(newLifePoints <= 0) {
        wait(1500, () => endFight());
    }
}

function showImpact(newLifePoints, guy) {
    let impactList = [];
    for(var index = 0; index < ~~(1 + Math.abs(newLifePoints - guy.l) / 10); ++index) {
        var impact = createElement('p');
        impact.innerText = newLifePoints > guy.l ? '➕' : '💢';
        impact.style.top = `${getRandomNumber(20, 150)}px`;
        impact.style.left = `${getRandomNumber(20, 150)}px`;
        // TODO: factoriser player/opponent pour les cibler avec moins de code
        guy.id === 1 ? $playerAvatar.append(impact) : $opponentAvatar.append(impact);
        impact.offsetWidth;
        impact.classList.add('-loaded');
        impactList.push(impact);
    }

    wait(500, () => {
        for(var impact of impactList) {
            impact.remove();
        }
    });
}