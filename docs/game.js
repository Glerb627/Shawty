import Net from './net.js';
import { drawMenu, drawHUD, drawLeaderboard, drawChat } from './ui.js';
import { Player, players } from './player.js';
import { bullets, Bullet } from './weapon.js';
import { map, checkCollision } from './physics.js';

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let localPlayer = null;
let keys = {};
let chatOpen = false;
let leaderboardOpen = false;
let messages = [];

function init(name, serverURL) {
  localPlayer = new Player(name, Math.random()*500, Math.random()*500);
  Net.connect(serverURL, name);

  Net.on('state', (serverState) => {
    Object.keys(serverState.players).forEach(id => {
      if (!players[id]) players[id] = new Player(serverState.players[id].name, 0,0);
      players[id].x = serverState.players[id].x;
      players[id].y = serverState.players[id].y;
      players[id].kills = serverState.players[id].kills;
      players[id].deaths = serverState.players[id].deaths;
    });
  });

  Net.on('chat', (msg) => {
    messages.push(msg);
    if (messages.length > 5) messages.shift();
  });

  Net.on('kill', (feed) => {
    messages.push(`${feed.killer} eliminated ${feed.victim}`);
    if (messages.length > 5) messages.shift();
  });

  loop();
}

function loop() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Movement
  if (!chatOpen && localPlayer) {
    if (keys['KeyW']) localPlayer.move(0, -5);
    if (keys['KeyS']) localPlayer.move(0, 5);
    if (keys['KeyA']) localPlayer.move(-5, 0);
    if (keys['KeyD']) localPlayer.move(5, 0);
    Net.send('move', { x: localPlayer.x, y: localPlayer.y });
  }

  // Draw map
  ctx.fillStyle = '#333';
  map.forEach(tile => ctx.fillRect(tile.x, tile.y, tile.w, tile.h));

  // Draw players
  Object.values(players).forEach(p => p.draw(ctx));

  // Draw bullets
  bullets.forEach(b => b.updateAndDraw(ctx));

  // HUD
  drawHUD(ctx, localPlayer, messages);

  if (leaderboardOpen) drawLeaderboard(ctx, players);
  if (chatOpen) drawChat(ctx);

  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'KeyT') chatOpen = true;
  if (e.code === 'KeyL') leaderboardOpen = !leaderboardOpen;
});

window.addEventListener('keyup', (e) => keys[e.code] = false);

export { init };
