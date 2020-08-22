var cardList = {};
cardList[`w1`] = {
    dice: '+4',
    effect: 'damage|X',
    rarity: 1
};
cardList[`w2`] = {
    dice: 'even',
    effect: 'damage|X-1',
    rarity: 1
};
cardList[`m1`] = {
    dice: '+2',
    effect: 'magic|X',
    rarity: 2
};
cardList[`m2`] = {
    dice: '-4',
    effect: 'fire|X',
    rarity: 2
};
cardList[`t1`] = {
    dice: '6',
    effect: 'split|2',
    rarity: 3
};
cardList[`a1`] = {
    dice: 'double',
    effect: 'poison|3',
    rarity: 3
};
cardList[`p1`] = {
    dice: '-6|*1',
    effect: 'protection|X',
    rarity: 1
};
cardList[`h1`] = {
    dice: 'odd',
    effect: 'heal|X-1',
    rarity: 1
};
cardList[`mw1`] = {
    dice: 'odd',
    effect: 'heal|X-1',
    rarity: 1
};
cardList[`pw1`] = {
    dice: '-6|*1',
    effect: 'protection|X,damage|1',
    rarity: 1
};

var myDiscardList = [];
var myHandList = [];
var myDeckList = getFromLS('deck') || [];