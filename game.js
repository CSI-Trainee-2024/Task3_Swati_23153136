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
        this.opacity=1;
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
        a.save();
        a.globalAlpha=this.opacity
        if (this.image && this.width && this.height)
            a.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        a.restore()
    }
    update() {
        if (this.image && this.width && this.height)
            this.position.x += this.velocity.x;
        this.draw();
    }
}

class Projectile {
    constructor({ position, velocity }) {
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

class Particle {
    constructor({ position, velocity, radius, color }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1; 
    }
    draw() {
        a.save();
        a.globalAlpha = this.opacity; 
        a.beginPath();
        a.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        a.fillStyle = this.color;
        a.fill();
        a.closePath();
        a.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.opacity -= 0.01;
    }
}

class InvaderProjectile {
    constructor({ position, velocity }) {
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
    constructor({ position }) {
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
    update({ velocity }) {
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
        };
        this.velocity = {
            x: 5,
            y: 0
        };
        this.invaders = [];

        const rows = Math.floor(Math.random() * 5 + 2);
        const columns = Math.floor(Math.random() * 7 + 5);
        const imageWidth = 41;

        this.width = columns * imageWidth;

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.invaders.push(new Invader({
                    position: {
                        x: i * imageWidth,
                        y: j * imageWidth
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
const invaderProjectiles = [];
const particles = [];
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
};

let frames = 0;
let ranInterval = Math.floor((Math.random() * 500) + 500);
let game ={
    over: false,
    active:true
}
function createParticles({ object, color }) {
    for (let k = 0; k < 15; k++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            },
            radius: Math.random() * 3,
            color: color || '#BAA0DE'
        }));
    }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate);
    a.fillStyle = 'black';
    a.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        } else {
            particle.update();
        }
    });
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            invaderProjectiles.splice(index, 1);
        } else {
            invaderProjectile.update();
            if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
                invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
                invaderProjectile.position.x <= player.position.x + player.width) {
                invaderProjectiles.splice(index, 1);
                player.opacity=0;
                game.over=true;
                console.log("You lose");
                setTimeout(() =>{
                    game.active=false;
                },2000);
                createParticles({
                    object: player,
                    color: 'white'
                });
            }
        }
    });

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -8;
    } else if (keys.d.pressed && player.position.x + player.width < canvas.width) {
        player.velocity.x = 8;
    } else {
        player.velocity.x = 0;
    }

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
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });

            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                ) {
                    const invaderFound = grid.invaders.find(invader2 => invader2 === invader);
                    const projectileFound = projectiles.find(projectile2 => projectile2 === projectile);

                    if (invaderFound && projectileFound) {
                        createParticles({
                            object: invader
                        });

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

    if (frames % ranInterval == 0) {
        grids.push(new Grid());
        ranInterval = Math.floor((Math.random() * 500) + 500);
        frames = 0;
    }

    frames++;
}

animate();

window.addEventListener("keydown", (event) => {
    if (game.over) return
    switch (event.key) {
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
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
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});
