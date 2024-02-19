"use strict";
var btnMinimum = document.getElementById("btnMinimum");
var btnFinite = document.getElementById("btnFinite");
var btnMaximum = document.getElementById("btnMaximum");
btnMinimum === null || btnMinimum === void 0 ? void 0 : btnMinimum.addEventListener("click", function () {
    gameType = GameType.MIN_COINS;
    location.href = "game.html";
});
btnFinite === null || btnFinite === void 0 ? void 0 : btnFinite.addEventListener("click", function () {
    gameType = GameType.FINITE_COINS;
    location.href = "game.html";
});
btnMaximum === null || btnMaximum === void 0 ? void 0 : btnMaximum.addEventListener("click", function () {
    gameType = GameType.MAX_COINS;
    location.href = "game.html";
});
