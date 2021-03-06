# Project 2: Memory Game

## Description

A browser-based card matching game.

<img src="https://github.com/jonessarae/front_end_web_developer_projects/blob/master/memory_game/match_game.png" width="400" >

## How to Install

Download the project and view *index.html* in your chosen browser.

## How the Game Works

The game board consists of sixteen "cards" arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!

Each turn:

* The player flips one card over to reveal its underlying symbol.
* The player then turns over a second card, trying to find the corresponding card with the same symbol.
* If the cards match, both cards stay flipped over.
* If the cards do not match, both cards are flipped face down.
* The game ends once all cards have been correctly matched.

## Code Review

Reviewer suggested use of "use strict;" tag in javascript files. This tag forces you to write better code by preventing functions with bad syntax from declaring a variable before using it.
