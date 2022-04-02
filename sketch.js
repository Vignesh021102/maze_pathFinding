var grid;
var mover;
var endPoints = [];
function setup() {
  let res = 10;
  let r = Math.floor(innerHeight/res)
  let c = Math.floor(innerWidth/res)
  let algorithm = 1;
 createCanvas(innerWidth,innerHeight);
  grid = new Grid(res*c,res*r,res)
  grid.initArr()
  grid.init()
  let arr = [];
  for(let i =0;i<grid.arr.length;i++){
    arr.push([])
    for(let j=0;j<grid.arr[i].length;j++){
      arr[i].push([...grid.arr[i][j].slice(0,4),false])
    }
  }
  mover = new Mover(arr,res,0,0,algorithm)
  for(let i =0;i<1;i++){
    endPoints.push(new EndPoint(Math.floor(random(0,r)),Math.floor(random(0,c)),res))
  }
  console.log(endPoints,);
  document.body.addEventListener("keydown",(event)=>{
    if(event.key == " "){
      mover.move(-1)
    }
    if(event.key == "ArrowUp"){
      mover.move(0)
    }
    if(event.key == "ArrowRight"){
      mover.move(1)
    }
    if(event.key == "ArrowDown"){
      mover.move(2)
    }
    if(event.key == "ArrowLeft"){
      mover.move(3)
    }
  })
}

function draw() {
  background(0);
  grid.draw()
  mover.findPath()
  mover.draw()
  for(let i of endPoints){
    i.draw()
  }
}


class Grid{
  constructor(width,height,res){
    this.width = width;
    this.height = height;
    this.row = Math.floor(height/res);
    this.col = Math.floor(width/res);
    this.res = res
    this.arr = [];
    this.pos = [0,0]
    this.stack = []
  }
  initArr(){
    let num = 1;
    for(let i = 0;i<this.height;i+= this.res){
      this.arr.push([])
      for(let j =0;j<this.width;j+= this.res){
        this.arr[Math.floor(i/this.res)].push([0,0,0,0,false])
        num++;
      }
    }
    this.row = this.arr.length;
    this.col = this.arr[0].length
    console.log(this.row,this.col);
    
  }
  isFinished(){
    for(let i =0;i<this.arr.length;i++){
      for(let j=0;j<this.arr[i].length;j++){
        if(this.arr[i][j][4] == false){
          return false;
        }
      }
    }
    return true;
  }
  findBYID(ID){
  
    return [ID[0],ID[1]]
  }
  move(){
    let avail = [];
    let j =0;  
    for(let i = -1;i<2;i++){
        if(i == 0)continue;
          if(!(this.pos[0]+i <0||this.pos[1]+j<0||this.pos[0]+i>=this.row||this.pos[1]+j>=this.col) && !this.arr[this.pos[0]+i][this.pos[1]+j][4]){
            avail.push([this.pos[0]+i,this.pos[1]+j])
          }
      }
      let i =0;
    for(let j = -1;j<2;j++){
      if(j == 0)continue;
        if(!(this.pos[0]+i <0||this.pos[1]+j<0||this.pos[0]+i>=this.row||this.pos[1]+j>=this.col) && !this.arr[this.pos[0]+i][this.pos[1]+j][4]){
          avail.push([this.pos[0]+i,this.pos[1]+j])
        }
    }
    if(avail.length == 0) return false;
    let next = avail[Math.floor(random(0,avail.length))]

    this.connect(this.pos,next);
    return this.pos = next;
  }
  connect(p1,p2){
    //console.log(p1,p2,p1[0]< p2[0],p1[0] > p2[0]);
    if(p1[0]< p2[0]){
      this.arr[p1[0]][p1[1]][2] = 1
      this.arr[p2[0]][p2[1]][0] = 1
    }
    if(p1[1]>p2[1]){
      //right
      this.arr[p1[0]][p1[1]][3] = 1
      this.arr[p2[0]][p2[1]][1] = 1
    }
    if(p1[0] > p2[0]){
      //moved bottom
      this.arr[p1[0]][p1[1]][0] = 1
      this.arr[p2[0]][p2[1]][2] = 1
    }
    if(p1[1]<p2[1]){
      //left
      this.arr[p1[0]][p1[1]][1] = 1
      this.arr[p2[0]][p2[1]][3] = 1
    }

  }
  checkNei(){
    let avail = [];
    let j =0;  
    for(let i = -1;i<2;i++){
        if(i == 0)continue;
          if(!(this.pos[0]+i <0||this.pos[1]+j<0||this.pos[0]+i>=this.row||this.pos[1]+j>=this.col) && !this.arr[this.pos[0]+i][this.pos[1]+j][4]){
            avail.push(this.arr[this.pos[0]+i][this.pos[1]+j][4])
          }
      }
      let i =0;
    for(let j = -1;j<2;j++){
      if(j == 0)continue;
        if(!(this.pos[0]+i <0||this.pos[1]+j<0||this.pos[0]+i>=this.row||this.pos[1]+j>=this.col) && !this.arr[this.pos[0]+i][this.pos[1]+j][4]){
          avail.push(this.arr[this.pos[0]+i][this.pos[1]+j][4])
        }
    }
    if(avail.length >0) return true;
    return false;
  }
  init(){
        do{
          this.arr[this.pos[0]][this.pos[1]][4] = true;
          if(this.checkNei()){
            this.stack.push([this.pos[0],this.pos[1]])
            this.move()
          }else{
            if(this.stack.length<=0) return;
            this.pos = this.stack.pop()
          }
        }while(!(this.stack.length == 0&&this.pos[0] == 0 &&this.pos[1] == 0))
  }
  draw(){
    let r = this.res;
    push()
    for(let i = 0;i<this.arr.length;i++){
      for(let j =0;j<this.arr[i].length;j++){
        stroke(255)
        //console.log(this.arr[i][j]);
        if(!this.arr[i][j][0]){
        //top
        line(j*r,i*r,(j*r)+r,i*r)
        }
        if(!this.arr[i][j][1]){
          //right
          line((j*r)+r,i*r,(j*r)+r,(i*r)+r)
        }
        if(!this.arr[i][j][2]){
          //bottom
          line(j*r,(i*r)+r,(j*r)+r,(i*r)+r)
        }
        if(!this.arr[i][j][3]){
          //left
          line(j*r,i*r,j*r,(i*r)+r)
        }
        if(!this.arr[i][j][4]){
          fill(255)
          rect(j*r,i*r,r,r)
        }
      }
    }
    pop()
  }
}

