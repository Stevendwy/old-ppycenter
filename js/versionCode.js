var test=document.getElementById("version").getAttribute("src");
var version = test.split("=")[1];

//var versionCode = test.split("=")[1];
//var str=location.href
//if(str.indexOf("ppy?version=") !== -1){
//	var versions = str.split("version=")[1];
//	if(localStorage.version){
//		if(localStorage.version !== versions) localStorage.version = versions
//	}else{
//		localStorage.version = versions
//	}
//}
//
//var version = localStorage.version ? localStorage.version : versionCode


//调试用:
//version=parseInt(Math.random()*1000)