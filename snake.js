var c, ctx;
var container = { left: 100, right: 500, top: 100, bottom: 500, color: "black" };
var snake = { length: 10, color: "white", vx: 0, vy: 0 };
var snakevel = 1;
var snakeposx = [150];
var snakeposy = [150];
var snakeprevx = 149;
var snakeprevy = 149;
var candy = { left: 100, top: 100, size: 10, color: "white", presence: 0 };
var supercandy = { left: 100, top: 100, rad: 7, color: "white", presence: 0, counter: 0 };
var gamestate = "";
var level = 1;

function doatload() {
    document.body.addEventListener("keydown", check, false);
    draw();
}

function draw() {
    if(gamestate == "<br>GAMEOVER"){
        snake.vx = 0;
        snake.vy = 0;
    }

    
    ctx.clearRect(0, 0, 1000, 600);
    ctx.beginPath();
    ctx.fillStyle = container.color;
    ctx.fillRect(container.left, container.top, container.right - container.left, container.bottom - container.top);

    document.getElementById("disp").innerHTML = "Level " + level + "<br>Score<br>" + snake.length + gamestate;

    if (level == 2) {
        drawlevel2stuff();
    }

    if (candy.presence == 0) {
        changecandy();
    }

    if (Math.random() > 0.997 && supercandy.presence == 0) {
        putsupercandy();
    }
    if (supercandy.presence == 1) {
        if (supercandy.counter < 300) {
            changesupercandy();
        }
        else {
            supercandy.presence = 0;
        }
    }

    putcandy();

    drawsnake();

    requestAnimationFrame(draw);
}

function putcandy() {
    ctx.beginPath();
    ctx.fillStyle = candy.color;
    ctx.fillRect(candy.left, candy.top, candy.size, candy.size);
    candy.presence = 1;
}

function changecandy() {
    candy.left = Math.floor(300 * Math.random()) + 150;
    candy.top = Math.floor(300 * Math.random()) + 150;
    candy.color = "hsl(" + 360 * Math.random() + ",100%,50%)";
}

function checkcandy() {
    if (snakeposx[0] >= candy.left && snakeposx[0] < candy.left + candy.size) {
        if (snakeposy[0] >= candy.top && snakeposy[0] < candy.top + candy.size) {
            snake.length += 4;
            snakeposx.length += 4;
            snakeposy.length += 4;
            snakevel+=5;
            candy.presence = 0;
            if (snake.length > 100) {
                level = 2;
            }
        }
    }
}

function putsupercandy() {
    supercandy.left = Math.floor(300 * Math.random()) + 150;
    supercandy.top = Math.floor(300 * Math.random()) + 150;
    supercandy.color = "hsl(" + 360 * Math.random + ",100%,50%)";
    ctx.beginPath();
    ctx.fillStyle = supercandy.color;
    ctx.arc(supercandy.left, supercandy.top, supercandy.rad, 0, 2 * Math.PI);
    ctx.fill();
    supercandy.presence = 1;
    supercandy.counter = 0;
}

function changesupercandy() {
    supercandy.color = "hsl(" + 360 * Math.random() + ",100%,50%)";
    ctx.beginPath();
    ctx.fillStyle = supercandy.color;
    ctx.arc(supercandy.left, supercandy.top, supercandy.rad, 0, 2 * Math.PI);
    ctx.fill();
    supercandy.counter++;
}

function checksupercandy() {
    if (Math.sqrt((snakeposx[0] - supercandy.left) * (snakeposx[0] - supercandy.left) + (snakeposy[0] - supercandy.top) * (snakeposy[0] - supercandy.top)) <= supercandy.rad) {
        snake.length += 10;
        snakeposx.length += 10;
        snakeposy.length += 10;
        snakevel *= 1.1;
        supercandy.presence = 0;
        if (snake.length > 100) {
            level = 2;
        }
    }
}

function drawsnake() {

    for (var i = 0; i < snake.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = snake.color;
        ctx.fillRect(snakeposx[i], snakeposy[i], 1, 1);
    }
    
    addvel();
    
}

function addvel() {
    for (var i = snake.length - 1; i > 0; i--) {
        snakeposx[i] = snakeposx[i - 1];
        snakeposy[i] = snakeposy[i - 1];
    }
    snakeprevx = snakeposx[0];
    snakeprevy = snakeposy[0];
    snakeposx[0] += snake.vx;
    snakeposy[0] += snake.vy;

    checksnake();

    checkwall();

    if (level == 2) {
        checklevel2stuff();
    }

    checkcandy();

    if (supercandy.presence == 1)
        checksupercandy();
}

