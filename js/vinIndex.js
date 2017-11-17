// $.getJSON('/users/tips',function (obj){
//     if(obj.result=="1"){
//         $('.namaname').html(obj.full_name);
//         $('.pphone').html(obj.phone);
//         if(obj.date==""){
//             // $('.sttime').parent('p').hide();
//         }else{
//             $('.sttime').parent('p').show();
//             $('.fulldate').html(obj.date);
//         }
//     }
// })
var Mprice=0;
var Yprice=0;
// Mprice = parseInt($(".Mprice").html());
// Yprice = parseInt($(".Yprice").html());
//待支付
waitload();
function waitload() {
    $.getJSON("/pays/oderlist",{"s":1},function (obj) {
        if(obj.result==1){
            Mprice=obj.A;
            Yprice=obj.D;
            var data=obj.data;
            var html="";
            for(var i=0;i<data.length;i++){
                var count=data[i].values;
                if(count.length==1){
                    if(count[0].type=="A"){
                        numA=count[0].num;
                        numD=0;
                    }else{
                        numD=count[0].num;
                        numA=0;
                    }
                }else{
                    numA =count[0].num;
                    numD =count[1].num;
                }
                html+=`
            <div class="waitItem" id="${data[i].key}d">
                <div class="waitHead">
                    <span>${data[i].date}</span>
                    <ul>
                        <li>类别</li>
                        <li>单价</li>
                        <li>数量</li>
                        <li>小计</li>
                        <li class="total">合计</li>
                        <li>交易操作</li>
                    </ul>
                </div>
                <div class="waitBody">
                    <div class="waitBleft">
                        <div class="waitBleft_f">
                            <ul>
                                <li>月卡</li>
                                <li>${Mprice}元／张</li>
                                <li>${numA}</li>
                                <li>￥${Mprice*numA}</li>
                            </ul>
                            <ul>
                                <li>年卡</li>
                                <li>${Yprice}元／张</li>
                                <li>${numD}</li>
                                <li>￥${Yprice*numD}</li>
                            </ul>
                        </div>
                        <div class="waitBelft_r">
                            <span>￥${Mprice*numA+Yprice*numD}</span>
                        </div>
                    </div>
                    <div class="waitBright">
                        <a href="${Mprice*numA+Yprice*numD}" id="${data[i].key}" class="payNow">立即付款</a>
                        <a href="#" class="cancels">取消订单</a>
                    </div>
                </div>
            </div>`
            }
            $(".payItems").html(html);
            waitPay();
        }else{

        }
    })
//已支付
}
succload();
function succload() {
    $.getJSON("/pays/oderlist",{"s":2},function (obj) {
        if(obj.result==1) {
            waitPay();
            data = obj.data;
            html = "";
            for (i = 0; i < data.length; i++) {
                var count=data[i].values;
                if(count.length==1){
                    if(count[0].type=="A"){
                        numA=count[0].num;
                        numD=0;
                    }else{
                        numD=count[0].num;
                        numA=0;
                    }
                }else{
                    numA =count[0].num;
                    numD =count[1].num;
                }
                html += `                        
            <div class="waitItem">
                <div class="waitHead">
                    <span>${data[i].date}</span>
                    <ul>
                        <li>类别</li>
                        <li>单价</li>
                        <li>数量</li>
                        <li>小计</li>
                        <li class="total s_total">合计</li>
                    </ul>
                </div>
                <div class="waitBody">
                    <div class="waitBleft">
                        <div class="waitBleft_f">
                            <ul>
                                <li>月卡</li>
                                <li>${Mprice}元／张</li>
                                <li>${numA}</li>
                                <li>￥${Mprice *numA}</li>
                            </ul>
                            <ul>
                                <li>年卡</li>
                                <li>${Yprice}元／张</li>
                                <li>${numD}</li>
                                <li>￥${Yprice *numD}</li>
                            </ul>
                        </div>
                        <div class="waitBelft_r s_wait_r">
                            <span>￥${Mprice *numA + Yprice *numD}</span>
                        </div>
                    </div>
                </div>
            </div>`;
            }
            $('.succItems').html(html);
            var wangcheng = $(".succItems>div").length;
            $('.wangcheng span').html(wangcheng);
        }else{
            window.location.href = "/login";
        }
    })
}

// 红色图标动态生成
function waitPay() {
    var count = $('.waitTip .waitItem').length;
    if(count==0){
        $('.vCounts').hide();
    }else{
        $('.vCounts').show();
    }
    $(".vCounts").html(count).css("width","20px").css("height","20px").css("top","2px").css("right","18px");
    $(".wHead span b").html(count);
}


