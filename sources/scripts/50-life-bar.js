// negative value: damage, positive: heal
function updateLifePoints(guy, value, reason = null) {
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
    showImpact(guy, reason ? reason : value > 0 ? '➕ heal' : '💢 damage');
    guy.l = newLifePoints;
    [...$$$(`.c-life[data-p="${guy.id}"] p`)].forEach($lifeBar => {
        $lifeBar.style.width = `${~~(guy.l / guy.m * 100)}%`;
    });
    
    if(newLifePoints <= 0) {
        wait(1500, () => endFight());
    }
}

function showImpact(guy, symbol) {
    var impact = createElement('p');
    impact.innerText = symbol;
    guy.id === 1 ? $playerAvatar.append(impact) : $opponentAvatar.append(impact);
    impact.offsetWidth;
    impact.classList.add('-loaded');

    setTimeout(() => {
        impact.remove();
    }, 600);
}