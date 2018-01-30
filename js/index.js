import React, {Component} from 'react'
import {render} from 'react-dom'
import FastClick from './fastclick' 
import Top from './top'
import Middle from './middle'
import Bottom from './bottom'
import Utils from './utils'
import MeddlePay from './meddlepay'
import {middleEvents, sendEvent} from './eventmodel'

class Page extends Component {
	constructor() {
		super()
		this.state = {
			inquireType: params.type || "vin",
			clicknum: 0
		}
		this.icons = ["img/rectangle.png", "img/circle.png", "img/arrow.png", "img/text.png", "img/reset.png", "img/cancle.png", "img/checkout.png", ]
		this.selectedIcons = ["img/rectangle_selected.png", "img/circle_selected.png", "img/arrow_selected.png", "img/text_selected.png", "img/reset.png", "img/cancle.png", "img/checkout.png", ]
	}
	
	componentDidMount() {
		FastClick.attach(document.body)//苹果点击延时处理
		getAjax('/user/msglocalunread', null ,res => {
			if (res.data.total_counts > 0){
				showDom(".RedPoint")
			}
		})
	}
	
	chooseInquire(type = "vin") {
		this.setState({clicknum: 1}, () => {
			this.setState({
				inquireType: type,
				clicknum: type == "car" ? 0 : 1 
			})
		})
	}
	
	render() {
		let _chooseInquire = this.chooseInquire.bind(this)
		let _inquireType = this.state.inquireType
		let _clicknum = this.state.clicknum
		let _middle
		let _icons = this.icons
		console.log(location.search)
		
		let _selectedIcons = this.selectedIcons
		if(_clicknum = 0) _middle = <div></div>
		else _middle = <Middle
					inquireType={_inquireType}/>
		

		if(location.search === "?/loop=buy") {
			_middle = <MeddlePay/>
			
		}


		
		let _bgc="#fff"
		return (
			<div className="PageContainer" style={{backgroundColor:_bgc}} onClick={() => sendEvent(middleEvents.pageClick)}>
				{/* <Top
					chooseInquire={_chooseInquire}/> */}
				{_middle}
				<Bottom />
			</div>
			
		)
	}
}

render(<Page />, document.getElementById("root"))
