var tools = {
    tool: "pencil",
    graphic: "",
    color:""
}
var canvasHeight = $(window).height() - 35;
var canvasWidth = $(window).width();
window.onload=function() {
	//点击出现截图工具
	var urls = "#";
	var url ="#";
    $(".FeedBackButton").on("click",function(){
		$("#canvas").css({"position":"fixed","width":$(window).width()+"px","height":$(window).height()+"px"}).attr({"width":$(window).width(),"height":$(window).height()});
    		$(".FeedbackContainer").show();
    		canvasHeight = $(window).height();
		canvasWidth = $(window).width();
	    canvas = document.getElementById("canvas");
	    context = canvas.getContext("2d");
	    context.beginPath();
	    context.fillStyle="rgba(0, 0, 0, 0.2)";
		context.fillRect(0,0,canvasWidth,canvasHeight);
		context.beginPath();
	    context.clearRect(20,20,canvasWidth-40,canvasHeight-55);//context的clearRect方法
	    urls = canvas.toDataURL();
	    url = urls;
    });
//  canvasHeight = $(window).height() - 35;
//	canvasWidth = $(window).width();
    	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
    loadImg();
//  context.clearRect(0,0,canvas.width,canvas.height);//context的clearRect方法
	context.strokeStyle = "transparent";
	context.save();
    context.lineWidth=4;
    // 鼠标操作开关
    var flag = false;
    // 初始化起点坐标值及保存点
    var x, y = "";
    // 初始化字体属性
    var fontsize = "24px",
        fontfamily = "Arial",
        fontweight = "",
        fontstyle = "";
    // 初始化文本输入框
    var fontTip = $("<textarea rows='3' cols='20' style='background:transparent;position:absolute;display:none;'></textarea>");
    $(".ImageParkContainer").append(fontTip);

    $("canvas").mousedown(function(event) {
        // 绘制开始
    		context.strokeStyle = "red";
        
        flag = true;
        // 获取起点坐标值
        x = event.offsetX;
        y = event.offsetY;
    }).mouseup(function(event) {
        // 绘制完毕
        flag = false;
        url = $("canvas")[0].toDataURL();
        fontTip.focus();
    }).mousemove(function(event) {
        if (tools.tool == "pencil" && tools.graphic == "") {
            drawPencil(event);
        } else if (tools.tool == "pencil" && tools.graphic == "line") {
            drawLine(event);
        } else if (tools.tool == "pencil" && tools.graphic == "rect") {
            drawRect(event);
        } else if (tools.tool == "pencil" && tools.graphic == "circle") {
            drawCircle(event);
        } else if (tools.tool == "pencil" && tools.graphic == "triangle") {
            drawTriangle(event);
        } else if (tools.tool == "eraser") {
            // clearDraw(event);
            drawPencil(event);
        } else if (tools.tool == "word") {
            inputWord(event);
        }
    })

    // 绘制画笔
    function drawPencil(event) {
        if (flag) {
            context.lineTo(event.offsetX, event.offsetY);
            context.stroke();
        } else {
            context.beginPath();
            context.moveTo(event.offsetX, event.offsetY);
        }
    }
    // 绘制箭头
    function drawLine(event) {
        if (flag) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            // 载入上次保存点
            loadImg();
            context.strokeStyle = "red";
            context.beginPath();
            context.moveTo(x, y);		
            context.lineTo(event.offsetX, event.offsetY);
            context.stroke();
            context.strokeStyle = "black";
        }
    }
    // 绘制矩形
    function drawRect(event) {
        if (flag) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            // 载入上次保存点
            loadImg();

            context.beginPath();
            context.rect(x, y, event.offsetX - x, event.offsetY - y);
            if (tools.color != "") {
                context.fill();
                context.stroke();
            } else {
                context.stroke();
            }
        }
    }
    // 绘制圆形
    function drawCircle(event) {
        if (flag) {
            var rx = (event.offsetX - x) / 2;
            var ry = (event.offsetY - y) / 2;
            var r = Math.sqrt(rx * rx + ry * ry);

            context.clearRect(0, 0, canvas.width, canvas.height);
            // 载入上次保存点
            loadImg();

            context.beginPath();
            context.arc(rx + x, ry + y, r, 0, Math.PI * 2);
            if (tools.color != "") {
                context.fill();
                context.stroke();
            } else {
                context.stroke();
            }
        }
    }

    // 文字输入
    function inputWord(event) {
        if (flag) {
            fontTip.css({
                top: y,
                left: x,
                width: event.offsetX - x,
                height: event.offsetY - y,
                fontSize: fontsize,
                fontFamily: fontfamily,
                color: "red",
                fontStyle: fontstyle,
                fontWeight: fontweight
            }).show();
        }
    }
    // 绘制文字
    function drawWord(event) {
        var words = fontTip.val().trim();
        if (fontTip.css("display") != "none" && words) {
            var offset1 = $("#canvas").offset();
            var offset2 = fontTip.offset();
            context.fillStyle = "red";
            context.font = fontstyle + fontweight + fontsize + " " + fontfamily;

            if (isNaN(fontsize)) {
                var size = Number(fontsize.substring(0, fontsize.length - 2));
            }

            context.fillText(words, offset2.left - offset1.left + 2, offset2.top - offset1.top + size + 3);
            fontTip.val("");
        }
        fontTip.hide();
    }
    fontTip.blur(drawWord);
    // 禁止框变化
	$(".ImageParkContainer").on("keyup","textarea",function(){
		flag = false;
	}).on("click","textarea",function(){
		flag = false;
	})
	//清除画板
    $(".ImageParkSelectorContainer div:eq(4)").on("click", function() {
//  		flag = false;
//      context.clearRect(0, 0, canvas.width, canvas.height);
//		url=urls;
//		loadImg();
		resetAndClear();
    })
    //隐藏截图并重置
    function resetAndClear(){
    		flag = false;
    		context.clearRect(0,0,canvas.width,canvas.height);
    		url = urls;
    		loadImg();
//  		tool: "pencil",
    		tools.tool="pencil";
    		tools.graphic="";
//  		graphic: "",    		
    }
    $(document).on("keydown",function(event){
    		var e = event || window.event || arguments.callee.caller.arguments[0];
    		if(e&&e.keyCode==27){
    			resetAndClear();
    			$(".FeedbackContainer").hide();
    		}
    })
    $(".ImageParkSelectorContainer div:eq(5)").on("click", function() {
		resetAndClear();
    		$(".FeedbackContainer").hide();
    })
    //隐藏截图并上传
    $(".ImageParkSelectorContainer div:eq(6)").on("click", function() {
		 html2canvas(document.getElementById('root'), {
	        onrendered: function(canvas) {
	            var Pic = canvas.toDataURL("image/png");
   				Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "")

				postAjax("/userfeedback",{"imageData":Pic},(data)=>{
					if(data.code==1){
						resetAndClear();
    						$(".FeedbackContainer").hide();
					}
				})
//				var img = new Image;
//				img.crossOrigin = 'anonymous';
//				img.src=canvas.toDataURL();
//				var image =canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
//         		window.location.href=image; // it will save local
	        },
			
	    });
			
    });
    //隐藏画板并且清除
    function loadImg() {
        img = new Image();
        img.src = url;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}