function checksnake() {
    if (snake.vx != 0 || snake.vy != 0) {
        for (var i = 1; i < snake.length; i++) {
            if (snakeposx[0] == snakeposx[i] && snakeposy[0] == snakeposy[i]) {
                gamestate = "<br>GAMEOVER";
                document.body.removeEventListener("keydown", check, false);
            }
        }
    }
}

function checkwall() {
    if (snakeposx[0] >= container.right) {
        if (level == 2) {
            gamestate = "<br>GAMEOVER";
            document.body.removeEventListener("keydown", check, false);
        }
        snakeposx[0] = container.left;
    }
    else if (snakeposx[0] <= container.left) {
        if (level == 2) {
            gamestate = "<br>GAMEOVER";
            document.body.removeEventListener("keydown", check, false);
        }
        snakeposx[0] = container.right;
    }
    else if (snakeposy[0] >= container.bottom) {
        if (level == 2) {
            gamestate = "<br>GAMEOVER";
            document.body.removeEventListener("keydown", check, false);
        }
        snakeposy[0] = container.top;
    }
    else if (snakeposy[0] <= container.top) {
        if (level == 2) {
            gamestate = "<br>GAMEOVER";
            document.body.removeEventListener("keydown", check, false);
        }
        snakeposy[0] = container.bottom;
    }
}

function check(e) {
    if (e.keyCode == "87" && snake.vy <= 0) {
        snake.vx = 0;
        snake.vy = -snakevel;
    }
    else if (e.keyCode == "65" && snake.vx <= 0) {
        snake.vx = -snakevel;
        snake.vy = 0;
    }
    else if (e.keyCode == "83" && snake.vy >= 0) {
        snake.vx = 0;
        snake.vy = snakevel;
    }
    else if (e.keyCode == "68" && snake.vx >= 0) {
        snake.vx = snakevel;
        snake.vy = 0;
    }
}

function drawlevel2stuff() {    
    ctx.beginPath();
    ctx.moveTo(200, 250);   // left line
    ctx.lineTo(200, 350);    
    ctx.moveTo(250, 200);   // top line
    ctx.lineTo(350, 200);  
    ctx.moveTo(400, 250);   // right line
    ctx.lineTo(400, 350);    
    ctx.moveTo(250, 400);   // bottom line
    ctx.lineTo(350, 400);
    ctx.moveTo(100, 100);   // left boundary
    ctx.lineTo(100, 500);
    ctx.moveTo(100, 100);   // top boundary
    ctx.lineTo(500, 100);
    ctx.moveTo(500, 100);   // right boundary
    ctx.lineTo(500, 500);
    ctx.moveTo(100, 500);   // bottom boundary
    ctx.lineTo(500, 500);
    ctx.lineWidth = "3";
    ctx.lineCap = "round";
    ctx.strokeStyle = "red";
    ctx.stroke();
}

function checklevel2stuff() {
    if (snakeprevx <= 200 && snakeposx[0] >= 200 && Math.abs(snakeposx[0] - snakeprevx) < 5 && snakeposy[0] >= 250 && snakeposy[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
    else if (snakeprevx >= 200 && snakeposx[0] <= 200 && Math.abs(snakeposx[0] - snakeprevx) < 5 && snakeposy[0] >= 250 && snakeposy[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
    if (snakeprevx <= 400 && snakeposx[0] >= 400 && Math.abs(snakeposx[0] - snakeprevx) < 5 && snakeposy[0] >= 250 && snakeposy[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
    else if (snakeprevx >= 400 && snakeposx[0] <= 400 && Math.abs(snakeposx[0] - snakeprevx) < 5 && snakeposy[0] >= 250 && snakeposy[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
    if (snakeprevy <= 200 && snakeposy[0] >= 200 && Math.abs(snakeposy[0] - snakeprevy) < 5 && snakeposx[0] >= 250 && snakeposx[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
    else if (snakeprevy >= 200 && snakeposy[0] <= 200 && Math.abs(snakeposy[0] - snakeprevy) < 5 && snakeposx[0] >= 250 && snakeposx[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
    if (snakeprevy <= 400 && snakeposy[0] >= 400 && Math.abs(snakeposy[0] - snakeprevy) < 5 && snakeposx[0] >= 250 && snakeposx[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
    else if (snakeprevy >= 400 && snakeposy[0] <= 400 && Math.abs(snakeposy[0] - snakeprevy) < 5 && snakeposx[0] >= 250 && snakeposx[0] <= 350) {
        gamestate = "<br>GAMEOVER";
        document.body.removeEventListener("keydown", check, false);
    }
}
