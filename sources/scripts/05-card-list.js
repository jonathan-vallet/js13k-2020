var cardList = {};
/*
d: die
e: effect
r: rarity
*/
cardList[`w1`] = {
    d: '+4',
    e: 'damage|X-2',
    r: 1
};
cardList[`w2`] = {
    d: '-3',
    e: 'damage|X',
    r: 1
};
cardList[`w3`] = {
    d: '+4',
    e: 'damage|X,stun|6',
    r: 2
};
cardList[`w4`] = {
    d: '6',
    e: 'damage|X+2',
    r: 2
};
cardList[`w5`] = {
    d: '-4',
    e: 'updie|X+2',
    r: 2
};
cardList[`w6`] = {
    d: 'odd',
    e: 'damage|3,stun|6',
    r: 1
};
cardList[`w7`] = {
    d: 'even',
    e: 'damage|3,stun|6',
    r: 1
};
cardList[`m1`] = {
    d: '5',
    e: 'damage|5,fire|1',
    r: 2
};
cardList[`m2`] = {
    d: '-2',
    e: 'fire|X',
    r: 1
};
cardList[`t1`] = {
    d: '6',
    e: 'split|2',
    r: 3
};
cardList[`a1`] = {
    d: 'double|double',
    e: 'poison|3',
    r: 3
};
cardList[`p1`] = {
    d: '-6|-6',
    e: 'protection|X',
    r: 1
};
cardList[`h1`] = {
    d: 'odd',
    e: 'heal|X-1',
    r: 1
};
cardList[`mw1`] = {
    d: 'odd',
    e: 'heal|X-1',
    r: 1
};
cardList[`pw1`] = {
    d: '-6',
    e: 'protection|X,damage|1',
    r: 1
};