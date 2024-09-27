let bullets = [];
let levelUpMessage = '';
let levelUpMessageTimeout;

function checkCollisions() {
    meteors.forEach((meteor, meteorIndex) => {
        const dx = (spaceship.x + spaceship.width / 2) - meteor.x;
        const dy = (spaceship.y + spaceship.height / 2) - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (spaceship.width / 2 + meteor.radius)) {
            lives--;
            livesDisplay.textContent = 'חיים: ' + lives;
            resetMeteor(meteor);
            createExplosion(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
            if (lives <= 0) {
                gameOver();
            }
        }

        bullets.forEach((bullet, bulletIndex) => {
            const bulletDx = bullet.x - meteor.x;
            const bulletDy = bullet.y - meteor.y;
            const bulletDistance = Math.sqrt(bulletDx * bulletDx + bulletDy * bulletDy);

            if (bulletDistance < meteor.radius) {
                createExplosion(meteor.x, meteor.y);
                resetMeteor(meteor);
                bullets.splice(bulletIndex, 1);
                score += 5;
                scoreDisplay.textContent = 'ניקוד: ' + score;
                checkLevelUp();
            }
        });
    });

    coins.forEach((coin, index) => {
        const dx = (spaceship.x + spaceship.width / 2) - coin.x;
        const dy = (spaceship.y + spaceship.height / 2) - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (spaceship.width / 2 + coin.radius)) {
            score++;
            scoreDisplay.textContent = 'ניקוד: ' + score;
            resetCoin(coin);
            checkLevelUp();
        }
    });

    if (currentLevel >= 2) {
        satellites.forEach((satellite, satelliteIndex) => {
            if (checkCollisionSatellite(spaceship, satellite)) {
                lives--;
                livesDisplay.textContent = 'חיים: ' + lives;
                resetSatellite(satellite);
                createExplosion(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
                if (lives <= 0) {
                    gameOver();
                }
            }

            bullets.forEach((bullet, bulletIndex) => {
                if (checkCollisionSatellite(bullet, satellite)) {
                    createExplosion(satellite.x + satellite.width / 2, satellite.y + satellite.height / 2);
                    resetSatellite(satellite);
                    bullets.splice(bulletIndex, 1);
                    score += 10;
                    scoreDisplay.textContent = 'ניקוד: ' + score;
                    checkLevelUp();
                }
            });
        });
    }

    if (currentLevel >= 3) {
        astronauts.forEach((astronaut, astronautIndex) => {
            if (checkCollisionRect(spaceship, astronaut)) {
                lives--;
                livesDisplay.textContent = 'חיים: ' + lives;
                resetAstronaut(astronaut);
                createExplosion(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
                if (lives <= 0) {
                    gameOver();
                }
            }

            bullets.forEach((bullet, bulletIndex) => {
                if (checkCollisionRectCircle(astronaut, bullet)) {
                    createExplosion(astronaut.x, astronaut.y);
                    resetAstronaut(astronaut);
                    bullets.splice(bulletIndex, 1);
                    score += 15;
                    scoreDisplay.textContent = 'ניקוד: ' + score;
                    checkLevelUp();
                }
            });
        });
    }
}

function checkCollisionRect(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function checkCollisionRectCircle(rect, circle) {
    let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    let distanceX = circle.x - closestX;
    let distanceY = circle.y - closestY;

    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (circle.radius * circle.radius);
}

function checkCollisionSatellite(object, satellite) {
    const wingWidth = satellite.width / 2;
    const wingHeight = satellite.height / 4;

    // Define the left wing rectangle
    const leftWing = {
        x: satellite.x - wingWidth,
        y: satellite.y + satellite.height / 2 - wingHeight / 2,
        width: wingWidth,
        height: wingHeight
    };

    // Define the right wing rectangle
    const rightWing = {
        x: satellite.x + satellite.width,
        y: satellite.y + satellite.height / 2 - wingHeight / 2,
        width: wingWidth,
        height: wingHeight
    };

    if (object.radius) {
        // Object is a circle (bullet)
        // Check collision with main body
        if (checkCollisionRectCircle(satellite, object)) {
            return true;
        }
        // Check collision with left wing
        if (checkCollisionRectCircle(leftWing, object)) {
            return true;
        }
        // Check collision with right wing
        if (checkCollisionRectCircle(rightWing, object)) {
            return true;
        }
    } else {
        // Object is a rectangle (spaceship)
        // Check collision with main body
        if (checkCollisionRect(satellite, object)) {
            return true;
        }
        // Check collision with left wing
        if (checkCollisionRect(leftWing, object)) {
            return true;
        }
        // Check collision with right wing
        if (checkCollisionRect(rightWing, object)) {
            return true;
        }
    }
    return false;
}


function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        radius: 10,
        life: 30
    });
}

function checkLevelUp() {
    const newLevel = Math.min(3, Math.floor(score / 20) + 1);
    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        showLevelUpMessage();
        if (currentLevel === 2) {
            createSatellites();
        } else if (currentLevel === 3) {
            createAstronauts();
        }
    }
}

function showLevelUpMessage() {
    levelUpMessage = `עברת לשלב ${currentLevel}!`;
    clearTimeout(levelUpMessageTimeout);
    levelUpMessageTimeout = setTimeout(() => {
        levelUpMessage = '';
    }, 3000);
}

