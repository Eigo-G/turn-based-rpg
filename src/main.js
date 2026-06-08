import Phaser from 'phaser';
import { playerTeam, enemyTeam, getTurnOrder, attack } from './characters.js';

let currentTurnIndex = 0;
let turnOrder = [];
let selectedAttacker = null;
let phase = 'select-attacker';
let scene = null;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    backgroundColor: '#1a1a2e',
    scene: {
        create: create
    }
};

const game = new Phaser.Game(config);

function create() {
    scene = this;
    // Display player team on the left
   const playerTexts = [];
playerTeam.forEach((character, index) => {
    const text = this.add.text(100, 150 + (index * 80),
        `${character.name}\nHP: ${character.hp}/${character.maxHp}`, {
        fontSize: '18px',
        fill: '#00ff88'
    });
    text.setInteractive({ useHandCursor: true });
    text.on('pointerdown', () => onPlayerClick(character, text));
    playerTexts.push(text);
});

    // Display enemy team on the right
    const enemyTexts = [];
enemyTeam.forEach((character, index) => {
    const text = this.add.text(580, 150 + (index * 80),
        `${character.name}\nHP: ${character.hp}/${character.maxHp}`, {
        fontSize: '18px',
        fill: '#ff4444'
    });
    text.setInteractive({ useHandCursor: true });
    text.on('pointerdown', () => onEnemyClick(character, text, enemyTexts, playerTexts, turnText));
    enemyTexts.push(text);
});
    function drawHPBar(scene, x, y, character) {
    const barWidth = 150;
    const barHeight = 12;
    
    // Background bar (dark red)
    scene.add.rectangle(x, y, barWidth, barHeight, 0x440000)
        .setOrigin(0);
    
    // Foreground bar (bright green)
    const currentWidth = Math.round((character.hp / character.maxHp) * barWidth);
    scene.add.rectangle(x, y, currentWidth, barHeight, 0x00ff88)
        .setOrigin(0);
}

// Draw HP bars for player team
playerTeam.forEach((character, index) => {
    drawHPBar(this, 100, 185 + (index * 80), character);
});

// Draw HP bars for enemy team
enemyTeam.forEach((character, index) => {
    drawHPBar(this, 580, 185 + (index * 80), character);
});
// Initialise turn order
turnOrder = getTurnOrder(playerTeam, enemyTeam);

// Display whose turn it is
const turnText = this.add.text(400, 50, '', {
    fontSize: '20px',
    fill: '#ffffff'
}).setOrigin(0.5);

updateTurnText(turnText);

const next = turnOrder[currentTurnIndex];
const isPlayerTurn = playerTeam.includes(next);

if (!isPlayerTurn) {
    enemyTurn(this, turnText);
}
}
function updateTurnText(turnText) {
    const current = turnOrder[currentTurnIndex];
    const isPlayer = playerTeam.includes(current);
    
    if (isPlayer) {
        turnText.setText(`Your turn: Select ${current.name} to attack`);
        turnText.setFill('#00ff88');
    } else {
        turnText.setText(`Enemy turn: ${current.name} is attacking`);
        turnText.setFill('#ff4444');
    }
}
function enemyTurn(scene, turnText) {
    const attacker = turnOrder[currentTurnIndex];
    
    // Enemy picks a random living player character
    const livingPlayers = playerTeam.filter(c => c.hp > 0);
    const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
    
    attack(attacker, target);
    
    // Wait 1 second then move to next turn
    scene.time.delayedCall(1000, () => {
        currentTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
        updateTurnText(turnText);
        
        const next = turnOrder[currentTurnIndex];
        const isPlayer = playerTeam.includes(next);
        
        if (!isPlayer) {
            enemyTurn(scene, turnText);
        }
    });
}
function onPlayerClick(character, text) {
    const current = turnOrder[currentTurnIndex];
    if (current !== character || character.hp <= 0) return;
    
    selectedAttacker = character;
    text.setFill('#ffff00');
    console.log(`Selected attacker: ${character.name}`);
}

function onEnemyClick(character, enemyText, enemyTexts, playerTexts, turnText) {
    const current = turnOrder[currentTurnIndex];
    const isPlayerTurn = playerTeam.includes(current);
    
    if (!isPlayerTurn || !selectedAttacker || character.hp <= 0) return;
    
    attack(selectedAttacker, character);
    
    // Update enemy HP text
    const enemyIndex = enemyTeam.indexOf(character);
    enemyTexts[enemyIndex].setText(
        `${character.name}\nHP: ${character.hp}/${character.maxHp}`
    );
    
    selectedAttacker = null;
    
    // Reset player text colours
    playerTexts.forEach(t => t.setFill('#00ff88'));
    
    // Advance turn
    currentTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
    updateTurnText(turnText);
    
    const next = turnOrder[currentTurnIndex];
    if (!playerTeam.includes(next)) {
        enemyTurn(scene, turnText);
    }
}