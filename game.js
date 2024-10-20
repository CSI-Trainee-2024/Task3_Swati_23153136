const canvas=document.querySelector('canvas');
const a=canvas.getContext('2d');

canvas.width=innerWidth;
canvas.height=innerHeight;

class Player{
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
}

const player=new Player();
player.draw();

function animate(){
    requestAnimationFrame(animate);
    a.fillStyle='black';
    a.fillRect(0 , 0, canvas.width, canvas.height);
    player.draw();

}
animate();