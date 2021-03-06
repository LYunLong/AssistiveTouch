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
var assistiveTouch = function(sets,clickFunc){                  //控件对象本身
    var atClass = (sets.atClass)?sets.atClass:"",
        imgUrl = (sets.imgUrl)?sets.imgUrl:"",
        closeBtn = (sets.closeBtn)?sets.closeBtn:false,
        autoSide = (sets.autoSide)?sets.autoSide:false;

    $(atClass).css("position","fixed");
    $(atClass).css("z-index","100");
    $(atClass).append('<div class="assistive-touch-content"></div>');
    if(imgUrl){$(".assistive-touch-content").css("background-image","url('"+imgUrl+"')");}
    if(closeBtn){$(atClass).append('<div class="assistive-touch-close-btn">×</div>');}
    $(".assistive-touch-close-btn").on(" click mouseup touchend",function(e){  //防止点击事件刺穿
        window.event? window.event.cancelBubble = true : e.stopPropagation();
        $(atClass).hide();
    });



    $(atClass).on("mousedown touchstart",function(e){
        var e = e||window.event;
        e.preventDefault();
        var mousePos = mousePosition(e);
        $(this).attr("moving","true");
        $(this).attr("offset-left",mousePos.x-$(this)[0].offsetLeft);
        $(this).attr("offset-top",mousePos.y-$(this)[0].offsetTop);
        $(this).attr("origin-left",mousePos.x);
        $(this).attr("origin-top",mousePos.y);
    });
    $(atClass).on("mousemove touchmove",function(e){
        if($(this).attr("moving")!="true")return;
        var e = e||window.event;
        e.preventDefault();
        var mousePos = mousePosition(e);
        $(this)[0].style.left = (mousePos.x-$(this).attr("offset-left"))+"px";
        $(this)[0].style.top = (mousePos.y-$(this).attr("offset-top"))+"px";
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
                clickFunc($(".assistive-touch-content")[0],$(this)[0]);
            });
            $(this).click();
            return;
        }

        $(".assistive-touch-close-btn").removeClass("right").removeClass('top');
        function sideOverflowFunc(t) {
            if(t[0].offsetLeft<0){
                t[0].style.left = 0;
            }
            if(t[0].offsetTop<0){
                t[0].style.top = 0;
                $(".assistive-touch-close-btn").addClass("top");
            }
            if((t[0].offsetTop+t[0].offsetHeight)>windowHeight){
                t[0].style.top = (windowHeight - t[0].offsetHeight)+"px";
            }
            if((t[0].offsetLeft+t[0].offsetWidth)>windowWidth){
                t[0].style.left = (windowWidth - t[0].offsetWidth)+"px";
                $(".assistive-touch-close-btn").addClass("right");
            }
        }

        function autoSideFunc(t){
            if (!autoSide)return;
            if(t[0].offsetTop<windowHeight/10){
                t.animate({top:"0px"},200);
                $(".assistive-touch-close-btn").addClass("top");
                return;
            }else if(t[0].offsetTop+t[0].offsetHeight>windowHeight/10*9){
                t.animate({top:(windowHeight-t[0].offsetHeight)+"px"},200);
                return;
            }
            if(t[0].offsetLeft+(t[0].offsetWidth/2)<=windowWidth/2){
                t.animate({left:"0px"},200);
            }else {
                t.animate({left:(windowWidth-t[0].offsetWidth)+"px"},200);
                $(".assistive-touch-close-btn").addClass("right");
            }
        }

        sideOverflowFunc($(this));
        autoSideFunc($(this));

    });
    return $(atClass);
}
