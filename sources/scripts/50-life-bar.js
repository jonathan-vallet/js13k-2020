var maxLifePoints = 100;
var currentLifePoints = 0;
function initLifeBar() {
    updateLifePoints(1, maxLifePoints);
    updateLifePoints(2, maxLifePoints);
}

// negative value: damages, positive: heal
function updateLifePoints(playerId, value) {
    let newLifePoints = Math.max(0, Math.min(100, currentLifePoints + value));
    if(newLifePoints <= 0) {
        console.log('you lose!');
    }
    showImpact(newLifePoints, currentLifePoints, playerId);
    currentLifePoints = newLifePoints;
    [...$$(`#lifeBar-${playerId} p`)].forEach($lifeBar => {
        $lifeBar.style.width = `${~~(currentLifePoints / maxLifePoints * 100)}%`;
    });
}

function showImpact(newLifePoints, currentLifePoints, playerId) {
    console.log('impact number', newLifePoints, currentLifePoints, ~~(Math.abs(newLifePoints - currentLifePoints) / 10));
    let impactList = [];
    for(var index = 0; index < ~~(1 + Math.abs(newLifePoints - currentLifePoints) / 10); ++index) {
        var impact = createElement('p');
        impact.innerText = newLifePoints > currentLifePoints ? '➕' : '💢';
        impact.style.top = `${getRandomNumber(20, 150)}px`;
        impact.style.left = `${getRandomNumber(20, 150)}px`;
        // TODO: factoriser player/opponent pour les cibler avec moins de code
        playerId === 1 ? $playerAvatar.appendChild(impact) : $opponentAvatar.appendChild(impact);
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

setInterval(() => {
    updateLifePoints(getRandomNumber(1, 2), getRandomNumber(-50,50));
}, 2000);