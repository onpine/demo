let WINDOW_WIDTH = 1024;
let WINDOW_HEIGHT = 768;
let RADIUS = 8;
let MARGIN_TOP = 60;
let MARGIN_LEFT = 30;

// let endTime = new Date();
// endTime.setTime(endTime.getTime() + 3600*1000 );
let currentShowTimeSeconds = 0;

let balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){
  WINDOW_WIDTH = document.body.clientWidth;
  WINDOW_HEIGHT = document.body.clientHeight;
  MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
  RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108 )- 1;

  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;

  currentShowTimeSeconds = getCurrentShowTimeSeconds();
  setInterval(() => {
    render(context);
    update();
  }, 50);
}

function getCurrentShowTimeSeconds () {
  let curTime = new Date();
  // let ret = endTime.getTime() - curTime.getTime();
  // ret = Math.round(ret / 1000);
  let ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
  return ret >=0 ? ret : 0;
}

function update () {
  let nextShowTimeSeconds = getCurrentShowTimeSeconds();

  let nextHours = parseInt(nextShowTimeSeconds / 3600);
  let nextMinutes = parseInt(nextShowTimeSeconds % 3600 / 60);
  let nextSeconds = parseInt(nextShowTimeSeconds % 3600 % 60);

  let curHours = parseInt(currentShowTimeSeconds / 3600);
  let curMinutes = parseInt(currentShowTimeSeconds % 3600 / 60);
  let curSeconds = parseInt(currentShowTimeSeconds % 3600 % 60);

  if ( nextSeconds !== curSeconds ){
    if ( parseInt(curHours / 10) !== parseInt(nextHours / 10) ){
      addBalls( MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10) );
    }
    if ( parseInt(curHours % 10) !== parseInt(nextHours % 10) ){
      addBalls( MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(curHours % 10) );
    }
    if ( parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10) ){
      addBalls( MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes / 10) );
    }
    if ( parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10) ){
      addBalls( MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes % 10) );
    }
    if ( parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10) ){
      addBalls( MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds / 10) );
    }
    if ( parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10) ){
      addBalls( MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds % 10) );
    }

    currentShowTimeSeconds = nextShowTimeSeconds;
  }

  updateBalls();
}

function updateBalls() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;
    
    if ( balls[i].y >= WINDOW_HEIGHT-RADIUS ) {
      balls[i].y = WINDOW_HEIGHT-RADIUS;
      balls[i].vy = - balls[i].vy * 0.75;
    }
  }
  console.log(balls.length)

  let cnt = 0;
  for (let i = 0; i < balls.length; i++) {
    if ( balls[i].x+RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH ){
      balls[cnt++] = balls[i];
    }
  }
  while (balls.length > Math.min(300, cnt)) {
    balls.pop();
  }
}

function addBalls(x, y, num) {
  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if(digit[num][i][j] === 1){
        let aBall = {
          x: x+j*2*(RADIUS+1)+(RADIUS+1),
          y: y+i*2*(RADIUS+1)+(RADIUS+1),
          g: 1.5+Math.random(),
          vx: Math.pow(-1, Math.ceil( Math.random() * 1000 )) * 4,
          vy: -5,
          color: colors[ Math.floor( Math.random()*colors.length ) ]
        }

        balls.push( aBall );
      }
    }
  }
}

function render ( cxt ) {
  cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

  let hours = parseInt(currentShowTimeSeconds / 3600);
  let minutes = parseInt(currentShowTimeSeconds % 3600 / 60);
  let seconds = parseInt(currentShowTimeSeconds % 3600 % 60);

  renderDigit( MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
  renderDigit( MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hours % 10), cxt);
  renderDigit( MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10, cxt);
  renderDigit( MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(minutes / 10), cxt);
  renderDigit( MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(minutes % 10), cxt);
  renderDigit( MARGIN_LEFT+69*(RADIUS+1), MARGIN_TOP, 10, cxt);
  renderDigit( MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(seconds / 10), cxt);
  renderDigit( MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(seconds % 10), cxt);

  for (let i = 0; i < balls.length; i++) {
    cxt.fillStyle = balls[i].color;
    cxt.beginPath();
    cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true)
    cxt.closePath();
    cxt.fill();
  }
} 

function renderDigit( x, y, num, cxt ){
  cxt.fillStyle = 'rgb(0,102,153)';

  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if(digit[num][i][j] === 1){
        cxt.beginPath();
        cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
        cxt.closePath(); 

        cxt.fill();
      }
    }
  }
}