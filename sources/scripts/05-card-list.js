var cardList = {};
cardList[`${TYPE_WARRIOR}1`] = {
    dice: '-6',
    effect: 'damage|X',
    rarity: 1
};
cardList[`${TYPE_WARRIOR}2`] = {
    dice: '+4',
    effect: 'damage|X',
    rarity: 1
};
cardList[`${TYPE_MAGE}1`] = {
    dice: '+2',
    effect: 'magic|X',
    rarity: 2
};
cardList[`${TYPE_THIEF}1`] = {
    dice: '6',
    effect: 'split|2',
    rarity: 3
};
cardList[`${TYPE_ASSASSIN}1`] = {
    dice: 'double',
    effect: 'poison|3',
    rarity: 4
};
cardList[`${TYPE_PROTECTOR}1`] = {
    dice: '-6|*1',
    effect: 'protection|X',
    rarity: 1
};
cardList[`${TYPE_HEAL}1`] = {
    dice: 'odd',
    effect: 'heal|X-1',
    rarity: 1
};
cardList[`${TYPE_WARRIOR}${TYPE_MAGE}1`] = {
    dice: 'odd',
    effect: 'heal|X-1',
    rarity: 1
};
cardList[`${TYPE_WARRIOR}${TYPE_PROTECTOR}1`] = {
    dice: '-6|*1',
    effect: 'protection|X,damage|1',
    rarity: 1
};

var myCardList = ['w1', 'w1', 'w1', 'w2']; // TODO: get / save in localstorage
var myDeckList = getFromLS('deck') || [];
console.log(myDeckList);