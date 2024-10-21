const canvas = document.querySelector('canvas');
const a = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Ship {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };
        const image = new Image();
        image.src = "shipnew.png";
        image.onload = () => {
            const scale = 0.35;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };
    }
    draw() {
        if (this.image && this.width && this.height)
            a.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        if (this.image && this.width && this.height)
            this.position.x += this.velocity.x;
        this.draw();
    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 4;
    }
    draw() {
        a.beginPath();
        a.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        a.fillStyle = 'red';
        a.fill();
        a.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class InvaderProjectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;
    }
    draw() {
        a.fillStyle = 'white';
        a.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.position.y += this.velocity.y;
    }
}

class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        };
        const image = new Image();
        image.src = "invader.png";
        image.onload = () => {
            const scale = 0.10;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            };
        };
    }
    draw() {
        if (this.image && this.width && this.height)
            a.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update({velocity}) {
        if (this.image && this.width && this.height) {
            this.position.x += velocity.x;
            this.position.y += velocity.y;
            this.draw();
        }
    }
    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }));
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        },
        this.velocity = {
            x: 5,
            y: 0
        },
        this.invaders = [];

        const rows = Math.floor(Math.random() * 5 + 2);
        const columns = Math.floor(Math.random() * 7 + 5);
        const imagewidth = 41;

        this.width = columns * imagewidth;

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.invaders.push(new Invader({
                    position: {
                        x: i * imagewidth,
                        y: j * imagewidth
                    }
                }));
            }
        }
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 41;
        }
    }
}

const player = new Ship();
const projectiles = [];
const grids = [];
const InvaderProjectiles = [];
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0;
let ranInterval = Math.floor((Math.random() * 500) + 500);

function animate() {
    requestAnimationFrame(animate);
    a.fillStyle = 'black';
    a.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    InvaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            InvaderProjectiles.splice(index, 1);
        } else {
            invaderProjectile.update();
        }
    });
    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -8;
    } else if (keys.d.pressed && player.position.x + player.width < canvas.width) {
        player.velocity.x = 8;
    } else {
        player.velocity.x = 0;
    }
    player.update();
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            projectiles.splice(index, 1);
        } else {
            projectile.update();
        }
    });
    grids.forEach((grid, gridIndex) => {
        grid.update();

        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(InvaderProjectiles);
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y) {
                    const invaderFound = grid.invaders.find(invader2 => invader2 === invader);
                    const projectileFound = projectiles.find(projectile2 => projectile2 === projectile);

                    if (invaderFound && projectileFound) {
                        grid.invaders.splice(i, 1);
                        projectiles.splice(j, 1);

                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0];
                            const lastInvader = grid.invaders[grid.invaders.length - 1];

                            grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                            grid.position.x = firstInvader.position.x;
                        } else {
                            grids.splice(gridIndex, 1);
                        }
                    }
                }
            });
        });
    });

    console.log(grids);
    if (frames % ranInterval == 0) {
        grids.push(new Grid());
        ranInterval = Math.floor((Math.random() * 500) + 500);
        frames = 0;
    }

    frames++;
}
animate();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'a':
            console.log('left');
            keys.a.pressed = true;
            break;
        case 'd':
            console.log('right');
            keys.d.pressed = true;
            break;
        case 's':
            console.log('down');
            break;
        case 'w':
            console.log('up');
            break;
        case ' ':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }));
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case 'a':
            console.log('left');
            keys.a.pressed = false;
            break;
        case 'd':
            console.log('right');
            player.velocity.x = 0;
            keys.d.pressed = false;
            break;
        case 's':
            console.log('down');
            break;
        case 'w':
            console.log('up');
            break;
        case ' ':
            //console.log('space');
            break;
    }
});
