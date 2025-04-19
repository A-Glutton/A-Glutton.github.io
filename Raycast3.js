//Credits to Lode Vandevenne    https://lodev.org/cgtutor/raycasting.html


const canvas = document.getElementById('canvas1');
const FPS = document.getElementById('FPS');
const ctx = canvas.getContext('2d');
console.log(ctx);
canvas.width = window.innerWidth;//1000;//(worldMap.length+1) * 15;
canvas.height = window.innerHeight;//(worldMap[0].length+1) * 15;
CANVAS_WIDTH = canvas.width;
CANVAS_HEIGHT = canvas.height;
window.addEventListener('load',function(){
let texHeight = 64;
let texWidth = 64;
let images = [];

for (let i = 1; i < 8; i++) {
    images[i] = new Image();
    
    images[i].onload = function() {
        images[i].texWidth = images[i].width;
        images[i].texHeight = images[i].height;
        console.log(`Image ${i} loaded:`, images[i].texWidth, images[i].texHeight);
    };
    images[i].src = `Images/Texture0${i}.png`;
};
    


    let vertLineArr = [];
for(let i=0; i<CANVAS_WIDTH; i++)
{
    vertLineArr.push({"start":undefined,"end":undefined,"imgIndex":undefined,"texX":undefined});
}
console.log (vertLineArr);

let worldMap =
[
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7,7,7,7,7,7,7,7],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,7],
    [4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7],
    [4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7],
    [4,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,7],
    [4,0,4,0,0,0,0,5,5,5,5,5,5,5,5,5,7,7,0,7,7,7,7,7],
    [4,0,5,0,0,0,0,5,0,5,0,5,0,5,0,5,7,0,0,0,7,7,7,1],
    [4,0,6,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,8],
    [4,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,1],
    [4,0,8,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,8],
    [4,0,0,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,7,7,7,1],
    [4,0,0,0,0,0,0,5,5,5,5,0,5,5,5,5,7,7,7,7,7,7,7,1],
    [6,6,6,6,6,6,6,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,6],
    [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [6,6,6,6,6,6,0,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,6],
    [4,4,4,4,4,4,0,4,4,4,6,0,6,2,2,2,2,2,2,2,3,3,3,3],
    [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,0,0,0,2],
    [4,0,0,0,0,0,0,0,0,0,0,0,6,2,0,0,5,0,0,2,0,0,0,2],
    [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,2,0,2,2],
    [4,0,6,0,6,0,0,0,0,4,6,0,0,0,0,0,5,0,0,0,0,0,0,2],
    [4,0,0,5,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,2,0,2,2],
    [4,0,6,0,6,0,0,0,0,4,6,0,6,2,0,0,5,0,0,2,0,0,0,2],
    [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,0,0,0,2],
    [4,4,4,4,4,4,4,4,4,4,1,1,1,2,2,2,2,2,2,3,3,3,3,3]
    ];


///start


///end

let time = 0;
let oldtime = 0;
let dT ; //deltatime to calc move speed;


class InputHandler {
    constructor(){
        this.keys = [];
        window.addEventListener('keydown',e=>
        {
            if( 
                (
                e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'
                )
                && this.keys.indexOf(e.key)===-1)
            {this.keys.push(e.key);}
            console.log(e.key,this.keys);
        });

        window.addEventListener('keyup',e=>
            {
                if( 
                    e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight'
                )
                {this.keys.splice(this.keys.indexOf(e.key),1);}
                console.log(e.key,this.keys);
            });

    }
}
class Joystick {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 100;
        this.bound_width = 300;

        this.visibility = false;
        this.startx = 0; 
        this.starty = 0;
        this.x = 0;
        this.y = 0;

        // Event Listeners
        window.addEventListener("mousemove", (e) => {
            this.x = e.clientX;
            this.y = e.clientY;

        });

        window.addEventListener("mousedown", (e) => {
            this.visibility = true;
            this.startx = e.clientX;
            this.starty = e.clientY;
        });

        window.addEventListener("mouseup", () => {
            this.visibility = false;
        });
    }

    
    // Boundary function moved outside of the constructor
    boundary() {
        let xvec = this.x - this.startx;
        let yvec = this.y - this.starty;
        let wvec = Math.sqrt(xvec ** 2 + yvec ** 2);

        if (this.bound_width < wvec) {
            this.x = this.startx + (this.bound_width/wvec) * xvec;
            this.y = this.starty + (this.bound_width/wvec) * yvec;
        }
    }
    
    // Draw the joystick to the canvas
    draw(context) {
        if (this.visibility) {
            this.boundary();

            // Draw the joystick
            context.beginPath();
            context.arc(this.x, this.y, this.width, 0, Math.PI * 2);
            context.fillStyle = "rgba(0, 0, 255, 0.5)";
            context.fill();
            context.stroke();

            // Joystick outer circle boundary
            context.beginPath();
            context.arc(this.startx, this.starty, this.bound_width, 0, Math.PI * 2);
            context.fillStyle = "rgba(100, 100, 100, 0.5)";
            context.fill();
            context.stroke();
        }
    }

    // Update function can be extended if necessary
    update() {
        // Logic to update joystick if needed
    }
}

