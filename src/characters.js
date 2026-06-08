const playerTeam = [
    { name: "Kael", hp: 1000, maxHp: 1000, attack: 150, speed: 80, element: "fire" },
    { name: "Lyra", hp: 800, maxHp: 800, attack: 120, speed: 110, element: "wind" },
    { name: "Gorath", hp: 1400, maxHp: 1400, attack: 180, speed: 50, element: "earth" }
];

const enemyTeam = [
    { name: "Shade", hp: 900, maxHp: 900, attack: 140, speed: 90, element: "dark" },
    { name: "Vex", hp: 750, maxHp: 750, attack: 130, speed: 120, element: "wind" },
    { name: "Brute", hp: 1500, maxHp: 1500, attack: 170, speed: 40, element: "earth" }
];

console.log("Player Team:", playerTeam);
console.log("Enemy Team:", enemyTeam);

function getTurnOrder(playerTeam, enemyTeam) {
    const allCharacters = [...playerTeam, ...enemyTeam];
    
    const turnOrder = allCharacters.sort((a, b) => b.speed - a.speed);
    
    return turnOrder;
}

const turnOrder = getTurnOrder(playerTeam, enemyTeam);

turnOrder.forEach((character, index) => {
    console.log(`Turn ${index + 1}: ${character.name} (Speed: ${character.speed})`);
});

function calculateDamage(attacker, defender) {
    let damage = attacker.attack;
    
    const elementChart = {
        fire:  { strong: "earth", weak: "wind" },
        wind:  { strong: "fire",  weak: "earth" },
        earth: { strong: "wind",  weak: "fire" },
        dark:  { strong: "wind",  weak: "earth" }
    };

    const attackerElement = elementChart[attacker.element];
    
    if (attackerElement.strong === defender.element) {
        damage = Math.round(damage * 1.5);
        console.log(`${attacker.name} hits ${defender.name} for ${damage} (STRONG!)`);
    } else if (attackerElement.weak === defender.element) {
        damage = Math.round(damage * 0.75);
        console.log(`${attacker.name} hits ${defender.name} for ${damage} (WEAK!)`);
    } else {
        console.log(`${attacker.name} hits ${defender.name} for ${damage}`);
    }
    
    return damage;
}
// calculateDamage(playerTeam[0], enemyTeam[0]);
// calculateDamage(playerTeam[1], enemyTeam[2]);
// calculateDamage(playerTeam[2], enemyTeam[1]);

function attack(attacker, defender) {
    const damage = calculateDamage(attacker, defender);
    defender.hp -= damage;
    
    if (defender.hp < 0) defender.hp = 0;
    
    console.log(`${defender.name} HP: ${defender.hp}/${defender.maxHp}`);
    
    if (defender.hp === 0) {
        console.log(`${defender.name} has been defeated!`);
    }
}

// attack(playerTeam[2], enemyTeam[1]);
// attack(playerTeam[2], enemyTeam[1]);
// attack(playerTeam[2], enemyTeam[1]);

export { playerTeam, enemyTeam };