//切换导航栏
$(".navCenter a").on('click',function (e) {
    e.preventDefault();
    waitPay();
    if($(this).attr("href")=="#wait"){
        // waitload();
        // $(".vCounts").html(" ").css("width","6px").css("height","6px").css("top","8px").css("right","30px");
    }else if($(this).attr("href")=="#succ"){
        waitPay();
        succload();
    }else{
        waitPay();
    }
    $($(this).attr("href")).show().siblings().hide();
    $(this).parent('li').addClass('active').siblings().removeClass("active")
})
// 购新卡
$(document).on('click','.vCount a',function (e) {
    e.preventDefault();
    var str= $(this).parents('.row').find('.vPrice').html();
    var pri = parseInt(str);
    if($(this).hasClass('sub')){
        if($(this).siblings('span').html()>0){
            var count = parseInt($(this).siblings('span').html())-1;
            $(this).siblings('span').html(count);
            var total = pri*count;
            total="￥"+total;
            $(this).parents('.row').find('.vTprice').html(total);

        }}else{
        var count = parseInt($(this).siblings('span').html())+1;
        $(this).siblings('span').html(count);
        var total = pri*count;
        total="￥"+total;
        $(this).parents('.row').find('.vTprice').html(total);
    }
    // total();
    var arr=$('.vTprice');
    var allTotal=0;
    for(var i=0;i<arr.length;i++){
        allTotal+=parseInt($(arr[i]).html().slice(1));
    }
    allTotal="￥"+allTotal;
    $('.buyFooter span').html(allTotal);

    var A=$("#countM").html();
    var D=$("#countY").html();
    if(A==0&&D==0){
        $(".buyFooter a").css("background","gray")
    }else{
        $(".buyFooter a").css("background","#FF8000")
    }
})
total();
function total() {
    var arr=$('.vTprice');
    var allTotal=0;
    for(var i=0;i<arr.length;i++){
        allTotal+=parseInt($(arr[i]).html().slice(1));
    }
    allTotal="￥"+allTotal;
    $('.buyFooter span').html(allTotal);
}
// 确定购买
$('.buyFooter a').on('click',function (e) {
    timers=1;
    e.preventDefault();
    var pr=$('.buyFooter span').html().slice(1);
    var A=$("#countM").html();
    var D=$("#countY").html();
    if(A==0&&D==0){
        return
    }else{
        toPay(pr);
        $.ajax({
            url:"/pays/buyslist",
            type:"post",
            data:"A="+A+"&D="+D+"&t="+pr,
            dataType:'json',
            success:function (obj) {
                if(obj.result==1){
                    $('.modelCenter img').attr('src',obj.data);
                    callback="1";
                    a(obj.uuid);
                }
            }
        })
    }
})
var timers=1;
$(".modal_succ a").on("click",function (e) {
    waitload();
    succload();
    e.preventDefault();
    $(".modal_succ").hide();
    if($(this).attr("href")=="#wait"){
        $(".navCenter>ul>li").removeClass('active');
        $(".navCenter>ul>li").eq(1).addClass('active');
    }else{
        $(".navCenter>ul>li").removeClass('active');
        $(".navCenter>ul>li").eq(2).addClass('active');
    }
    $($(this).attr("href")).show().siblings().hide();
    // clearTimeout(timers);
    timers=null;
})
function a(c) {
    if(callback == "1"){
        jQuery.ajax({
            type: "GET",
            url: "/connect/l?uuid="+c,
            dataType: "script",
            cache: !1,
            timeout: 6e4,
            success: function() {
                var f = window.wx_errcode;
                switch (f) {
                    case 405:
                        $(".modelPay").hide();
                        $(".modal_succ p").text("支付成功");
                        $(".modal_succ span").text("3");
                        $(".modal_succ a").html("立即查询").attr("href","#succ");
                        $(".modal_succ").css("display", "block");
                        callback = "0";
                        var timer = setInterval(function () {
                            var time = parseInt($('.modal_succ span').html());
                            time--;
                            $('.modal_succ span').html(time);
                        },1000)
                        setTimeout(function () {
                            $('.modal_succ').hide();
                            clearInterval(timer);
                            // $('.waitItem').eq(index).remove();
                            // waitPay();
                            if(timers){
                                $(".navCenter>ul>li").removeClass('active');
                                $(".navCenter>ul>li").eq(2).addClass('active');
                                $('#succ').show().siblings().hide();
                                waitload();
                                succload();
                            }
                        },3000);
                        // setTimeout($('#succ').show().siblings().hide(),1000);
                        break;
                    case 404:
                        $(".modelPay").hide();
                        $(".modal_succ p").text("支付失败");
                        $(".modal_succ span").text("3");
                        $(".modal_succ a").html("重新支付").attr('href',"#wait");
                        $(".modal_succ").css("display","block");
                        callback = "0";
                        var timer = setInterval(function () {
                            var time = parseInt($('.modal_succ span').html());
                            time--;
                            $('.modal_succ span').html(time);
                        },1000)
                        setTimeout(function () {
                            $('.modal_succ').hide();
                            clearInterval(timer);
                            if(timers){
                                $(".navCenter>ul>li").removeClass('active');
                                $(".navCenter>ul>li").eq(1).addClass('active');
                                $('#wait').show().siblings().hide();
                                waitload();
                            }
                        },3000);
                        break;
                    case 403:
                        setTimeout(a, 2e3, c);
                        break;
                    case 402:
                    case 500:
                        window.location.reload();
                        break;
                    case 408:
                        setTimeout(a, 2e3, c)
                }
            },
            // error: function() {
            //     var e = window.wx_errcode;
            //     alert(e);
            // }
        })}
}
$('.modelCenter a').on('click',function (e) {
    e.preventDefault();
    $('.modelPay').hide();
    waitload();
    callback=0;
})

