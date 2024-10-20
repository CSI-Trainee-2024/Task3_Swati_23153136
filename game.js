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

const player=new Ship();
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
            console.log('space');
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
            console.log('space');
            break;
    }
})