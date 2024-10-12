const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pigImage = new Image();
pigImage.src = 'https://i.imgur.com/C0QUUdq.png';

const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    vy: 0,
    gravity: 0.5,
    jumpStrength: -10
};

let obstacles = [];
let gameSpeed = 2;
let score = 0;
let lives = 3;
let animationFrameId;

function startGame() {
    gameSpeed = 2;
    score = 0;
    lives = 3;
    obstacles = [];
    document.getElementById('gameOver').style.display = 'none';
    loop();
}

function createObstacle() {
    const height = Math.random() * (canvas.height / 2) + 20;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 20,
        height: height
    });
}

function updateObstacles() {
    obstacles = obstacles.filter(obs => {
        obs.x -= gameSpeed;
        if (checkCollision(player, obs)) {
            lives--;
            if (lives <= 0) {
                endGame();
            }
            return false;
        }
        return obs.x + obs.width > 0;
    });

    if (Math.random() < 0.02) {
        createObstacle();
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function drawPlayer() {
    context.drawImage(pigImage, player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    context.fillStyle = 'gray';
    obstacles.forEach(obs => {
        context.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function drawScore() {
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('Score: ' + score, 20, 30);
    context.fillText('Lives: ' + lives, 20, 60);
}

function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.vy = 0;
    }

    drawPlayer();
    drawObstacles();
    drawScore();

    updateObstacles();

    score += 0.1;

    animationFrameId = requestAnimationFrame(loop);
}

function endGame() {
    cancelAnimationFrame(animationFrameId);
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').innerText = '最终得分: ' + Math.floor(score);
}

function restartGame() {
    startGame();
}

canvas.addEventListener('click', () => {
    if (player.y + player.height >= canvas.height) {
        player.vy = player.jumpStrength;
    }
});

pigImage.onload = startGame;