class Mover{
  constructor(grid,res,posI,posJ,algorithmNum){
    this.arr = grid;
    this.res = res;
    this.pos = [posI,posJ];
    this.stack= [[posI,posJ]];
    this.algorithm = algorithmNum
  }
  move(num){
    this.checkEndPopints(this.pos)
    this.arr[this.pos[0]][this.pos[1]][4] = true;
    if(num == -1){
      this.pos = this.stack.pop();
    }else{
      if(this.arr[this.pos[0]][this.pos[1]][num]){
        if(this.stack.length >0){
          if(!(this.pos[0] == this.stack[this.stack.length-1][0] && this.pos[1] == this.stack[this.stack.length-1][1])) this.stack.push([...this.pos])
        }else{
          this.stack.push([...this.pos])
        }
        
        switch(num){
          case 0:
            if(this.pos[0] <= 0) break;
            this.pos[0]--;
          break;
          case 1:
            if(this.pos[1] >= this.arr[0].length) break;
            this.pos[1]++;
          break;
          case 2:
            if(this.pos[0] >= this.arr.length) break;
            this.pos[0]++;
          break;
          case 3:
            if(this.pos[1] <= 0) break;
            this.pos[1]--;
          break;
        }
        if(this.stack.length>1){
          if((this.pos[0] == this.stack[this.stack.length-2][0] && this.pos[1] == this.stack[this.stack.length-2][1])||(this.pos[0] == this.stack[this.stack.length-1][0] && this.pos[1] == this.stack[this.stack.length-1][1])){
            this.stack.pop()
          }else{
            this.stack.push([...this.pos])
          }
        }else{
          this.stack.push([...this.pos])
        }
      }
    }
    
  }
  checkEndPopints(pos){
    let isEP = false,i,j
    for(i in endPoints){
      if(endPoints[i].i == pos[0] && endPoints[i].j == pos[1]){
        endPoints.splice(i,1)
      }
    }
    //console.log(endPoints);
    if(endPoints.length == 0){
      for(i of this.arr){
        for(j of i){
          j[4] = false;
        }
      }
      this.stack = [];
      endPoints.push(new EndPoint(Math.floor(random(0,this.arr.length)),Math.floor(random(0,this.arr[0].length)),this.res));
      if(this.algorithm == 2){
        this.pos = [pos]
      }
    }
  }
  draw(){
    let i,j;
    if(this.algorithm == 1){
      push()
      beginShape()
      stroke(255,0,0)
      strokeWeight(3)
      noFill()
      for(i of this.stack){
        vertex((i[1]*this.res)+this.res/2,(i[0]*this.res)+this.res/2)
      }
      endShape()
      pop()
      push()
      noStroke()
      fill(200)
      circle((this.pos[1]*this.res)+this.res/2,(this.pos[0]*this.res)+this.res/2,this.res*0.8)
      pop() 
    }else if(this.algorithm==2){
      for(i of this.pos){
        push()
        noStroke()
        fill(200)
        circle((i[1]*this.res)+this.res/2,(i[0]*this.res)+this.res/2,this.res*0.8)
        pop() 
      }
    }
    push()
    for(i = 0;i<this.arr.length;i++){
      for(j =0;j<this.arr[i].length;j++){
        noStroke()
        if(this.arr[i][j][4]){
          fill(2550,0,0,50)
          rect(j*this.res,i*this.res,this.res,this.res)
        }
      }
    }
    pop()
  }
  findPath(){
    let pos = [...this.pos];
    let arr = [];
    switch(this.algorithm){
      case 1:
      for(let i =0;i<4;i++){
        pos = [...this.pos];
        if(!this.arr[pos[0]][pos[1]][i]) continue;
        switch(i){
          case 0:
            if(pos[0] <= 0) break;
            pos[0]--;
          break;
          case 1:
            if(pos[1] >= this.arr[0].length) break;
            pos[1]++;
          break;
          case 2:
            if(pos[0] >= this.arr.length) break;
            pos[0]++;
          break;
          case 3:
            if(pos[1] <= 0) break;
            pos[1]--;
          break;
        }
        if(this.arr[pos[0]][pos[1]][4]) continue;
        arr.push(i)
      }
      if(arr.length == 0) return this.move(-1);
      return this.move(arr[Math.floor(random(0,arr.length))])
      break;
      case 2:
        this.checkEndPopints(this.pos[0])
        if(!Array.isArray(this.pos[0])){
          this.pos = [[0,0]]
        }
        if(this.pos.length <= 0) return;
        let i,j;
        i=0
          pos = [...this.pos[i]]
          this.arr[this.pos[i][0]][this.pos[i][1]][4] = true;
          for(j=0;j<4;j++){
            pos = [...this.pos[i]];
            switch(j){
              case 0:
                if(pos[0] <= 0) break;
                pos[0]--;
              break;
              case 1:
                if(pos[1] >= this.arr[0].length) break;
                pos[1]++;
              break;
              case 2:
                if(pos[0] >= this.arr.length) break;
                pos[0]++;
              break;
              case 3:
                if(pos[1] <= 0) break;
                pos[1]--;
              break;
            }
            if(!this.arr[this.pos[i][0]][this.pos[i][1]][j])continue;
            if(this.arr[pos[0]][pos[1]][4])continue;
            this.pos.push(pos)
          }
        this.pos.shift()
        break;
    }
  }
}
class EndPoint{
  constructor(i,j,res){
    this.i = i;
    this.j = j;
    this.res = res;
  }
  draw(){
    push()
    noStroke()
    fill(0,255,0)
    rect((this.j*this.res)+(this.res/8),(this.i*this.res)+(this.res/8),(this.res)-(this.res/4),(this.res)-(this.res/4))
    pop()
  }
}
