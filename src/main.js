import Phaser from 'phaser';
import { playerTeam, enemyTeam } from './characters.js';

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
    // Display player team on the left
    playerTeam.forEach((character, index) => {
        this.add.text(100, 150 + (index * 80), 
            `${character.name}\nHP: ${character.hp}/${character.maxHp}`, {
            fontSize: '18px',
            fill: '#00ff88'
        });
    });

    // Display enemy team on the right
    enemyTeam.forEach((character, index) => {
        this.add.text(580, 150 + (index * 80),
            `${character.name}\nHP: ${character.hp}/${character.maxHp}`, {
            fontSize: '18px',
            fill: '#ff4444'
        });
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
}