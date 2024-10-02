const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const countdownDisplay = document.getElementById('countdown');
const restartButton = document.getElementById('restartButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spaceship = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 60,
    height: 80,
    speed: 5
};

let meteors = [];
let coins = [];
let stars = [];
let satellites = [];
let astronauts = [];
let explosions = [];
let score = 0;
let lives = 10;
let gameStarted = false;
let countdown = 3;
let currentLevel = 1;

let enemySpaceships = [];

let enemyBullets = [];

function drawSpaceship() {
    ctx.save();
    ctx.translate(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
    
    // גוף החללית
    let gradient = ctx.createLinearGradient(-spaceship.width/2, 0, spaceship.width/2, 0);
    gradient.addColorStop(0, '#aaaaaa');
    gradient.addColorStop(0.5, '#eeeeee');
    gradient.addColorStop(1, '#aaaaaa');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, -spaceship.height / 2);
    ctx.lineTo(spaceship.width / 2, spaceship.height / 2);
    ctx.lineTo(-spaceship.width / 2, spaceship.height / 2);
    ctx.closePath();
    ctx.fill();

    // הוספת אפקט תלת-מימד לגוף החללית
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.stroke();

    // חלון החללית
    gradient = ctx.createRadialGradient(0, -spaceship.height / 4, 0, 0, -spaceship.height / 4, spaceship.width / 4);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.7, '#00ffff');
    gradient.addColorStop(1, '#0000ff');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, -spaceship.height / 4, spaceship.width / 5, 0, Math.PI * 2);
    ctx.fill();

    // כנפיים
    gradient = ctx.createLinearGradient(-spaceship.width, 0, 0, 0);
    gradient.addColorStop(0, '#777777');
    gradient.addColorStop(1, '#cccccc');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(-spaceship.width / 2, spaceship.height / 4);
    ctx.lineTo(-spaceship.width, spaceship.height / 2);
    ctx.lineTo(-spaceship.width / 2, spaceship.height / 2);
    ctx.closePath();
    ctx.fill();

    gradient = ctx.createLinearGradient(0, 0, spaceship.width, 0);
    gradient.addColorStop(0, '#cccccc');
    gradient.addColorStop(1, '#777777');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(spaceship.width / 2, spaceship.height / 4);
    ctx.lineTo(spaceship.width, spaceship.height / 2);
    ctx.lineTo(spaceship.width / 2, spaceship.height / 2);
    ctx.closePath();
    ctx.fill();

    // אש מהמנועים
    gradient = ctx.createLinearGradient(0, spaceship.height / 2, 0, spaceship.height);
    gradient.addColorStop(0, '#ff4400');
    gradient.addColorStop(0.5, '#ff8800');
    gradient.addColorStop(1, '#ffff0000');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(-spaceship.width / 4, spaceship.height / 2);
    ctx.lineTo(0, spaceship.height / 2 + Math.random() * 20 + 15);
    ctx.lineTo(spaceship.width / 4, spaceship.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawMeteors() {
    meteors.forEach(meteor => {
        let gradient = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, meteor.radius);
        gradient.addColorStop(0, '#999999');
        gradient.addColorStop(0.5, '#666666');
        gradient.addColorStop(1, '#444444');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const radius = meteor.radius * (0.8 + Math.random() * 0.4);
            ctx.lineTo(
                meteor.x + Math.cos(angle) * radius,
                meteor.y + Math.sin(angle) * radius
            );
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function drawCoins() {
    coins.forEach(coin => {
        // מטבע זהב תלת-מימדי
        let gradient = ctx.createRadialGradient(coin.x, coin.y, 0, coin.x, coin.y, coin.radius);
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.7, '#ffd700');
        gradient.addColorStop(1, '#ff8c00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // הוספת ברק
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(coin.x - coin.radius / 3, coin.y - coin.radius / 3, coin.radius / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // הוספת קו מתאר
        ctx.strokeStyle = '#ffa500';
        ctx.lineWidth = 2;
        ctx.stroke();

        // הוספת טקסטורה
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    });
}

function drawSatellites() {
    satellites.forEach(satellite => {
        ctx.save();
        ctx.translate(satellite.x, satellite.y);
        
        // גוף הלוויין
        let gradient = ctx.createLinearGradient(-satellite.width/2, 0, satellite.width/2, 0);
        gradient.addColorStop(0, '#888888');
        gradient.addColorStop(0.5, '#cccccc');
        gradient.addColorStop(1, '#888888');
        ctx.fillStyle = gradient;
        ctx.fillRect(-satellite.width/2, -satellite.height/2, satellite.width, satellite.height);
        
        // פאנלים סולאריים
        ctx.fillStyle = '#4444ff';
        ctx.fillRect(-satellite.width, -satellite.height/4, satellite.width/2, satellite.height/2);
        ctx.fillRect(satellite.width/2, -satellite.height/4, satellite.width/2, satellite.height/2);
        
        ctx.restore();
    });
}

function drawAstronauts() {
    astronauts.forEach(astronaut => {
        ctx.save();
        ctx.translate(astronaut.x, astronaut.y);
        
        // גוף החליפה
        let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, astronaut.radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#cccccc');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, astronaut.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // קסדה
        ctx.fillStyle = '#888888';
        ctx.beginPath();
        ctx.arc(0, -astronaut.radius/2, astronaut.radius/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

function drawExplosions() {
    explosions.forEach((explosion, index) => {
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 100, 0, ${1 - explosion.life / 30})`;
        ctx.fill();
        
        explosion.radius += 0.5;
        explosion.life--;
        
        if (explosion.life <= 0) {
            explosions.splice(index, 1);
        }
    });
}

function drawEnemySpaceships() {
    enemySpaceships.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        ctx.rotate(Math.PI); // Rotate 180 degrees to face downwards
        
        // Enemy spaceship body
        let gradient = ctx.createLinearGradient(-enemy.width/2, 0, enemy.width/2, 0);
        gradient.addColorStop(0, '#8B0000');  // Dark red
        gradient.addColorStop(0.5, '#FF0000');  // Bright red
        gradient.addColorStop(1, '#8B0000');  // Dark red
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.height / 2);
        ctx.lineTo(enemy.width / 2, enemy.height / 2);
        ctx.lineTo(-enemy.width / 2, enemy.height / 2);
        ctx.closePath();
        ctx.fill();

        // 3D effect for the body
        ctx.strokeStyle = '#600000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Enemy spaceship window
        gradient = ctx.createRadialGradient(0, -enemy.height / 4, 0, 0, -enemy.height / 4, enemy.width / 4);
        gradient.addColorStop(0, '#FFFF00');  // Bright yellow
        gradient.addColorStop(0.7, '#FFA500');  // Orange
        gradient.addColorStop(1, '#FF4500');  // Red-orange
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, -enemy.height / 4, enemy.width / 5, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        gradient = ctx.createLinearGradient(-enemy.width, 0, 0, 0);
        gradient.addColorStop(0, '#8B0000');  // Dark red
        gradient.addColorStop(1, '#FF0000');  // Bright red
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-enemy.width / 2, enemy.height / 4);
        ctx.lineTo(-enemy.width, enemy.height / 2);
        ctx.lineTo(-enemy.width / 2, enemy.height / 2);
        ctx.closePath();
        ctx.fill();

        gradient = ctx.createLinearGradient(0, 0, enemy.width, 0);
        gradient.addColorStop(0, '#FF0000');  // Bright red
        gradient.addColorStop(1, '#8B0000');  // Dark red
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(enemy.width / 2, enemy.height / 4);
        ctx.lineTo(enemy.width, enemy.height / 2);
        ctx.lineTo(enemy.width / 2, enemy.height / 2);
        ctx.closePath();
        ctx.fill();

        // Engine fire
        gradient = ctx.createLinearGradient(0, enemy.height / 2, 0, enemy.height);
        gradient.addColorStop(0, '#FF4500');  // Red-orange
        gradient.addColorStop(0.5, '#FFA500');  // Orange
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');  // Transparent orange
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-enemy.width / 4, enemy.height / 2);
        ctx.lineTo(0, enemy.height / 2 + Math.random() * 20 + 15);
        ctx.lineTo(enemy.width / 4, enemy.height / 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    });
}

function drawEnemyBullets() {
    ctx.fillStyle = '#FF0000';
    enemyBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}