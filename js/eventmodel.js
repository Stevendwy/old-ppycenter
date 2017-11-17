export var middleEvents = {
	fromImg: "fromImg",
	fromList: "fromList",
	transform: "transform",
	mainGroupClick: "mainGroupClick",
	subGroupClick: "subGroupClick",
	detailShow: "detailShow",
	checkListHasItemMark: "checkListHasItemMark",//点击图片锚点后检查右侧是否有对应处理
	bodyClick: "bodyClick",
	showSubGroupPreview: "showSubGroupPreview", //下方分组预览是否展开
	subGroupPreviewClick: "subGroupPreviewClick",
	floatwindowMainGroupClick: "floatwindowMainGroupClick",
	floatwindowSubGroupClick: "floatwindowSubGroupClick",
	topItemClick:"topItemClick",
	pageClick: 'pageClick',
	titleCanClick:"titleCanClick",//top 获取是否可以点击跳转
	titleCanTan:"titleCanTan"
}

export function sendEvent(eventName, info = {}) {
	if(document.addEventListener){
		var event = new Event(eventName)
		
//		var event = document.createEvent('HTMLEvents')
//		// initEvent接受3个参数：  
//		// 事件类型，是否冒泡，是否阻止浏览器的默认行为  
//		event.initEvent("ondataavailable", true, true)
//		event.eventType = 'message'
		event.info = info
		document.dispatchEvent(event)
	}else {
		$.event.trigger(eventName)
	}
}

export function catchEvent(eventName, func = () => {console.log("catchEvent")}) {
	if(document.addEventListener) document.addEventListener(eventName, func)
	else document.attachEvent(eventName, func)
}

export function removeEvent(eventName, func = () => {console.log("removeEvent")}) {
	document.removeEventListener(eventName, func)
}

//export {middleEvents, sendEvent, catchEvent}
