~function (pro) {
    function myFormatTime(template) {
        template = template || "{0}年{1}月{2}日 {3}时{4}分{5}秒";
        var ary = this.match(/\d+/g);
        return template.replace(/\{(\d+)\}/g, function () {
            var index = arguments[1],
                item = ary[index];!item ? item = "00" : null;
            item.length < 2 ? item = "0" + item : null;
            return item;
        });
    }

    pro.myFormatTime = myFormatTime;
}(String.prototype);


var $content = $(".content"),
    $calendar = $content.find(".calendar"),
    $calendarList=$calendar.find("ul"),
    $matchList = $content.find(".matchList");

//第一步：控制区域CONTENT/MATCH LIST的高度
changeHeight();
function changeHeight() {
    var $winH = $(window).innerHeight();

    //->CONTENT的高度=一屏幕的高度-HEADER高度-MARGIN值
    $content.css("height", $winH - 63 - 30);

    //->MATCH LIST的高度=CONTENT的高度-CALENDAR的高度-MARGIN值
    $matchList.css("height", $content.outerHeight() - $calendar.outerHeight() - 15);
}
$(window).on("resize", changeHeight);



//->第二步初始化ISCROLL
var menuScroll = new IScroll(".menu", {
    scrollbars: true,//->显示滚动条
    bounce: false,//->到达边界后没有缓冲效果
    mouseWheel: true//->PC端鼠标滚轮滚动,区域也跟着滚动
});

$(".menu .iScrollVerticalScrollbar").css({
    opacity: 0.3
});

var matchListScroll = new IScroll(".matchList", {
    scrollbars: true,
    bounce: false,
    mouseWheel: true
});
$(".matchList .iScrollVerticalScrollbar").css({
    opacity: 0.3
});

//绑定日期区域的数据
var serURL="http://matchweb.sports.qq.com/kbs/";
var calendarModule=(function(){
    var $calendarFns= $.Callbacks();
    var maxL= 0,minL=0;

    $calendarFns.add(bindHTML);
    function bindHTML(data,today){
        var str='';
        $.each(data,function(index,curData){
            str+='<li date="'+ curData["date"] +'"><a href="javascript:;">';
            str+='<span>'+ curData["weekday"] +'</span>';
            str+='<span>'+ curData["date"].myFormatTime("{1}-{2}") +'</span>';
            str+='</a></li>'
        });
        $calendarList.html(str).css("width",data.length*100);
    }

    $calendarFns.add(positionToday);
    function positionToday(data,today){

        var ary=[];
        today=new Date(today.replace(/-/g,"/"));
        //计算当天日期和所有日期的时间差
        $calendarList.children("li").each(function(index,curLi){
           var curLiDate=new Date($(curLi).attr("date").replace(/-/g,"/")) ;

            ary.push(today-curLiDate);
        });
        for(var i=0;i<ary.length;i++){
            var n=ary[i];
            if(n<=0){
                break;
            }
        }
        if(i===ary.length){
            i=ary.length-1;
        }

        var curLeft=(3-i)*110;

        $calendarList.css("left",(3-i)*110).find("li:eq("+i+")").addClass("bg")
    }

    $calendarFns.add(bindEvent);
    function bindEvent(){
        $calendar.on("click",function(e){
            var tar= e.target,
                tarTag=tar.tagName.toUpperCase(),
                $tar=$(tar);

            if (tarTag==="SPAN"){
                tar=tar.parentNode;
                $tar=$(tar);
                tarTag=tarTag
            }

            var curL=parseFloat($calendarList.css("left"));

            if(curL%110!==0){
               cur= Math.round(curL/110)*110
            }


            if(tarTag==="A"){
                if(tar.parentNode.tagName.toUpperCase()==="LI"){
                    $tar
                }




                if($tar.hasClass("caleTriLeft")){
                    curL+=770;

                }
                if($tar.hasClass("caleTriRight")){
                    curL-=770;
                }
                curL=curL>maxL ? maxL:(curL<minL ? minL : curL);
            }
        })
    }

    //模块中的方法，在这里实现获取数据
    function init(columnId){
        columnId=columnId||100000;
        $.ajax({
            url:serURL+"/calendar?columnId="+columnId,
            typeL:"get",
            dataType:"jsonp",
            success:function(jsonData){
                console.log(jsonData);
                if(jsonData && jsonData["code"]==0){
                    var data=jsonData["data"],
                        today=jsonData["today"];
                        minL=-(data.length-7)*110;

                    $calendarFns.fire(data,today)
                }
            }
        });
    }

    return{
        init:init
    };
})();
calendarModule.init();

//绑定matchList数据
var matchModule=(function(){
    function init(columnId){
        columnId=columnId||100000;
        var strIn=parseFloat($calendarList.css("left"))/110,
            endIn=strIn+6;
    }
})();










