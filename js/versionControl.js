function addCssByLink(url){
    var doc=document;  
    var link=doc.createElement("link");  
    link.setAttribute("rel", "stylesheet");  
    link.setAttribute("type", "text/css");  
    link.setAttribute("href", "/css/"+ url +".css?version="+version);  
    var heads = doc.getElementsByTagName("head");  
    if(heads.length)
        heads[0].appendChild(link);
    else  
        doc.documentElement.appendChild(link);  
}
function addLessByLink(url){
    var doc=document;  
    var link=doc.createElement("link");  
    link.setAttribute("rel", "stylesheet/less");  
    link.setAttribute("type", "text/css");  
    link.setAttribute("href", "/css/"+ url +".less?version="+version);  
    var heads = doc.getElementsByTagName("head");  
    if(heads.length){
        heads[0].appendChild(link);
    }else  
        doc.documentElement.appendChild(link);  
}

function createSrcipt(url){
	var doc=document;
	var script = doc.createElement("script");
	script.setAttribute('charset','UTF-8');
	script.setAttribute('type','text/javascript');
	script.setAttribute('src',"/js/" + url + '.js?version=' + version);
	var htmls = doc.getElementsByTagName("html");  
	htmls[0].appendChild(script);
}

function createLinkList(styleListArr){
	if(styleListArr._css){
		var _css = styleListArr._css;
		for(var i = 0 ; i < _css.length ; i++){
			addCssByLink(_css[i])
		}
	}
	if(styleListArr._less){
		var _less = styleListArr._less;
		for(var i = 0 ; i < _less.length ; i++){
			addLessByLink(_less[i])
		}
	}
	if(styleListArr._script){
		var _script = styleListArr._script;
		for(var i = 0 ; i < _script.length; i++){
			createSrcipt(_script[i])
		}
	}
}

createLinkList(styleListArr)