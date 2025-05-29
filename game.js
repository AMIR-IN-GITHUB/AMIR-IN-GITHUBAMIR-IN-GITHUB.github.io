const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreDiv = document.getElementById('score');

const roadWidth = 280;
const roadX = (canvas.width - roadWidth) / 2;
const carWidth = 50;
const carHeight = 90;
const laneCount = 3;
const laneWidth = roadWidth / laneCount;

let car = { x: roadX + laneWidth, y: canvas.height - carHeight - 20, lane: 1 };
let obstacles = [];
let score = 0;
let gameRunning = false;
let speed = 4;
let animationId;

function drawRoad() {
    ctx.fillStyle = '#444';
    ctx.fillRect(roadX, 0, roadWidth, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(roadX, 0, roadWidth, canvas.height);
    // Lane lines
    ctx.setLineDash([20, 20]);
    ctx.lineWidth = 2;
    for (let i = 1; i < laneCount; i++) {
        ctx.beginPath();
        ctx.moveTo(roadX + i * laneWidth, 0);
        ctx.lineTo(roadX + i * laneWidth, canvas.height);
        ctx.strokeStyle = '#fff';
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

function drawCar() {
    ctx.save();
    ctx.shadowColor = '#ff512f';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ff512f';
    ctx.fillRect(car.x, car.y, carWidth, carHeight);
    ctx.restore();
    // Windows
    ctx.fillStyle = '#fff';
    ctx.fillRect(car.x + 10, car.y + 20, carWidth - 20, 30);
}

function drawObstacles() {
    ctx.fillStyle = '#2a5298';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, carWidth, carHeight);
    });
}

function moveObstacles() {
    obstacles.forEach(obs => {
        obs.y += speed;
    });
    obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function spawnObstacle() {
    // Only spawn if last obstacle is far enough away
    const minDistance = carHeight * 2.2; // Increase this value for more space
    if (obstacles.length > 0) {
        const lastObs = obstacles[obstacles.length - 1];
        if (lastObs.y < minDistance) {
            return;
        }
    }
    const lane = Math.floor(Math.random() * laneCount);
    obstacles.push({
        x: roadX + lane * laneWidth,
        y: -carHeight
    });
}

function checkCollision() {
    for (let obs of obstacles) {
        if (
            car.x < obs.x + carWidth &&
            car.x + carWidth > obs.x &&
            car.y < obs.y + carHeight &&
            car.y + carHeight > obs.y
        ) {
            return true;
        }
    }
    return false;
}

function updateScore() {
    score++;
    scoreDiv.textContent = 'Score: ' + score;
}

function resetGame() {
    car = { x: roadX + laneWidth, y: canvas.height - carHeight - 20, lane: 1 };
    obstacles = [];
    score = 0;
    speed = 4;
    scoreDiv.textContent = 'Score: 0';
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    drawCar();
    drawObstacles();
    moveObstacles();
    // Only try to spawn if enough space since last obstacle
    spawnObstacle();
    if (checkCollision()) {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Restart';
        return;
    }
    updateScore();
    speed += 0.002;
    if (gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft' && car.lane > 0) {
        car.lane--;
        car.x = roadX + car.lane * laneWidth;
    } else if (e.key === 'ArrowRight' && car.lane < laneCount - 1) {
        car.lane++;
        car.x = roadX + car.lane * laneWidth;
    }
});

startBtn.addEventListener('click', () => {
    resetGame();
    startBtn.style.display = 'none';
    gameRunning = true;
    gameLoop();
});

// Initial UI state
startBtn.style.display = 'inline-block';
scoreDiv.textContent = 'Score: 0';

function drawObstacle(obstacle) {
    // Draw car body
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Draw car roof
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(obstacle.x + obstacle.width * 0.2, obstacle.y + obstacle.height * 0.15, obstacle.width * 0.6, obstacle.height * 0.3);

    // Draw windows
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(obstacle.x + obstacle.width * 0.3, obstacle.y + obstacle.height * 0.18, obstacle.width * 0.4, obstacle.height * 0.18);

    // Draw wheels
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(obstacle.x + obstacle.width * 0.22, obstacle.y + obstacle.height * 0.85, obstacle.width * 0.13, 0, Math.PI * 2);
    ctx.arc(obstacle.x + obstacle.width * 0.78, obstacle.y + obstacle.height * 0.85, obstacle.width * 0.13, 0, Math.PI * 2);
    ctx.fill();
}
// Initial UI state
startBtn.style.display = 'inline-block';
scoreDiv.textContent = 'Score: 0';