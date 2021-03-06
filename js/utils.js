var  language = localStorage.getItem("lang") || navigator.language.split('-')[0]
//慎用es6语法
function getAjax(url, content, callback, allback) {
	// content.version = version;
	$.ajax({
		headers: {
			"Sys-Language": language
		},
		type: "get",
		url: url,
		data: content,
		success: function(data) {
			if(allback) {
				callback(data)
				return;
			}
			if(data.code == 1) callback(data)
			else if(data.code == 400) location.href="/logout"
			else if(data.code == 401) {alert(data.msg);location.href="/logout"}
			else if(data.code == 6) callback(data)
			else if(data.code == 404 ||
					 data.code == 405||
					 data.code == 408||
					 data.code == 406) callback(data) //微信支付特殊处理
			else alert(data.msg)
		}
	})
}

function showDom(tag) {
	$(tag).css("display","block")
}

function hideDom(tag) {
	$(tag).css("display","none")
}

function postAjax(url, content, callback,allback) {
	// content.version = version;
	$.ajax({
		headers: {
			"Sys-Language": language
		},
		type: "post",
		url: url,
		data: content,
		success: function(data) {
			if(allback){
				callback(data)
			}
			if(data.code == 1) callback(data)
			else if(data.code == 2) location.href="/logout"
			else if(data.code == 4) callback(data)
//			else if(data.code == 0) return
			else alert(data.msg)
		}
	});
}

var urlSearch = location.search
var params = new Object()
if(urlSearch.indexOf("?") == 0) {
	var paramsString = urlSearch.substr(1)
	var paramLink = paramsString.split("&linkUrl=")
	params.linkUrl = paramLink[1]
	var paramsStrings = paramLink[0].split("&")
	for(var i = 0; i < paramsStrings.length; i++) {
		params[paramsStrings[i].split("=")[0]] = paramsStrings[i].split("=")[1];
	}
}

function clearBracket(aString) {
	if (aString.indexOf("(") >= 0) {
		aString = aString.replace("(", "")
		aString = aString.replace(")", "")
	}
	return aString
}

function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
		return "Chrome";
	}
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}
//以下是调用上面的函数
var mb = myBrowser();
if ("IE" == mb) {
    console.log("我是 IE");
}
if ("FF" == mb) {
    console.log("我是 Firefox");
}
if ("Chrome" == mb) {
    console.log("我是 Chrome");
}
if ("Opera" == mb) {
    console.log("我是 Opera");
}
if ("Safari" == mb) {
    console.log("我是 Safari");
}
//if($('#root').html()==""){
//	var mainError="<div id='mainError'><img src='image/p_jian.png' alt='浏览器版本不支持'><div class='msg'><p>抱歉，您的浏览器无法使用零零汽汽配查询</p><p>您可以使用谷歌浏览器、火狐浏览器、或者360浏览器进行查询。</p></div></div>";
//	$("#root").html(mainError);
//	
//}
var bodyHeight = $(window).height();

var flagAlert = true;
function alertX(msg) {
	if(flagAlert) {
		flagAlert = false
		$("#black_alert").css('display',"flex").html(msg);		
		setTimeout(hideAlert, 2000)
	}
}

function hideAlert() {
	flagAlert = true
	$("#black_alert").fadeOut()
}

// language = "en"

function zhEn(zh, en) {
	if(language === "en") {
		return en
	} else {
		return zh
	}
}