function gameOver() {
    alert('המשחק נגמר! הניקוד שלך: ' + score);
    resetGame();
}

function resetMeteor(meteor) {
    meteor.x = Math.random() * canvas.width;
    meteor.y = -meteor.radius;
    meteor.speed = 2 + Math.random() * 2;
    meteor.radius = 15 + Math.random() * 20;
}

function resetCoin(coin) {
    coin.x = Math.random() * canvas.width;
    coin.y = -coin.radius;
    coin.speed = 1 + Math.random() * 2;
}

function resetSatellite(satellite) {
    satellite.x = Math.random() * (canvas.width - satellite.width);
    satellite.y = -satellite.height;
}

function resetAstronaut(astronaut) {
    astronaut.x = Math.random() * (canvas.width - astronaut.width);
    astronaut.y = -astronaut.height;
}

function createMeteorsAndCoins() {
    meteors = [];
    coins = [];

    for (let i = 0; i < 5; i++) {
        meteors.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            radius: 15 + Math.random() * 20,
            speed: 2 + Math.random() * 2
        });
    }

    for (let i = 0; i < 10; i++) {
        coins.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            radius: 10,
            speed: 1 + Math.random() * 2
        });
    }
}

function createSatellites() {
    satellites = [];
    for (let i = 0; i < 3; i++) {
        satellites.push({
            x: Math.random() * (canvas.width - 60),
            y: Math.random() * canvas.height - canvas.height,
            width: 60,
            height: 40,
            speed: 1 + Math.random()
        });
    }
}

function createAstronauts() {
    astronauts = [];
    for (let i = 0; i < 2; i++) {
        astronauts.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * canvas.height - canvas.height,
            width: 30,
            height: 50,
            speed: 0.5 + Math.random() * 0.5
        });
    }
}

function createStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5
        });
    }
}

function resetGame() {
    spaceship.x = canvas.width / 2 - spaceship.width / 2;
    spaceship.y = canvas.height - spaceship.height - 20;
    createMeteorsAndCoins();
    satellites = [];
    astronauts = [];
    explosions = [];
    bullets = [];
    score = 0;
    lives = 10;
    currentLevel = 1;
    scoreDisplay.textContent = 'ניקוד: 0';
    livesDisplay.textContent = 'חיים: 10';
    gameStarted = false;
    countdown = 3;
    startCountdown();
}

function startCountdown() {
    countdownDisplay.style.display = 'block';
    let countdownInterval = setInterval(() => {
        countdownDisplay.textContent = countdown;
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            gameStarted = true;
            gameLoop();
        }
    }, 1000);
}

function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawSpaceship();
    drawMeteors();
    drawCoins();
    drawLives();
    if (currentLevel >= 2) drawSatellites();
    if (currentLevel >= 3) drawAstronauts();
    drawExplosions();
    drawBullets();
    moveMeteors();
    moveCoins();
    moveBullets();
    if (currentLevel >= 2) moveSatellites();
    if (currentLevel >= 3) moveAstronauts();
    checkCollisions();

    if (levelUpMessage) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(levelUpMessage, canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function drawAstronauts() {
    ctx.fillStyle = 'white';
    astronauts.forEach(astronaut => {
        // גוף
        ctx.fillRect(astronaut.x, astronaut.y + astronaut.height / 4, astronaut.width, astronaut.height / 2);
        
        // ראש
        ctx.beginPath();
        ctx.arc(astronaut.x + astronaut.width / 2, astronaut.y + astronaut.height / 4, astronaut.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // רגליים
        ctx.fillRect(astronaut.x + astronaut.width / 4, astronaut.y + astronaut.height * 3/4, astronaut.width / 5, astronaut.height / 4);
        ctx.fillRect(astronaut.x + astronaut.width * 3/5, astronaut.y + astronaut.height * 3/4, astronaut.width / 5, astronaut.height / 4);
        
        // ידיים
        ctx.fillRect(astronaut.x - astronaut.width / 6, astronaut.y + astronaut.height / 3, astronaut.width / 5, astronaut.height / 3);
        ctx.fillRect(astronaut.x + astronaut.width, astronaut.y + astronaut.height / 3, astronaut.width / 5, astronaut.height / 3);
        
        // קסדה
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(astronaut.x + astronaut.width / 2, astronaut.y + astronaut.height / 4, astronaut.width / 2.5, 0, Math.PI * 2);
        ctx.stroke();
    });
}

function initGame() {
    createMeteorsAndCoins();
    createStars();
    startCountdown();
}

document.addEventListener('keydown', (e) => {
    if (gameStarted) {
        switch (e.key) {
            case 'ArrowLeft':
                spaceship.x -= spaceship.speed;
                break;
            case 'ArrowRight':
                spaceship.x += spaceship.speed;
                break;
            case ' ':
                shootBullet();
                break;
        }
        
        spaceship.x = Math.max(0, Math.min(canvas.width - spaceship.width, spaceship.x));
    }
});

function shootBullet() {
    bullets.push({
        x: spaceship.x + spaceship.width / 2,
        y: spaceship.y,
        speed: 10,
        radius: 3
    });
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    spaceship.x = canvas.width / 2 - spaceship.width / 2;
    spaceship.y = canvas.height - spaceship.height - 20;
    createStars();
});

restartButton.addEventListener('click', resetGame);
initGame();
