import React, {
	Component
} from 'react'


import {
	sendEvent,
	catchEvent,
	middleEvents
} from './eventmodel'
export default class Top extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showLogout: "none",
			showNumber: "--",
			//			selectIndex:params.type ? 3 : params.vin? 1 : params.car ? 2 : 1
			selectIndex: 0,
			hasMessages: false //是否有新消息
				//			selectIndex:params.type ? (params.type=="vin"? 1 : (params.type =="part"? 3 : 2)) : 1 
		}
		this.titleclick = ""
		this.vinType = "vin"
		this.carType = "car"
		this.partType = "part"
		this.centerType = "center" //添加新页面
		this.chooseType = params.type ? params.type : "vin" //记录上次点击记录，防止多次点击相同清空内容
	}

	componentDidMount() {
		getAjax("/usersinfos", {}, response => {
				this.setState({
					showNumber: response.data.users
				})
			})
			//接受inquirecenter
		catchEvent(middleEvents.titleCanClick, e => {
			//			console.log(e.info.can)
			this.titleclick = e.info.can
		})

		this.pollTimer = setInterval(() => {
			this.poll()
		}, 900000)

		this.poll()
	}

	//轮询获取消息状态
	poll() {
		getAjax("/user/msglocalunread", {}, res => {
			// console.log(res)
			let _hasMessages = false
			if (res.data.total_counts > 0) _hasMessages = true
			this.setState({
				hasMessages: _hasMessages
			})
		})
	}

	showLogout(e) {
		let _showLogout = "none"
		if (e.type == "mouseover") {
			_showLogout = "initial"
		}
		if (e.type == "click") {
			let _stateshowLogout = this.state.showLogout == "initial" ? "none" : "initial"
			_showLogout = _stateshowLogout
		}
		this.setState({
			showLogout: _showLogout
		})
	}

	//	chooseInquire(inquireType = "vin",index) {
	//		if (this.titleclick=="block") {
	//			sendEvent(middleEvents.titleCanTan, {
	//				tan:"false" 
	//			})
	//			return
	//		}else{
	//			location.href = "/"
	//			return
	//		}
	//		this.setState({
	//			selectIndex:index
	//		})
	//		if(inquireType == this.chooseType){
	//			sendEvent(middleEvents.topItemClick, {
	//	    			type: inquireType
	//	    		})
	//		}
	//		this.props.chooseInquire(inquireType)
	//		this.chooseType = inquireType
	//	}
	chooseInquire(inquireType = "vin", index) {
		if (this.titleclick == "block") {
			//弹框to inquirecenter
			sendEvent(middleEvents.titleCanTan, {
				tan: "false"
			})
			return
		} else {
			this.chooseType = inquireType
			let _url = "/?type="
			let _type
			let _binds = "&binds=center"
			switch (this.chooseType) {
				case this.vinType:
					_type = "vin"
					break;
				case this.carType:
					_type = "car"
					break;
				case this.partType:
					_type = "part"
					break;
				default:
					break;
			}
			location.href = _url + _type + _binds
		}
	}
	render() {
		let _selectIndex = this.state.selectIndex
		let _chooseInquire = this.chooseInquire.bind(this)
		let _hasMessages = this.state.hasMessages

		return (
			<div className='TopContainer'>
				<div className="TopBackground"></div>
				<div className="TopRightContainer">
					<div className="TopRightSelectersContainer">
						<img className="TopLogo" src='https://cdns.007vin.com/img/p_logonew.png' onClick={() => _chooseInquire(this.vinType,1)}/>
						<span className="TopRightSelector" style={{color:_selectIndex==1?"#d8d8d8":"#fff"}} onClick={() => _chooseInquire(this.vinType,1)}>车架号查询</span>
						<span className="TopRightSelector" style={{color:_selectIndex==2?"#d8d8d8":"#fff"}} onClick={() => _chooseInquire(this.carType,2)}>车型查询</span>
						<span className="TopRightSelector" style={{color:_selectIndex==3?"#d8d8d8":"#fff"}} onClick={() => _chooseInquire(this.partType,3)}>零件号查询</span>
					</div>
					<div className="TopRightAccountContainer"
						onClick={this.showLogout.bind(this)}
						onMouseOver={this.showLogout.bind(this)}
						onMouseLeave={this.showLogout.bind(this)}>
						<div className="TopRightAccount">
							个人中心

							<div className="RedPoint" style={{display: _hasMessages ? "block" : "none"}}></div>
							<span><img src="https://cdns.007vin.com/img/icon_xiala.png" /></span>
						</div>
						<div className="Logout" style={{display: this.state.showLogout}} >
							<div className="LogoutItem" onClick={() => location.href = "/user/profile?binds=search&type=messages"}>
								<img src="https://cdns.007vin.com/img/icon_mess.png"/>
								<span>消息中心</span>
								<div className="RedPoint" style={{display: _hasMessages ? "block" : "none"}}></div>
							</div>
							<div className="LogoutItem" onClick={() => location.href = "/user/profile?binds=search"}>
								<img src="https://cdns.007vin.com/img/user_icon.png"/>
								<span>个人中心</span>
							</div>
							<div className="LogoutItem" onClick={() => location.href = "/user/profile?binds=home"}>
								<img src={cdnHost+ "/img/p_pay.png"}/>
								<span>续费</span>
							</div>
							<div className="LogoutItem" onClick={() => location.href = "/logout"}>
								<img src="https://cdns.007vin.com/img/icon_exit.png"/>
								<span>退出</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Top.propTypes = {
	chooseInquire: React.PropTypes.func.isRequired
}
