/*
c: class
d: die
e: effect
r: rarity
*/
let simpleCardList = [
    // Warrior
    {c: 'w', r: 1, d: '', e: 'damage|X'},
    {c: 'w', r: 1, d: 'odd', e: 'damage|3,stun|1'},
    {c: 'w', r: 1, d: '-4', e: 'damage|X*2,reflect|X'},
    {c: 'w', r: 1, d: '+4', e: 'damage|X,6:stun|1'},
    {c: 'w', r: 2, d: '-4', e: 'damage|X*2'},
    {c: 'w', r: 2, d: '+4', e: 'damage|X,6:stun|1'},
    {c: 'w', r: 2, d: '6', e: 'damage|X+2'},
    {c: 'w', r: 3, d: '6|6', e: 'damage|X,stun|5'},
    {c: 'w', r: 3, d: '+4', e: 'damage|X*3,reflect|X'},

    // Fire Mage
    {c: 'm', r: 1, d: '', e: 'damage|X'},
    {c: 'm', r: 1, d: 'odd', e: 'damage|X,burn|1'},
    {c: 'm', r: 1, d: 'even', e: 'damage|X,burn|1'},
    {c: 'm', r: 1, d: '5', e: 'damage|3,burn|1'},
    {c: 'm', r: 2, d: '', e: 'damage|X,5:burn|1'},
    {c: 'm', r: 2, d: '+4', e: 'damage|X*2,burn|1'},
    {c: 'm', r: 2, d: '5', e: 'damage|8'},
    {c: 'm', r: 3, d: '5|5', e: 'burn|5'},
    {c: 'm', r: 3, d: '+4', e: 'damage|X*2,burn|1'},

    // Ice mage (ex thief)
    {c: 't', r: 1, d: '', e: 'damage|X'},
    {c: 't', r: 1, d: 'odd', e: 'damage|X,freeze|1'},
    {c: 't', r: 1, d: 'even', e: 'damage|X,freeze|1'},
    {c: 't', r: 1, d: '1', e: 'damage|3,freeze|1'},
    {c: 't', r: 2, d: '', e: 'damage|X,1:freeze|1'},
    {c: 't', r: 2, d: '-3', e: 'damage|X*2,freeze|1'},
    {c: 't', r: 2, d: '1', e: 'damage|6'},
    {c: 't', r: 3, d: '1|1', e: 'freeze|5'},
    {c: 't', r: 3, d: '+4', e: 'damage|X*2,freeze|1'},

    // Assassin
    {c: 'a', r: 1, d: '-3', e: 'damge|3,poison|1'},
    {c: 'a', r: 1, d: '+4', e: 'poison|2'},
    {c: 'a', r: 1, d: '-2', e: 'damage|X,reroll|X'},
    {c: 'a', r: 1, d: '+3', e: 'damage|3,reroll|<'},
    {c: 'a', r: 2, d: '-3', e: 'poison|2,reroll|<'},
    {c: 'a', r: 2, d: '', e: 'damage|X,2:poison|2'},
    {c: 'a', r: 2, d: '-3', e: 'poison|X'},
    {c: 'a', r: 3, d: 'even', e: 'damage|p'},
    {c: 'a', r: 3, d: '2|2', e: 'poison|8'},

    // Protector
    {c: 'p', r: 1, d: '', e: 'damage|X'},
    {c: 'p', r: 1, d: '', e: 'shield|X'},
    {c: 'p', r: 1, d: '-4', e: 'damage|X,shield|2'},
    {c: 'p', r: 1, d: '-4', e: 'damage|4,shield|X'},
    {c: 'p', r: 2, d: '', e: 'shield|X'},
    {c: 'p', r: 2, d: '4', e: 'damage|s'},
    {c: 'p', r: 3, d: 'even', e: 'damage|s*2'},
    {c: 'p', r: 3, d: '4|4', e: 'shield|12,damage|4'},

    // Heal
    {c: 'h', r: 1, d: '', e: 'damage|X'},
    {c: 'h', r: 1, d: '', e: 'heal|3'},
    {c: 'h', r: 1, d: '-4', e: 'damage|X,heal|2'},
    {c: 'h', r: 1, d: '-4', e: 'damage|3'},
    {c: 'h', r: 2, d: '|', e: 'shield|X'},
    {c: 'h', r: 3, d: '3|3', e: 'heal|12,damage|3'},

    // Neutral
    {c: 'n', r: 1, d: '-5', e: 'reroll|X+1'},
    {c: 'n', r: 1, d: '+2', e: 'reroll|X-1'},
    {c: 'n', r: 2, d: '+2', e: 'split|X'},
    {c: 'n', r: 3, d: '', e: 'duplicate|X'},

    // Warrior + mage
    {c: 'mw', r: 1, d: '', e: 'odd:damage|3,even:burn|1'},
    {c: 'mw', r: 2, d: '', e: 'damage|3,burn|1'},
    {c: 'mw', r: 3, d: '5|6', e: 'damage|10,burn|5'},

    // Thief + warrior
    {c: 'tw', r: 1, d: '', e: 'odd:damage|3,even:freeze|1'},
    {c: 'tw', r: 2, d: '', e: 'damage|3,freeze|1'},
    {c: 'tw', r: 3, d: '1|6', e: 'damage|10,freeze|5'},

    // Assassin + warrior
    {c: 'aw', r: 1, d: '', e: 'odd:damage|3,even:poison|2'},
    {c: 'aw', r: 2, d: '', e: 'damage|3,poison|2'},
    {c: 'aw', r: 3, d: '6|2', e: 'damage|10,poison|5'},

    // Warrior + protector
    {c: 'pw', r: 1, d: '', e: 'odd:damage|3,even:shield|4'},
    {c: 'pw', r: 2, d: '', e: 'damage|3,shield|4'},
    {c: 'pw', r: 3, d: '6|4', e: 'damage|10,shield|8'},

    // Warrior + heal
    {c: 'hw', r: 1, d: '', e: 'odd:damage|X,even:heal|3'},
    {c: 'hw', r: 2, d: '', e: 'damage|X,heal|3'},
    {c: 'hw', r: 3, d: '6|3', e: 'damage|10,heal|6'},

    // Mage + thief
    {c: 'mt', r: 1, d: '', e: 'odd:burn|1,even:freeze|1'},
    {c: 'mt', r: 2, d: '', e: 'burn|1,freeze|1'},
    {c: 'mt', r: 3, d: '5|1', e: 'burn|5,freeze|5'},

    // Assassin + mage
    {c: 'am', r: 1, d: '', e: 'odd:burn|1,even:poison|2'},
    {c: 'am', r: 2, d: '', e: 'burn|1,poison|2'},
    {c: 'am', r: 3, d: '2|5', e: 'burn|5,poison|5'},
    
    // Mage + Protector
    {c: 'mp', r: 1, d: '', e: 'odd:burn|1,even:shield|4'},
    {c: 'mp', r: 2, d: '', e: 'burn|1,shield|4'},
    {c: 'mp', r: 3, d: '5|4', e: 'burn|5,shield|8'},

    // Mage + Heal
    {c: 'hm', r: 1, d: '', e: 'odd:burn|1,even:heal|3'},
    {c: 'hm', r: 2, d: '', e: 'burn|1,heal|3'},
    {c: 'hm', r: 3, d: '5|3', e: 'burn|5,heal|6'},

    // Assassin + Thief
    {c: 'at', r: 1, d: '', e: 'odd:poison|2,even:freeze|1'},
    {c: 'at', r: 2, d: '', e: 'poison|2,freeze|1'},
    {c: 'at', r: 3, d: '1|2', e: 'poison|5,freeze|5'},

    // Protector + Thief
    {c: 'pt', r: 1, d: '', e: 'odd:shield|4,even:freeze|1'},
    {c: 'pt', r: 2, d: '', e: 'shield|4,freeze|1'},
    {c: 'pt', r: 2, d: '1|4', e: 'shield|8,freeze|5'},

    // Heal + Thief
    {c: 'ht', r: 1, d: '', e: 'odd:heal|3,even:freeze|1'},
    {c: 'ht', r: 2, d: '', e: 'heal|3,freeze|1'},
    {c: 'ht', r: 2, d: '1|3', e: 'heal|6,freeze|5'},

    // Assassin + protector
    {c: 'ap', r: 1, d: '', e: 'odd:shield|4,even:poison|2'},
    {c: 'ap', r: 2, d: '', e: 'shield|4,poison|2'},
    {c: 'ap', r: 2, d: '2|4', e: 'shield|8,poison|5'},

    // Assassin + heal
    {c: 'ah', r: 1, d: '', e: 'odd:heal|3,even:poison|2'},
    {c: 'ah', r: 2, d: '', e: 'heal|3,poison|2'},
    {c: 'ah', r: 2, d: '3|2', e: 'heal|6,poison|5'},

    // Protector + heal
    {c: 'hp', r: 1, d: '', e: 'odd:heal|3,even:shield|4'},
    {c: 'hp', r: 2, d: '', e: 'heal|3,shield|4'},
    {c: 'hp', r: 2, d: '3|4', e: 'heal|6,shield|8'},
];

let cardList = {};
let classCardNumber = {};
for(card of simpleCardList) {
    classCardNumber[card.c] = classCardNumber[card.c] ? ++classCardNumber[card.c] : 1;
    cardList[`${card.c}${classCardNumber[card.c]}`] = card;
}