class FOV{
    constructor(){
        this.posX = 22;
        this.posY = 12;  //x and y start position
        this.dirX = -1;
        this.dirY = 0; //initial direction vector
        this.planeX = 0;
        this.planeY = 0.66; //the 2d raycaster version of camera plane
    }

    DDA(x){
        let perpWallDist;
        //calculate ray position and direction
        let cameraX = 2 * x /CANVAS_WIDTH - 1; //x-coordinate in camera space
        let rayDirX = this.dirX + this.planeX * cameraX;
        let rayDirY = this.dirY + this.planeY * cameraX;
        //which box of the map we're in
        let mapX = Math.floor(this.posX);
        let mapY = Math.floor(this.posY);
  
        //length of ray from current position to next x or y-side
        let sideDistX;
        let sideDistY;
        let deltaDistX =Math.abs(1 / rayDirX);
        let deltaDistY =Math.abs(1 / rayDirY);

        let stepX;
        let stepY;
  
        let hit = 0; //was there a wall hit?
        let side;


        if(rayDirX < 0)
          {
            stepX = -1;
            sideDistX = (this.posX - mapX) * deltaDistX;
          }
          else
          {
            stepX = 1;
            sideDistX = (mapX + 1.0 - this.posX) * deltaDistX;
          }
          if(rayDirY < 0)
          {
            stepY = -1;
            sideDistY = (this.posY - mapY) * deltaDistY;
          }
          else
          {
            stepY = 1;
            sideDistY = (mapY + 1.0 - this.posY) * deltaDistY;
          }
          //perform DDA
          while(hit == 0)
          {
            //jump to next map square, either in x-direction, or in y-direction
            if(sideDistX < sideDistY)
            {
              sideDistX += deltaDistX;
              mapX += stepX;
              side = 0;
            }
            else
            {
              sideDistY += deltaDistY;
              mapY += stepY;
              side = 1;
            }
            //Check if ray has hit a wall
            //console.log("mapX: "+mapX+"  mapY: "+ mapY);
            if((worldMap[mapX][mapY]) > 0){ 

              hit = 1;}
          }

          if(side == 0) perpWallDist = (sideDistX - deltaDistX);
          else          perpWallDist = (sideDistY - deltaDistY);
    
          //Calculate height of line to draw on screen

          
        return {
          rayDirY:rayDirY,
          rayDirX:rayDirX,
          perpWallDist : perpWallDist,
          mapX: mapX,
          mapY: mapY,
          side: side
        };
 //Return line height

    }

