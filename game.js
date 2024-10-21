const canvas=document.querySelector('canvas');
const a=canvas.getContext('2d');

canvas.width=innerWidth;
canvas.height=innerHeight;

class Ship{
    constructor() {
        this.velocity={
            x: 0,
            y: 0
        }
        const image=new Image();
        image.src="shipnew.png";
        image.onload=()=>{
        const scale=0.35;
        this.image=image;
        this.width=image.width*scale;
        this.height=image.height*scale;
        this.position={
            x: canvas.width/2 - this.width/2,
            y: canvas.height- this.height-20
        }
    }
}
    draw(){
        if(this.image && this.width && this.height)
        a.drawImage(this.image ,this.position.x ,this.position.y, this.width, this.height);
    }
    update(){
        if(this.image && this.width && this.height)
        this.position.x +=this.velocity.x;
        this.draw();
        
        
    }
}

class Projetile{
    constructor({position, velocity}){
        this.position=position;
        this.velocity = velocity;

        this.radius = 3;

    }
    draw() {
        a.beginPath();
        a.arc(this.position.x, this.position.y ,this.radius ,0 ,Math.PI*2);
        a.fillStyle='red';
        a.fill();
        a.closePath();
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
class Invader{
    constructor({position}) {
        this.velocity={
            x: 0,
            y: 0
        }
        const image=new Image();
        image.src="invader.png";
        image.onload=()=>{
        const scale=0.10;
        this.image=image;
        this.width=image.width*scale;
        this.height=image.height*scale;
        this.position={
            x: position.x,
            y: position.y
        }
    }
}
    draw(){
        if(this.image && this.width && this.height)
        a.drawImage(this.image ,this.position.x ,this.position.y, this.width, this.height);
    }
    update({velocity}){
        if(this.image && this.width && this.height){
        this.position.x +=velocity.x;
        this.position.y +=velocity.y;
        this.draw();}
        
        
    }
}

class Grid{
    constructor(){
        this.position= {
            x: 0 ,
            y: 0
        },
        this.velocity= {
            x: 5,
            y: 0
        },
        this.invaders=[]

        const rows =Math.floor(Math.random()*5 + 2);
        const columns=Math.floor(Math.random()*7 +5);
        const imagewidth=41; 

        this.width=columns*imagewidth

        for(let i=0 ; i<columns ;i++){
            for(let j=0; j<rows ; j++){
            this.invaders.push(new Invader({position: {
                x : i*imagewidth,
                y: j*imagewidth
            }}));
        }}
    }
    update(){
        this.position.x += this.velocity.x;
        this.position.y +=this.velocity.y;

        this.velocity.y=0;

        if (this.position.x + this.width >= canvas.width || this.position.x <=0){
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 41;
    
        } 
    }
}

const player=new Ship();
const projectiles=[];
const grids=[];
const keys={
    a: {
        pressed:false
    },
    d: {
        pressed:false
    },
    space: {
        pressed:false
    }

}

let frames =0;
let ranInterval=Math.floor((Math.random() * 500) +500);

function animate(){
    requestAnimationFrame(animate);
    a.fillStyle='black';
    a.fillRect(0 , 0, canvas.width, canvas.height);
    player.draw();
    if (keys.a.pressed && player.position.x >=0){
        player.velocity.x = -5;
    }
    else if(keys.d.pressed && player.position.x +player.width <canvas.width){
        player.velocity.x=5;
    }
    else{
        player.velocity.x=0;
    }
    player.update();
    projectiles.forEach((projectile , index) =>{
    if(projectile.position.y + projectile.radius <=0){
        setTimeout(()=>{
        projectiles.splice(index ,1)},0);
    }else{
        projectile.update();}
    } )
    grids.forEach(grid => {
        grid.update();
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height) {
                    setTimeout(() => {
                        grid.invaders.splice(i, 1);
                        projectiles.splice(j, 1);
                    }, 0);
                }
            });
        });
    });

    console.log(grids);
    if (frames % ranInterval==0){
        grids.push(new Grid());
        ranInterval=Math.floor((Math.random() * 500) +500);
        frames=0;
        
    }
    frames++;
    
}
animate();

window.addEventListener("keydown",(event)=>{
    switch(event.key){
        case 'a':
            console.log('left');
            keys.a.pressed=true;
            break;
        case 'd':
            console.log('right');
            player.velocity.x =5;
            keys.d.pressed=true;
            break;
        case 's':
            console.log('down');
            break;
        case 'w':
            console.log('up');
            break;
        case ' ':
            projectiles.push(new Projetile({
                position: {
                    x :player.position.x + player.width / 2,
                    y :player.position.y
                },
                velocity : {
                    x: 0,
                    y: -10
                }
            }))
            break;
    }
});
window.addEventListener("keyup",(event)=>{
    switch(event.key){
        case 'a':
            console.log('left');
            keys.a.pressed=false;
            break;
        case 'd':
            console.log('right');
            player.velocity.x =5;
            keys.d.pressed=false;
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
})