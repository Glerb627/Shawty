// docs/main.js
import { initUI, showMenu, hideMenu, updateLeaderboard } from './ui.js';
import { connect, sendInput, onServerUpdate, onChatMessage } from './net.js';
import { initPhysics, updatePhysics } from './physics.js';
import { CONFIG } from './config.js';
import { initGame, updateGame, renderGame, addKill, getLeaderboard } from './game.js';

let canvas, ctx;
let lastTime = 0;
let playerName = "";
let chatVisible = false;
let chatInput;
let leaderboardVisible = false;

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    initUI();
    initPhysics();
    initGame();

    chatInput = document.getElementById("chatInput");

    // Connect to server after name is entered
    document.getElementById("startBtn").addEventListener("click", () => {
        playerName = document.getElementById("nameInput").value.trim();
        if (playerName.length > 0) {
            hideMenu();
            connect(playerName);
            requestAnimationFrame(gameLoop);
        }
    });

    // Listen for messages
    onServerUpdate(handleServerUpdate);
    onChatMessage(handleChatMessage);

    // Keyboard events
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
}

function handleKeyDown(e) {
    if (e.key === "t" || e.key === "T") {
        chatVisible = true;
        chatInput.style.display = "block";
        chatInput.focus();
    } else if (e.key === "l" || e.key === "L") {
        leaderboardVisible = !leaderboardVisible;
        if (leaderboardVisible) {
            updateLeaderboard(getLeaderboard());
        }
    } else {
        sendInput({ type: "keydown", key: e.key });
    }
}

function handleKeyUp(e) {
    sendInput({ type: "keyup", key: e.key });
}

function handleServerUpdate(state) {
    updateGame(state);
}

function handleChatMessage(msg) {
    let chatBox = document.getElementById("chatBox");
    let p = document.createElement("p");
    p.textContent = msg;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function gameLoop(timestamp) {
    let delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    updatePhysics(delta);
    renderGame(ctx);

    if (leaderboardVisible) {
        updateLeaderboard(getLeaderboard());
    }

    requestAnimationFrame(gameLoop);
}

window.onload = init;