function toPay(x) {
    $('.modelCenter span').html(x);
    $('.modelPay img').attr("src","/img/veryhuo.com_gif.gif");
    $('.modelPay').show();
}
// 待支付
$('.waitItems').on('click','.payNow',function (e) {
    timers=1;
    e.preventDefault();
    if($('.modalOperate').css('display')=="none"&&$('.modal_succ').css('display')=="none") {
        var id = $(this).attr('id');
        toPay($(this).attr('href'));
        $.getJSON("/pays/oderpay",{"k":id},function (obj) {
            if(obj.result==1){
                $('.modelCenter img').attr('src',obj.data);
                $('.modalCenter span').text("￥"+obj.total);
                callback="1";
                a(obj.uuid);
            }else if(obj.result==2){
                window.location.href = "/login";
            }
        });
    }
})
//清空订单
$('.wHead a').on('click',function (e) {
    e.preventDefault();
    if($('.modalOperate').css('display')=="none"&&$('.modal_succ').css('display')=="none"){
        $('.modalOperate p').html("确认清空所有订单？")
        $('.modalOperate').show();
    }
});
//取消订单
// 要删除的下标
var index=0;
$('.waitItems').on('click','.cancels',function (e) {
    e.preventDefault();
    if($('.modalOperate').css('display')=="none"&&$('.modal_succ').css('display')=="none"){
        $('.modalOperate p').html("确认取消订单？");
        $('.modalOperate').show();
        index = $(this).parents(".waitItem").index();
    }
})
//确定清除
$('.confirm').on('click',function (e) {
    e.preventDefault();
    $('.modalOperate').hide();
    if($('.modalOperate p').html()=="确认取消订单？"){
        var item=$('.waitItem').eq(index).attr('id');
        $.get("/pays/odercancel",{"k":item},function (obj) {
            if(obj=="true"){
                $('.modal_succ p').html("成功取消订单");
                $('.modal_succ span').html("3");
                $('.modal_succ a').html("");
                $('.modal_succ').show();
                var timer = setInterval(function () {
                    var time = parseInt($('.modal_succ span').html());
                    time--;
                    $('.modal_succ span').html(time);
                },1000)
                setTimeout(function () {
                    $('.modal_succ').hide();
                    clearInterval(timer);
                    $('.waitItem').eq(index).remove();
                    waitPay();
                },3000)
            }else{

            }
        })
    }else {
        $('.modal_succ p').html("成功清空所有订单");
        $('.modal_succ span').html("3");
        $('.modal_succ a').html("");
        $.get("/pays/odercancel",{"k":"all"},function (obj) {
            if(obj=="true"){
                $('.modal_succ').show();
                var timer = setInterval(function () {
                    var time = parseInt($('.modal_succ span').html());
                    time--;
                    $('.modal_succ span').html(time);
                }, 1000)
                setTimeout(function () {
                    $('.modal_succ').hide();
                    clearInterval(timer);
                    window.location.href = "/pays/buyslist";
                    // history.back(-1);
                },3000)
            }
        })
    }
});
$('.cancel').on('click',function (e) {
    e.preventDefault();
    $('.modalOperate').hide();
    $('.modal_succ').hide();
});