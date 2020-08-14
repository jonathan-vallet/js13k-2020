# JS13K 2020

This repository allow you to quick start your JS13K project to develop, compile, minify and zip you JS13K project.

Uses adfab-gulp-boilerplate to compile sass or less, concat you JS, minify your assets...with additional tasks to zip and improve minification

[You can play the game here thanks to the GitHub Pages](https://jonathan-vallet.github.io/js13k-2020/index.html).

## Installing

Run `npm install` in the project directory to install all needed packages.

## Compile game

`gulp` to compile your files

Project will be generated in `/www` folder.

## Generate final game

run `gulp --production && gulp zip`

Your game.zip file will be generated in `/dist` folder.

## Goal

Create a game mixing "Slay the Spire" and "Dicey dungeons".
A desktop PVE version (and monetization perhaps) to build a deck and choosing a path like Slay the spire
A PVP version to build a deck and fight other players

Same system than Slay the spire, except that we have dices, and cards drawn are played using dices depending of several conditions like in Dicey Dungeon.

## TODO list

Too many things for now... I'll complete later!