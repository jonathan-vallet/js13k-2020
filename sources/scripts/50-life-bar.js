function initLifeBar() {
    [...$$lifeBarList].forEach($lifeBar => {
        var $fillBar = createElement('div');
        var $damageBar = createElement('div');
        var $healBar = createElement('div');
        $lifeBar.appendChild($fillBar);
        $lifeBar.appendChild($damageBar);
        $lifeBar.appendChild($healBar);
        $fillBar.offsetHeight;
        $fillBar.style.width = '100%';
    });
}