    updateVertline(verticalLine,DDA){ // verticalLine = vertLineArr[i]

        let lineHeight = CANVAS_HEIGHT / DDA.perpWallDist;

        //calculate lowest and highest pixel to fill in current stripe
        verticalLine.start = -lineHeight / 2 + CANVAS_HEIGHT / 2;
      //  if(verticalLine.start < 0) verticalLine.start = 0;
        verticalLine.end = lineHeight / 2 + CANVAS_HEIGHT / 2;
       // if(verticalLine.end >= CANVAS_HEIGHT) verticalLine.end = CANVAS_HEIGHT - 1;

        verticalLine.imgIndex = worldMap[DDA.mapX][DDA.mapY];
        //let texWidth = images[verticalLine.imgIndex].texWidth; //texWidth of Particular img
        let wallX;


        if (DDA.side  == 0) wallX = this.posY +DDA.perpWallDist * DDA.rayDirY;
        else                wallX = this.posX +DDA.perpWallDist * DDA.rayDirX;
        wallX = wallX - Math.floor(wallX);

         //x coordinate on the texture
        verticalLine.texX=Math.floor(wallX * texWidth);
        if(DDA.side ==0 && DDA.rayDirX > 0) verticalLine.texX = texWidth - verticalLine.texX - 1;
        if(DDA.side ==1 && DDA.rayDirY < 0) verticalLine.texX = texWidth - verticalLine.texX - 1;
        
        
    }
    draw(context,vertLineArr){

        for(let i=0;i<canvas.width;i++){       
            
           //Drawing of lines begins here
           /*
            context.beginPath();
            context.lineWidth = 1;
            context.moveTo( i,vertLineArr[i].start);
            context.lineTo(i,vertLineArr[i].end);
            context.strokeStyle = vertLineArr[i].color;
            context.stroke();
            */
            this.drawVertLine(context,vertLineArr[i],i);
        };
    }
    drawVertLine(context,vertLineArr,x){

        let image = images[vertLineArr.imgIndex];
        let sx = vertLineArr.texX;
        let sy = 0;
        let sWidth = 1;//images[vertLineArr.imgIndex].texWidth;
        let sHeight = texHeight;//images[vertLineArr.imgIndex].texHeight;
        let dx = x;
        let dy = vertLineArr.start;
        let dWidth = 1;
        let dHeight = vertLineArr.end-vertLineArr.start;

        context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    update(input){

let moveSpeed = dT * 7; //the constant value is in squares/second
let rotSpeed = dT * 2; //the constant value is in radians/second

        if (input.keys.indexOf('ArrowUp') > -1)
        {


            if (!(worldMap[Math.floor(this.posX + this.dirX * moveSpeed)][Math.floor(this.posY)])) 
                {   

                    this.posX += this.dirX * moveSpeed;

                };
            if (!(worldMap[Math.floor(this.posX)][Math.floor(this.posY + this.dirY * moveSpeed)])) {this.posY += this.dirY * moveSpeed;};

        };  
            
        if (input.keys.indexOf('ArrowDown') > -1)
            {
                if (!worldMap[Math.floor(this.posX - this.dirX * moveSpeed)][Math.floor(this.posY)]) {
                    
                    
                    this.posX -= this.dirX * moveSpeed;

                };
                if (!worldMap[Math.floor(this.posX)][Math.floor(this.posY - this.dirY * moveSpeed)]) {

                    this.posY -= this.dirY * moveSpeed;

                };
        };
        if (input.keys.indexOf('ArrowRight') > -1)
            {
                let oldDirX = this.dirX;
                this.dirX = this.dirX * Math.cos(-rotSpeed) - this.dirY * Math.sin(-rotSpeed);
                this.dirY = oldDirX * Math.sin(-rotSpeed) + this.dirY * Math.cos(-rotSpeed);
                let oldPlaneX = this.planeX;
                this.planeX = this.planeX * Math.cos(-rotSpeed) - this.planeY * Math.sin(-rotSpeed);
                this.planeY = oldPlaneX * Math.sin(-rotSpeed) + this.planeY * Math.cos(-rotSpeed);
        };
        if (input.keys.indexOf('ArrowLeft') > -1)
            {
                let oldDirX = this.dirX;
                this.dirX = this.dirX * Math.cos(rotSpeed) - this.dirY * Math.sin(rotSpeed);
                this.dirY = oldDirX * Math.sin(rotSpeed) + this.dirY * Math.cos(rotSpeed);
                let oldPlaneX = this.planeX;
                this.planeX = this.planeX * Math.cos(rotSpeed) - this.planeY * Math.sin(rotSpeed);
                this.planeY = oldPlaneX * Math.sin(rotSpeed) + this.planeY * Math.cos(rotSpeed);
        };

        for(let x = 0; x < CANVAS_WIDTH; x++)
            {

                this.updateVertline(vertLineArr[x],this.DDA(x));

            };

    }

}



const input = new InputHandler();
//const player = new Player(CANVAS_WIDTH,CANVAS_HEIGHT);
const field_of_view = new FOV();
const joystick = new Joystick();

function animate(){
    time = Date.now();
    dT = (time-oldtime)/1000;
    
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);   

    /*
    player.draw(ctx);
    player.MoveForth();
*/  
    field_of_view.update(input);

  //  console.log(vertLineArr);

    field_of_view.draw(ctx,vertLineArr);
 

    joystick.draw(ctx);

    requestAnimationFrame(animate);
   // console.log(images[1].texWidth,images[2].texWidth,images[3].texWidth,images[4].texWidth,images[5].texWidth,images[6].texWidth,images[7].texWidth,images[8].texWidth);
    // images have not loaded to get .Width and .Height
    oldtime = time;
   // FPS.innerHTML=`FPS: ${(1 / dT).toFixed(2)} Dir: ${(field_of_view.dirX).toFixed(0)},${(field_of_view.dirY).toFixed(0)} Pos:${(field_of_view.posX).toFixed(0)},${(field_of_view.posY).toFixed(0)}`;
}

animate();

});



