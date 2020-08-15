const TYPE_WARRIOR = 'warrior';
const TYPE_MAGE = 'mage';
const TYPE_THIEF = 'thief';
const TYPE_ASSASSIN = 'assassin';
const TYPE_PROTECTOR = 'protector';
const TYPE_HEAL = 'heal';
const TYPE_ROGUE = 'rogue';

var cardList = [
{
    type: TYPE_WARRIOR,
    dice: '-6',
    effect: 'damage|X',
    rarity: 1
},
{
    type: TYPE_MAGE,
    dice: '+2',
    effect: 'magic|X',
    rarity: 2
},
{
    type: TYPE_THIEF,
    dice: '6',
    effect: 'split|2',
    rarity: 3
},
{
    type: TYPE_ASSASSIN,
    dice: 'double',
    effect: 'poison|3',
    rarity: 4
},
{
    type: TYPE_PROTECTOR,
    dice: '-6|*1',
    effect: 'protection|X',
    rarity: 1
},
{
    type: TYPE_HEAL,
    dice: 'odd',
    effect: 'heal|X-1',
    rarity: 1
},
{
    type: TYPE_ROGUE,
    dice: 'odd',
    effect: 'heal|X-1',
    rarity: 1
}
];