var canvasWidth = Math.min( 800 , $(window).width() - 20 )
var canvasHeight = canvasWidth

// 画笔颜色
var strokeColor = "black"
// 鼠标是否按下
var isMouseDown = false
// 一笔的初始坐标或上个位置坐标
var lastLoc = {x:0,y:0}
// 初始时间或上个时间
var lastTimestamp = 0
// 初始宽度或上个宽度
var lastLineWidth = -1

var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")

canvas.width = canvasWidth
canvas.height = canvasHeight

$("#controller").css("width",canvasWidth+"px")
drawGrid()

$("#clear_btn").click(
    function(e){
        context.clearRect( 0 , 0 , canvasWidth, canvasHeight )
        drawGrid()
    }
)
$(".color_btn").click(
    function(e){
        $(".color_btn").removeClass("color_btn_selected")
        $(this).addClass("color_btn_selected")
        strokeColor = $(this).css("background-color")
    }
)

// 一笔的开始
function beginStroke(point){

    isMouseDown = true
    //console.log("mouse down!")
    lastLoc = windowToCanvas(point.x, point.y)
    lastTimestamp = new Date().getTime();
}
// 一笔的结束
function endStroke(){
    isMouseDown = false
}
// 一笔的移动过程
function moveStroke(point){

    var curLoc = windowToCanvas( point.x , point.y );
    var curTimestamp = new Date().getTime();
    // 一条线首尾距离
    var s = calcDistance( curLoc , lastLoc )
    // 一条线所需时间
    var t = curTimestamp - lastTimestamp
    // 得到计算的线条宽度
    var lineWidth = calcLineWidth( t , s );

    //draw
    context.beginPath();
    // 从初始点开始
    context.moveTo( lastLoc.x , lastLoc.y );
    // 绘制到当前点
    context.lineTo( curLoc.x , curLoc.y );
    // 设置颜色与宽度等
    context.strokeStyle = strokeColor
    context.lineWidth = lineWidth
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()

    // 当前点成为上个点
    lastLoc = curLoc
    // 当前时间点成为上个时间点
    lastTimestamp = curTimestamp
    // 当前宽度成为上个宽度
    lastLineWidth = lineWidth
}
// 鼠标监听
canvas.onmousedown = function(e){
    e.preventDefault()
    beginStroke( {x: e.clientX , y: e.clientY} )
};
canvas.onmouseup = function(e){
    e.preventDefault()
    endStroke()
};
canvas.onmouseout = function(e){
    e.preventDefault()
    endStroke()
};
canvas.onmousemove = function(e){
    e.preventDefault()
    if( isMouseDown ){
        moveStroke({x: e.clientX , y: e.clientY})
    }
};

// 触摸事件 html5
canvas.addEventListener('touchstart',function(e){
    e.preventDefault()
    touch = e.touches[0]
    beginStroke( {x: touch.pageX , y: touch.pageY} )
});
canvas.addEventListener('touchmove',function(e){
    e.preventDefault()
    if( isMouseDown ){
        touch = e.touches[0]
        moveStroke({x: touch.pageX , y: touch.pageY})
    }
});
canvas.addEventListener('touchend',function(e){
    e.preventDefault()
    endStroke()
});

// 线条宽度
var maxLineWidth = 30;
var minLineWidth = 1;
// 画笔移动速度
var maxStrokeV = 10;
var minStrokeV = 0.1;
// 根据速度计算宽度 速度越大宽度越小
function calcLineWidth( t , s ){

    var v = s / t;

    var resultLineWidth;
    if( v <= minStrokeV )
        resultLineWidth = maxLineWidth;
    else if ( v >= maxStrokeV )
        resultLineWidth = minLineWidth;
    else{
        resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }

    // 若原来的宽度为-1，则直接返回做开始
    if( lastLineWidth == -1 )
        return resultLineWidth;
    // 若原来有宽度，按如下公式使其宽度平滑过渡
    return resultLineWidth*1/3 + lastLineWidth*2/3;
}

// 计算两点距离
function calcDistance( loc1 , loc2 ){

    return Math.sqrt( (loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y) )
}

// 返回相对画布原点的坐标
function windowToCanvas( x , y ){
    var bbox = canvas.getBoundingClientRect()
    return {x:Math.round(x-bbox.left) , y:Math.round(y-bbox.top)}
}
// 画出方格
function drawGrid(){

    context.save()

    context.strokeStyle = "rgb(230,11,9)"

    context.beginPath()
    context.moveTo( 3 , 3 )
    context.lineTo( canvasWidth - 3 , 3 )
    context.lineTo( canvasWidth - 3 , canvasHeight - 3 )
    context.lineTo( 3 , canvasHeight - 3 )
    context.closePath()
    context.lineWidth = 6
    context.stroke()

    context.beginPath()
    context.moveTo(0,0)
    context.lineTo(canvasWidth,canvasHeight)

    context.moveTo(canvasWidth,0)
    context.lineTo(0,canvasHeight)

    context.moveTo(canvasWidth/2,0)
    context.lineTo(canvasWidth/2,canvasHeight)

    context.moveTo(0,canvasHeight/2)
    context.lineTo(canvasWidth,canvasHeight/2)

    context.lineWidth = 1
    context.stroke()

    context.restore()
}