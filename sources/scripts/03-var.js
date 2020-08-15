// Set your global var here
const TYPE_WARRIOR = 'w';
const TYPE_MAGE = 'm';
const TYPE_THIEF = 't';
const TYPE_ASSASSIN = 'a';
const TYPE_PROTECTOR = 'p';
const TYPE_HEAL = 'h';
const TYPE_ROGUE = 'r';

var CLASS_LIST = {};
CLASS_LIST[TYPE_WARRIOR] = {
    n: 'warrior',
    c: '#942'
};
CLASS_LIST[TYPE_MAGE] = {
    n: 'mage',
    c: '#18b'
};
CLASS_LIST[TYPE_THIEF] = {
    n: 'thief',
    c: '#449'
};
CLASS_LIST[TYPE_ASSASSIN] = {
    n: 'assassin',
    c: '#777'
};
CLASS_LIST[TYPE_PROTECTOR] = {
    n: 'protector',
    c: '#a80'
};
CLASS_LIST[TYPE_HEAL] = {
    n: 'heal',
    c: '#162'
}

// Elements
var $allcardList = $('allCardList');
var $myCardList = $('myCardList');
var $myDeckList = $('myDeckList');
var $avatarChoiceList1 = $('avatarChoiceList1');
var $avatarChoiceList2 = $('avatarChoiceList2');
var $myAvatar = $('myAvatar');
var $myAvatarName = $('myAvatarName');
var $map = $('map');