function checkCollisions() {
    meteors.forEach(meteor => {
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
    });

    coins.forEach((coin, index) => {
        const dx = (spaceship.x + spaceship.width / 2) - coin.x;
        const dy = (spaceship.y + spaceship.height / 2) - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (spaceship.width / 2 + coin.radius)) {
            score++;
            scoreDisplay.textContent = 'ניקוד: ' + score;
            resetCoin(coin);  // במקום למחוק את המטבע, אנחנו מאפסים אותו
            checkLevelUp();
        }
    });

    if (currentLevel >= 2) {
        satellites.forEach(satellite => {
            if (checkCollisionRect(spaceship, satellite)) {
                lives--;
                livesDisplay.textContent = 'חיים: ' + lives;
                resetSatellite(satellite);
                createExplosion(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
                if (lives <= 0) {
                    gameOver();
                }
            }
        });
    }

    if (currentLevel >= 3) {
        astronauts.forEach(astronaut => {
            const dx = (spaceship.x + spaceship.width / 2) - astronaut.x;
            const dy = (spaceship.y + spaceship.height / 2) - astronaut.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (spaceship.width / 2 + astronaut.radius)) {
                lives--;
                livesDisplay.textContent = 'חיים: ' + lives;
                resetAstronaut(astronaut);
                createExplosion(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
                if (lives <= 0) {
                    gameOver();
                }
            }
        });
    }
}

function checkCollisionRect(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
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
    if (score % 20 === 0) {
        currentLevel = Math.min(3, Math.floor(score / 20) + 1);
        if (currentLevel === 2) {
            createSatellites();
        } else if (currentLevel === 3) {
            createAstronauts();
        }
    }
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
    astronaut.x = Math.random() * canvas.width;
    astronaut.y = -astronaut.radius;
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
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            radius: 20,
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
    spaceship.y = canvas.height - 100;
    createMeteorsAndCoins();
    satellites = [];
    astronauts = [];
    explosions = [];
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
    moveMeteors();
    moveCoins();
    if (currentLevel >= 2) moveSatellites();
    if (currentLevel >= 3) moveAstronauts();
    checkCollisions();

    requestAnimationFrame(gameLoop);
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
        }
        
        spaceship.x = Math.max(0, Math.min(canvas.width - spaceship.width, spaceship.x));
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    spaceship.x = canvas.width / 2 - spaceship.width / 2;
    spaceship.y = canvas.height - 100;
    createStars();
});

restartButton.addEventListener('click', resetGame);

initGame();
