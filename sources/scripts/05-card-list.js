/*
c: class
d: die
e: effect
r: rarity
*/
let simpleCardList = [
    // Warrior
    {c: 'w', r: 1, d: '', e: 'damage|X'},
    {c: 'w', r: 1, d: '-4', e: 'reroll|X+2'},
    {c: 'w', r: 1, d: '-4', e: 'damage|X*2,reflect|X'},
    {c: 'w', r: 1, d: 'odd', e: 'damage|3,stun|1'},
    {c: 'w', r: 2, d: '+4', e: 'damage|X,6:stun|1'},
    {c: 'w', r: 2, d: '-4', e: 'damage|X*2'},
    {c: 'w', r: 2, d: '+4', e: 'damage|X,6:stun|1'},
    {c: 'w', r: 2, d: '6', e: 'damage|X+2'},
    {c: 'w', r: 3, d: '6|6', e: 'damage|X,stun|5'},
    {c: 'w', r: 3, d: '+4', e: 'damage|X*3,reflect|X'},

    // Mage
    {c: 'm', r: 1, d: '1', e: 'damage|1,freeze|1'},
    {c: 'm', r: 1, d: 'odd', e: 'damage|X,freeze|1'},
    {c: 'm', r: 1, d: 'even', e: 'damage|X,fire|1'},
    {c: 'm', r: 2, d: '5', e: 'damage|4,fire|1'},
    {c: 'm', r: 3, d: '1|1', e: 'freeze|5'},
    {c: 'm', r: 3, d: '5|5', e: 'fire|5'},

    // Thief
    // {c: 't', r: 1, d: '-2', e: 'damage|X,reroll|X'},
    // {c: 't', r: 1, d: '+3', e: 'damage|3,reroll|<'},
    // {c: 't', r: 1, d: '1|1', e: 'damage|6'},
    {c: 't', r: 1, d: 'double', e: 'damage|X,reroll|X'},
    {c: 't', r: 1, d: '3|3', e: 'damage|3,reroll|<'},
    {c: 't', r: 1, d: '1|1', e: 'damage|6'},
    {c: 't', r: 1, d: '', e: 'reroll|X+1'},
    {c: 't', r: 1, d: '', e: 'reroll|X-1'},
    {c: 't', r: 1, d: '', e: 'split|2'},
    {c: 't', r: 1, d: '', e: 'duplicate|X'},
    {c: 't', r: 2, d: '6', e: 'reroll|1,reroll|1'},
    {c: 't', r: 3, d: '', e: 'split|3'},
    {c: 't', r: 3, d: '1|1', e: 'damage|12'},

    // Assassin
    {c: 'a', r: 1, d: '+4', e: 'poison|1,reroll|1'},
    {c: 'a', r: 1, d: '-3', e: 'damge|3,poison|1'},
    {c: 'a', r: 2, d: '-3', e: 'poison|X'},
    {c: 'a', r: 2, d: '-3', e: 'poison|2,reroll|1'},
    {c: 'a', r: 2, d: '', e: 'damage|X,2:poison|2'},
    {c: 'a', r: 3, d: 'even', e: 'damage|p'}, //TODO: dégat spécifique!
    {c: 'a', r: 3, d: '2|2', e: 'poison|8'},

    // Protector
    {c: 'p', r: 1, d: '', e: 'shield|X'},
    {c: 'p', r: 1, d: '-4', e: 'damage|4'},
    {c: 'p', r: 1, d: '4+', e: 'damage|X,shield|2'},
    {c: 'p', r: 2, d: '|', e: 'shield|X'},
    {c: 'p', r: 3, d: '6', e: 'damage|s'}, //TODO: dégat spécifique!
    {c: 'p', r: 3, d: 'even', e: 'damage|s*2'}, //TODO: dégat spécifique!
    {c: 'p', r: 3, d: '4|4', e: 'shield|12,damage|4'},

    // Heal
    {c: 'h', r: 1, d: '', e: 'heal|3'},
    {c: 'h', r: 1, d: '-4', e: 'damage|3'},
    {c: 'h', r: 1, d: '4+', e: 'damage|X,shield|2'},
    {c: 'h', r: 2, d: '|', e: 'shield|X'},
    {c: 'h', r: 3, d: '3|3', e: 'heal|12,damage|3'},

    // Warrior + mage
    {c: 'mw', r: 2, d: '', e: 'damage|3,fire|1,freeze|1'},

    // Thief + warrior
    {c: 'tw', r: 2, d: '', e: 'damage|X,reroll|<'},

    // Assassin + warrior
    {c: 'aw', r: 2, d: '', e: 'damage|X,poison|2'},

    // Warrior + protector
    {c: 'pw', r: 1, d: '', e: 'damage|X,shield|4'},
    {c: 'pw', r:21, d: '', e: 'damage|X,shield|4'},

    // Warrior + heal
    {c: 'hw', r: 2, d: '', e: 'damage|X,shield|3'},

    // Mage + thief
    {c: 'mt', r: 2, d: '', e: 'fire|1,freeze|1,reroll|<'},

    // Assassin + mage
    {c: 'am', r: 2, d: '', e: 'fire|1,freeze|1,poison|2'},
    
    // Mage + Protector
    {c: 'mp', r: 2, d: '', e: 'fire|1,freeze|1,shield|4'},

    // Mage + Heal
    {c: 'hm', r: 2, d: '', e: 'fire|1,freeze|1,heal|3'},

    // Assassin + Thief
    {c: 'at', r: 2, d: '', e: 'poison|2,reroll|<'},

    // Protector + Thief
    {c: 'pt', r: 2, d: '', e: 'shield|4,reroll|<'},

    // Heal + Thief
    {c: 'ht', r: 2, d: '', e: 'heal|3,reroll|<'},

    // Assassin + protector
    {c: 'ap', r: 2, d: '', e: 'shield|4,poison|2'},

    // Assassin + heal
    {c: 'ah', r: 2, d: '', e: 'heal|3,poison|2'},

    // Protector + heal
    {c: 'hp', r: 2, d: '', e: 'heal|3,shield|4'},
];

let cardList = {};
let classCardNumber = {};
for(card of simpleCardList) {
    classCardNumber[card.c] = classCardNumber[card.c] ? ++classCardNumber[card.c] : 1;
    cardList[`${card.c}${classCardNumber[card.c]}`] = card;
}
