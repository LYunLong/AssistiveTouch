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
        closeBtn = (sets.closeBtn)?sets.closeBtn:false;

    $(atClass).css("position","fixed");
    $(atClass).css("z-index","100");
    $(atClass).append('<div class="assistive-touch-content"></div>');

    if(imgUrl){
        $(".assistive-touch-content").css("background-image","url('"+imgUrl+"')");
    }

    if(closeBtn){
        $(atClass).append('<div class="assistive-touch-close-btn">×</div>');
    }
    $(".assistive-touch-close-btn").on(" click mouseup touchend",function(e){
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
