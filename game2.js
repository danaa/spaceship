function drawStars() {
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawLives() {
    const starSize = 20;
    const startX = 100;
    const startY = 30;
    const spacing = 25;

    for (let i = 0; i < lives; i++) {
        drawStar(startX + i * spacing, startY, starSize, 5, 0.5);
    }
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    
    let gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius);
    gradient.addColorStop(0, '#ffff00');
    gradient.addColorStop(0.7, '#ffd700');
    gradient.addColorStop(1, '#ff8c00');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#ffa500';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function moveMeteors() {
    meteors.forEach(meteor => {
        meteor.y += meteor.speed;
        if (meteor.y > canvas.height) {
            resetMeteor(meteor);
        }
    });
}

function moveCoins() {
    coins.forEach(coin => {
        coin.y += coin.speed;
        if (coin.y > canvas.height) {
            resetCoin(coin);
        }
    });
}

function moveSatellites() {
    satellites.forEach(satellite => {
        satellite.y += satellite.speed;
        if (satellite.y > canvas.height) {
            resetSatellite(satellite);
        }
    });
}

function moveAstronauts() {
    astronauts.forEach(astronaut => {
        astronaut.y += astronaut.speed;
        if (astronaut.y > canvas.height) {
            resetAstronaut(astronaut);
        }
    });
}

function moveEnemySpaceships() {
    enemySpaceships.forEach(enemy => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            resetEnemySpaceship(enemy);
        }
    });
}

// Add this function to move enemy bullets
function moveEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
        }
    });
}
