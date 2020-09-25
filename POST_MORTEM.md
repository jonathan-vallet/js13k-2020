# JS13K 2020 - Cardice Post mortem

## Intro / future

Hi there! Here is a little post mortem, mixing game design and code about Cardice.

I already got good feedbacks about this game, and I'd like to develop a much more complete and beautiful version without size limit.

Follow me on [https://twitter.com/JoeVallet] if you want to get more information and news about the next steps!

## Game design

It's been 2 years since I wanted to develop a game mixing Dicey Dungeon and Slay the Spire. The first game plays with dice, but use "items" instead of cards, so during a game you often keep the same gameplay. I wanted to create a more deck building game, with a high replay value. I know many game jam games offer 5/10 minuts experiences, rarely roguelike systems, I'm clearly in a niche game!

## Screens

Such a game needs many screens:
- Main menu
- Rules
- Character selection
- Map progression
- game/fight screen
- rewards
- seller

And minor screens like settings, view its deck, heal...
On final version for JS13K there is a little bug on "back" when you are on deck view or settings. It's fixed on [my github version](https://jonathan-vallet.github.io/js13k-2020/index.html).
I saves major screens state (map, fight, main menu...) and have a generic *.js-screen-link* with *data-screen* to activate the screen I want, and go back to previous main screen where player was.

## Character selection

To add a high replay value I wanted to make several roles. The idea was having 6 characters, so any should have a dice face predilection, and special effects for each class.

At the beginning, the player could choose the same class twice, but it was easier for balancing to select 2 different ones.

I've created little avatars with hat and weapons to create "unique" avatars. As you can have the same class with reversed hat/weapon combinaison, 36 avatars are available! 

I created them only with circles and triangles on canvas, it tooks ~1kb. Hachim, who made the graphics, created some SVG avatars more beautiful, but I didn't have time to add them. And I add to make some changes near the end of the project: I had a thief class, with split and reroll dices mechanics, but to hard for the AI. I splitted the mage who had fire and ice, to make 2 characters, and adding split/reroll cards as neutral, available on merchant only.

## Map

For the map, I've been looking for several systems. I've found a [Slay the Spire map generator](https://github.com/yurkth/stsmapgen) really nice with Delaunay triangulation... But much too heavy to implement for JS13K!

Then I created my own simplier system:
- 3 or 4 rooms for every floor
- first rooms are always joined, such as last rooms.
- Every room has a chance to be connected to more than 1 room, but at least to the last available, to avoid dead ends.
- A room cannot be connected to a previously linked room, to avoid crossing
- If a room is still not connected, I add a link to the last room
- Every room position is a little bit randomized for a more natural design

It's not perfect, but it works pretty well like that!

Room symbols are emojis to save place. The design is a canvas with moving lines to create the sea animation.

## Dice

Dice are [inspired from an existing code](https://codesandbox.io/s/xjk3xqnprw?file=/styles.css), but generated in JS, and much more optimized to save place.

I wanted the roll/perspective effect to add a good visual effect.

## Cards

I've made a card list var in JS:
```javascript
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
    {c: 'w', r: 3, d: '+4', e: 'damage|X*3,reflect|X'},

    // Warrior + mage
    {c: 'mw', r: 1, d: '', e: 'odd:damage|3,even:burn|1'},
    {c: 'mw', r: 2, d: '', e: 'damage|3,burn|1'},
    {c: 'mw', r: 3, d: '5|6', e: 'damage|10,burn|5'},

    // Thief + warrior
    {c: 'tw', r: 1, d: '', e: 'odd:damage|3,even:freeze|1'},
    {c: 'tw', r: 2, d: '', e: 'damage|3,freeze|1'},
    {c: 'tw', r: 3, d: '1|6', e: 'damage|10,freeze|5'},
...
];
```

This format was easy to maintain and short to write (to save code and create a maximum of different cards). I loop on this *simpleCardList* to add unique ids after that to target cards (w1, w2, mw1, tw1...).

Each card is generated in Js splitting effect list on commas, effect condition on two points, effect name on pipe.

This effect text is used twice in the code:
- to write the text on te card
- to apply the correct effect and value when playing card

I wanted to add double dice cards to improve varierty and deck building management (hard to use but more powerful). At the beginning I wanted to drag a cide, then another, but the check condition was too hard to code, and player should have the possibility to move/remove the dice from the card. I decided to check one dice, and if the player has another available dice, play both. One card is bugged due to that system on the JS13K version, as you can play 2 free dice, the game chose the second one for you.

## AI / opponent

I'd like to have a PvP/server version and a PvE/solo, but it was hard too ambitious alone! As I don't have many knowledges for server part, I decided to focus on the PvE version, then I had to code the opponent playing cards...

The AI is basic, but it demands a lot of work and tricks! First, opponent decks are basic without double cards. One problem if I let the opponent playing randomly, was to lock some choices and play few cards each turn.

AI works like that:
- For every dice, I check which cards are playable.
- I play a random card for the fice which have less choices first.
- I loop and check new choices after the card is removed and do it again.

That way, I didn't notice "bad play" from the AI, every turn a maximum of cards are played!

## Gameplay

Every class has its own effect and predilection dice:
- Warrior (6) can stun. A dice will have 50% chance to fail when played next turn
- Fire mage (5) can burn. A dice will do 5 damage if the player use it on next turn. (AI won't play the dice if it has 5 or less life points, so as not to commit suicide)
- Ice mage (2) can freeze. the highet dice will be reduced to 1 next turn.
- Assassin (1) can poison. Less damages but cumulative and persistents (too persistent in JS13K version, as it's not reset between each fight...)
- Protected (4) can use shield. Avoid next turn damage to be taken
- Healer (3) can heal to restore his life

The idea is to get some Paper-Scissor-Stone synergies:
- Ice mage is powerful against a Warrior who wants bigger dice, but will help the assassin who prefers lower ones.
- Poison go through shield, it's efficient against protector and healer as it's slower but cumulative
- Protector can use a shield to avoid fire damage during his turn to use every dice

## Conclusion

I had a lot of fun to develop this game! It was really intense to save place as I have lot of features! And I wanted to get consistent graphics and visual effects.

If you loved the gameplay of cards + dice, don't forget that more is to come! Follow the news on [https://twitter.com/JoeVallet] :)