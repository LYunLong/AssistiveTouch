/**
 * Created by LONG on 2016/9/5.
 */

function mousePosition(ev){                    //获取点击||触摸位置
    if(ev.originalEvent.targetTouches&&ev.originalEvent.targetTouches[0]){
        return {x:ev.originalEvent.targetTouches[0].pageX, y:ev.originalEvent.targetTouches[0].pageY};
    }
    if(ev.originalEvent.touches&&ev.originalEvent.touches[0]){
        return {x:ev.originalEvent.touches[0].pageX, y:ev.originalEvent.touches[0].pageY};
    }
    if(ev.originalEvent.changedTouches&&ev.originalEvent.changedTouches[0]){
        return {x:ev.originalEvent.changedTouches[0].pageX, y:ev.originalEvent.changedTouches[0].pageY};
    }
    if(ev.pageX || ev.pageY){
        return {x:ev.pageX, y:ev.pageY};
    }
    return {
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}
var assistiveTouch = function(sets,clickFunc){
    var atClass = (sets.atClass)?sets.atClass:"",
        imgUrl = (sets.imgUrl)?sets.imgUrl:"",
        closeBtn = (sets.closeBtn)?sets.closeBtn:false;

    if(closeBtn){
        $(atClass).append('<div class="assistive-touch-close-btn">×</div>');
    }
    $(".assistive-touch-close-btn").on(" click mouseup touchend",function(){$(atClass).hide();});

    $(atClass).on("mousedown touchstart",function(e){
        var e = e||window.event;
        e.preventDefault();
        var mousePos = mousePosition(e);
        $(this).attr("moving","true");
        $(this).attr("offset-left",mousePos.x-$(this)[0].offsetLeft);
        $(this).attr("offset-top",mousePos.y-$(this)[0].offsetTop);
        $(this).attr("origin-left",mousePos.x);
        $(this).attr("origin-top",mousePos.y);
        // $(this).html((mousePos.x-$(this).attr("offset-left"))+":"+(mousePos.y-$(this).attr("offset-top")));
    });
    $(atClass).on("mousemove touchmove",function(e){
        if($(this).attr("moving")!="true")return;
        var e = e||window.event;
        e.preventDefault();
        var mousePos = mousePosition(e);
        $(this)[0].style.left = (mousePos.x-$(this).attr("offset-left"))+"px";
        $(this)[0].style.top = (mousePos.y-$(this).attr("offset-top"))+"px";
        // $(this).html((mousePos.x-$(this).attr("offset-left"))+":"+(mousePos.y-$(this).attr("offset-top")));
    });
    $(atClass).on("mouseup touchend",function(e){
        var e = e||window.event;
        e.preventDefault();
        var windowHeight = document.documentElement.clientHeight||document.body.clientHeight;
        var windowWidth = document.documentElement.offsetWidth||document.body.offsetWidth;

        $(this).attr("moving","false");

        var mousePos = mousePosition(e);

        if(Math.abs(mousePos.x-$(this).attr("origin-left"))<=5||Math.abs(mousePos.y-$(this).attr("origin-top"))<=5){
            $(this)[0].style.left = ($(this).attr("origin-left")-$(this).attr("offset-left"))+"px";
            $(this)[0].style.top = ($(this).attr("origin-top")-$(this).attr("offset-top"))+"px";
            $(this).click(function(e){
                clickFunc($(this)[0]);
            });
            $(this).click();
            return;
        }

        if($(this)[0].offsetLeft<0){
            $(this)[0].style.left = 0;
        }
        if($(this)[0].offsetTop<0){
            $(this)[0].style.top = 0;
        }
        if(($(this)[0].offsetTop+$(this)[0].offsetHeight)>windowHeight){
            $(this)[0].style.top = (windowHeight - $(this)[0].offsetHeight)+"px";
        }
        if(($(this)[0].offsetLeft+$(this)[0].offsetWidth)>windowWidth){
            $(this)[0].style.left = (windowWidth - $(this)[0].offsetWidth)+"px";
        }
    });
    return $(atClass);
}



//
// var touchFunc = function(obj,type,func) {
//     //滑动范围在5x5内则做点击处理，s是开始，e是结束
//     var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};
//     var sTime = 0, eTime = 0;
//     type = type.toLowerCase();
//
//     obj.addEventListener("touchstart",function(){
//         sTime = new Date().getTime();
//         init.sx = event.targetTouches[0].pageX;
//         init.sy = event.targetTouches[0].pageY;
//         init.ex = init.sx;
//         init.ey = init.sy;
//         if(type.indexOf("start") != -1) func();
//     }, false);
//
//     obj.addEventListener("touchmove",function() {
//         event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
//         init.ex = event.targetTouches[0].pageX;
//         init.ey = event.targetTouches[0].pageY;
//         if(type.indexOf("move")!=-1) func();
//     }, false);
//
//     obj.addEventListener("touchend",function() {
//         var changeX = init.sx - init.ex;
//         var changeY = init.sy - init.ey;
//         if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeY)>init.y) {
//             //左右事件
//             if(changeX > 0) {
//                 if(type.indexOf("left")!=-1) func();
//             }else{
//                 if(type.indexOf("right")!=-1) func();
//             }
//         }
//         else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){
//             //上下事件
//             if(changeY > 0) {
//                 if(type.indexOf("top")!=-1) func();
//             }else{
//                 if(type.indexOf("down")!=-1) func();
//             }
//         }
//         else if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y){
//             eTime = new Date().getTime();
//             //点击事件，此处根据时间差细分下
//             if((eTime - sTime) > 300) {
//                 if(type.indexOf("long")!=-1) func(); //长按
//             }
//             else {
//                 if(type.indexOf("click")!=-1) func(); //当点击处理
//             }
//         }
//         if(type.indexOf("end")!=-1) func();
//     }, false);
// };
//
//
// //touchstart事件
// function touchSatrtFunc(e) {
//     //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
//     var touch = e.touches[0]; //获取第一个触点
//     var x = Number(touch.pageX); //页面触点X坐标
//     var y = Number(touch.pageY); //页面触点Y坐标
//     //记录触点初始位置
//     startX = x;
//     startY = y;
// }
// //touchmove事件
// function touchMoveFunc(e) {
//     //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
//     var touch = evt.touches[0]; //获取第一个触点
//     var x = Number(touch.pageX); //页面触点X坐标
//     var y = Number(touch.pageY); //页面触点Y坐标
//     var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
//     //判断滑动方向
//     if (x - startX != 0) {
//         //左右滑动
//     }
//     if (y - startY != 0) {
//         //上下滑动
//     }
// }
