import React, {
	Component
} from 'react'
import {
	render
} from 'react-dom'
import MiddleRightOne from './middlerightmess'
import MiddleRightTwo from './middlerightcenter'
import MiddleRightThree from './middlerightmessage'
import VerificationWindows from './verificationwindows'
import MiddleVipDetail from './middlevipdetail'
import MiddleShopping from './middleshopping'
import TickeyBox from './tickeybox'
import {
	dataShowImg
} from './datetest'
import {
	sendEvent,
	catchEvent,
	middleEvents
} from './eventmodel'
import UserPay from './userpay'
export default class InquireCenter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			redbtnshow: "none",
			middlerightonemess: {},
			tobuy: "购买",
			newshow: <div></div>,
			nmiddleLeftListEnter: [0, 0, 0, 0 ,0], //滑入组件状态
			nmiddleLeftListClick: [1, 0, 0, 0 ,0], //选择显示组件状态
			FloatIndexOneShow: "none", //未购买弹框
			BtnChangeShow: true, //修改密码弹框
			isShow: "none",
			orderCode: "",
			paySrc: "#",
			time: "",
			msgShow: "none",
			msg: "",
			timeCount: 3,
			isVip: 1,
			buyType: [],
			qrShow: false, // 是否显示微信绑定二维码
			qrImgUrl: null, // 二维码图片
			userName: "",
			userPhone: "",
			score:"",
			baseInfoData: {},
			special: false, //弹出框样式特别逻辑
			totalMoney: ""
		}
		this.callback = ""
		this.type = ""
		this.registRequest = ""
		this.types = params.binds //那个页面跳转过来
		this.secondtype = params.type //本身那个页面显示
		this.headerTitles = ['选择品牌套餐', '使用期限', '价格']
	}

	componentDidMount() {
		this.updateUserInfo()
		catchEvent(middleEvents.titleCanTan, e => {
			this.msgShowToHide("请先完成支付")
		})
		this.pollTimer = setInterval(() => {
			this.settimegetmes()
		}, 900000)
		this.settimegetmes()
	}

	updataMoney(money){
		this.setState({
			totalMoney: money
		})
	}

	updateUserInfo() {
		getAjax("/user/info", "", response => {
			//弹框是否过期处理 response.overdue=="已过期"
			// let _show = (response.left_dates > 7) || (response.left_dates == "") ? "none" : "none"
			let _show = "none"
				// let _buy = (response.is_payment == "已付款" && response.overdue == "未过期") ? "续费" : "购买"
				// !this.state.isVip
				// let _ok = (response.is_payment == "未付款" || response.overdue == "已过期") ? "block" : "none"
			let _ok = "none"
			let _showbody = <div></div>
			let _showlist = [0, 0, 1, 0 , 0]
				//对应列表显示从home 登录页跳转过来或者注册页跳转过来显示第三栏
			if (this.types == "home" || this.types == "regiest") {
				_showbody = <UserPay onClick={this.toPayClick.bind(this)}
				    headerTitles={this.headerTitles}
				/>
				_showlist = [0, 0, 0, 0 ,0, 1]
			}else if(this.types == "shopping"){
				_showbody = <MiddleShopping />
				_showlist = [0, 1, 0, 0 ,0, 0]
			}else{
				_showbody = (
					<MiddleVipDetail 
						showQR={this.showQR.bind(this)}
						bindmes={response}
						updateUserInfo={this.updateUserInfo.bind(this)}
						buyClick = {this.boBuyClick.bind(this)} 
						updataMoney={this.updataMoney.bind(this)}						
						data= {response} 
						score= {response.data.score}
						BtnShow= {this.BtnShow.bind(this)}/>
				)
				_showlist = [1, 0, 0, 0, 0, 0]
			}
			if (this.secondtype == "messages") {
				_showbody = <MiddleRightThree />
				_showlist = [0, 0, 1, 0, 0 ,0]
			}else if(this.secondtype == "ticket") {
				_showbody = <TickeyBox />
				_showlist = [0, 0, 0, 0, 1, 0]
			}



			this.setState({
				middlerightonemess: response,
				nmiddleLeftListClick: _showlist,
				FloatIndexOneShow: _show,
				newshow: _showbody,
				userName: response.data.full_name,
				userPhone: response.data.phone,
				score: response.data.score,
				baseInfoData: response,
				totalMoney: response.account.total_balance
			})
			this.registRequest = response.data.phone
			sendEvent(middleEvents.titleCanClick, {
				can: _ok
			})
		})
	}

	listClick(item) {
		// alert(JSON.stringify(item))
	}

	chooseClick(containers) {
		let _newshow = <div></div>
		let _nmiddleLeftListClick = [0, 0, 0, 0, 0, 0, 0]
		switch (containers) {
			case "vipcontainer":
				_newshow = (
					<MiddleVipDetail
						showQR={this.showQR.bind(this)}
						bindmes={this.state.middlerightonemess}
						updateUserInfo={this.updateUserInfo.bind(this)}
						buyClick = {this.boBuyClick.bind(this)} 
						data={this.state.baseInfoData} 
						score={this.state.score}
						updataMoney={this.updataMoney.bind(this)}
						BtnShow={this.BtnShow.bind(this)}/>
				)
				_nmiddleLeftListClick[0] = 1
				break;
			case "shoppingcontainer":
				_newshow = <MiddleShopping />
				_nmiddleLeftListClick[1] = 1
				break;
			case "msgcontainer":
				_newshow = <MiddleRightThree /> 
				_nmiddleLeftListClick[2] = 1
				break;
			case "countcontainer":
				_newshow = <MiddleRightOne
								bindmes={this.state.middlerightonemess}
								BtnShow={this.BtnShow.bind(this)}
								updateUserInfo={this.updateUserInfo.bind(this)}
								showQR={this.showQR.bind(this)}/>
				_nmiddleLeftListClick[3] = 1
				break;
			// case "usecontainer":
			// 	_newshow = <MiddleRightTwo />
			// 	_nmiddleLeftListClick[4] = 1
			// 	break;
			case "ticketcontainer":
				_newshow = <TickeyBox/>
				_nmiddleLeftListClick[4] = 1
				break;
			case "buycontainer":
				_newshow = <UserPay
					headerTitles={this.headerTitles}
					onClick = {this.toPayClick.bind(this)}
				/>
				_nmiddleLeftListClick[5] = 1
				break;
			default:
				_newshow = (
					<MiddleRightOne
						bindmes={this.state.middlerightonemess}
						BtnShow={this.BtnShow.bind(this)}
						updateUserInfo={this.updateUserInfo.bind(this)}
						showQR={this.showQR.bind(this)}/>
				)
				_nmiddleLeftListClick[0] = 1
				break;
		}
		this.setState({
			newshow: _newshow,
			nmiddleLeftListClick: _nmiddleLeftListClick
		})
	}

	BtnShow(mess,special=false) {
		this.setState({
			BtnChangeShow: mess,
			special: special
		})
	}

	showQR(shouldShow) {
		this.setState({
			qrShow: shouldShow
		}, this.qrInfo.bind(this))
	}

	qrInfo() {
		getAjax("/wechat/bind/qrcode", null, res => {
			this.setState({qrImgUrl: res.img}, this.qrResult.bind(this))
		})
	}

	qrResult() {
		this.resultInterval = setInterval(() => {
			getAjax('/wechat/bind/check', null, res => {
				switch(res.code) {
					case 405: // 成功
						this.setState({qrShow: false}, () => {
							clearInterval(this.resultInterval)
							alert('绑定成功')
							this.updateUserInfo()
						})
						break
					case 406: // 此微信已经绑定过其他账号
						this.setState({qrShow: false}, () => {
							clearInterval(this.resultInterval)
							alert('此微信已经绑定过其他账号')
						})
						break
					case 408: // 等待, 轮询
						;
						break
					case 404: // 没有收到验证请求
						alert('没有收到验证请求, 请重试')
						break
					default:
						alert(res.msg)
				}
			}, true)
		}, 3000)
	}

	getQR() {
		if(this.state.qrShow) return (
			<div className='container-qr'>
				<div className='qr'>
					<span className='bind'>绑定微信</span>
					<img src={this.state.qrImgUrl} alt='qr' />
					<span className='scan'>微信扫一扫</span>
					<div className='close'
						onClick={() => this.setState({qrShow: false}, () => clearInterval(this.resultInterval))}>
						<img src='https://cdns.007vin.com/img/user_close.png' alt='close' />
					</div>
				</div>
			</div>
		)
	}

	verificBack(mess, whether) {
		this.setState({
			BtnChangeShow: mess
		})
		if (whether !== false) {
			this.msgShowToHide(whether)
		}
	}

	toPayClick(type, time) {
		sessionStorage.setItem('priceType', type);
		sessionStorage.setItem('overDueTime', time[type - 1]);
		location.href = "/pays/wxpage"
	}


	msgShowToHide(msg) {
		this.setState({
			msg: msg,
			msgShow: "flex",
			timeCount: 3
		}, () => {
			var timers = setInterval(() => {
				if (this.state.timeCount == 0) {
					clearInterval(timers)
					this.setState({
						msgShow: "none",
						timeCount: 3
					})
				} else {
					this.setState({
						timeCount: --this.state.timeCount
					})
				}
			}, 1000)
		})
	}

	getNowFormatDate(type) {
		var seperator1 = "-";
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (type == 1) {
			strDate++
		} else {
			year++
		}

		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = year + seperator1 + month + seperator1 + strDate;
		return currentdate;
	}
	//定时巡查
	settimegetmes() {
		let _urlmessage = "/user/msglocalunread"
		getAjax(_urlmessage, {}, responses => {
			let _btnshow = "none"
			_btnshow = responses.data.total_counts > 0 ? "block" : "none"
			this.setState({
				redbtnshow: _btnshow
			})
		})
	}

	boBuyClick() {
		this.chooseClick("buycontainer")
	}

	render() {
		let _orderCode = this.state.orderCode
		let _paymoney = 2000
		let _msgShow = this.state.msgShow
		let _isShow = this.state.isShow
		let _paySrc = this.state.paySrc
		let _time = this.state.time
		let _msg = this.state.msg
		let _timeCount = this.state.timeCount
		let _vipcontainer = (this.state.nmiddleLeftListClick[0] == 1) ? "vipcontainer" : ""
		let _shoppingcontainer = (this.state.nmiddleLeftListClick[1] == 1) ? "shoppingcontainer" : ""		
		let _msgcontainer = (this.state.nmiddleLeftListClick[2] == 1) ? "msgcontainer" : ""
		let _countcontainer = (this.state.nmiddleLeftListClick[3] == 1) ? "countcontainer" : ""
		let _usecontainer = (this.state.nmiddleLeftListClick[4] == 1) ? "usecontainer" : ""
		let _ticketcontainer = (this.state.nmiddleLeftListClick[5]) == 1? "ticketcontainer" : ""
		let _buycontainer = (this.state.nmiddleLeftListClick[5] == 1) ? "buycontainer" : ""
		let _FloatIndexOne = this.state.FloatIndexOneShow //whether show
		let _BtnChangeShow = this.state.BtnChangeShow //修改密码弹框
			// let _tobuy = this.state.tobuy //购买还是续费
		let _tobuy = this.state.isVip ? "续费" : "购买"
		let _middle = this.state.newshow
		let _redbtnshow = this.state.redbtnshow //红点显示

		let _id = this.state.middlerightonemess.userid
		let _endtime = this.state.middlerightonemess.valid_datetime == "" ? "（ 未购买 ）" : this.state.middlerightonemess.valid_datetime
		let _containerClass = ["vipcontainer","shoppingcontainer","msgcontainer","countcontainer","ticketcontainer","buycontainer"]
		let _containerText = ["会员权益","报价单","系统消息","账户管理","我的优惠码","购买续费"]
		let _buyType = (
			<div>
				{
					this.state.buyType.map((item, index) => {
						return (
							<div key={index}>
								<span>{item.name}</span>|
								<span>有效期至:</span>
								<span>
									{item.valid_datetime}
								</span>
							</div>
						)
					})
				}
				<div className="button" onClick={this.boBuyClick.bind(this)}>续费</div>
			</div>
		)

		if (!this.state.isVip) {
			_buyType = (
				<div>
					<div className="notVip">非会员</div>
					<div className="button" onClick={this.boBuyClick.bind(this)}>购买</div>
				</div>
			)
		}

		return (
			<div className="Nmiddlecontent">
					<div className="FloatIndexOne" style={{display:_FloatIndexOne}}
						onClick={()=>{this.setState({FloatIndexOneShow:"none"})}}>
						<div className="FloatIndexOneMess">
							<div className="bgDelete"></div>
							您的账号即将到期，请续费
						</div>
					</div>
					<VerificationWindows
						phonenum={this.registRequest}
						show={_BtnChangeShow}
						special={this.state.special}						
						verificBack={this.verificBack.bind(this)}
						registRequest={this.registRequest} />
					<div className="NmiddleTitle">
						<div className="middleCenter">
							{/* {_buyType} */}
							<img src="/img/p_photo.png"/>
							<div>
								{this.state.userPhone}
							</div>
							<div>
								我的积分 <span className="score">{this.state.score}</span>
							</div>
							<div>
								我的现金 <span> ￥{this.state.totalMoney} </span>
							</div>
							<div className="button" onClick={this.boBuyClick.bind(this)}>续费</div>
						</div>

					</div>
					<div className="Nmiddlecontents">
						<div className="NmiddleLeft">
							<div className="NmiddleList">
								{
									_containerClass.map((item,index)=>{
										let _classNames = "NmiddleLeftList "
										_classNames += this.state.nmiddleLeftListClick[index] == 1 ? item : ""
										return(
											<div className={_classNames}
												onClick={this.chooseClick.bind(this,item)}
												key = {index}
												>
												<div className={"NmiddleLeftListImg _"+item}></div>
												<span>{_containerText[index]}</span>
											</div>
										)
									})
								}
								{/* <div className={"NmiddleLeftList " + _vipcontainer}
									onClick={this.chooseClick.bind(this,"vipcontainer")}>
									<div className="NmiddleLeftListImg NmiddleLeftListImgOne"></div>
									<span>会员权益</span>
								</div>
								<div className={"NmiddleLeftList " + _shoppingcontainer}
									onClick={this.chooseClick.bind(this,"shoppingcontainer")}>
									<div className="NmiddleLeftListImg NmiddleLeftListImgSix"></div>
									<span>报价单</span>
								</div>
								<div className={"NmiddleLeftList " + _msgcontainer}
									onClick={this.chooseClick.bind(this,"msgcontainer")}>
									<div className="NmiddleLeftListImg NmiddleLeftListImgTwo"></div>
									<div className="redmessage" style={{display:_redbtnshow}}></div>
									<span>系统消息</span>
								</div>
								<div className={"NmiddleLeftList " + _countcontainer}			
									onClick={this.chooseClick.bind(this,"countcontainer")}>
									<div className="NmiddleLeftListImg NmiddleLeftListImgThree"></div>
									<span>账户管理</span>
								</div>
								<div className={"NmiddleLeftList " + _usecontainer}
									onClick={this.chooseClick.bind(this,"usecontainer")}>
									<div className="NmiddleLeftListImg NmiddleLeftListImgFour"></div>
									<span>使用说明</span>
								</div>
								<div className={"NmiddleLeftList " + _ticketcontainer}
									onClick={this.chooseClick.bind(this,"ticketcontainer")}>
									<div className="NmiddleLeftListImg NmiddleLeftListImgFive"></div>
									<span>我的优惠码</span>
								</div>
								
								<div className={"NmiddleLeftList " + _buycontainer}
									onClick={this.chooseClick.bind(this,"buycontainer")}>
									<div className="NmiddleLeftListImg NmiddleLeftListImgFive"></div>
									<span>购买续费</span>
								</div> */}
							</div>
						</div>
						<div className="NmiddleRight">
							{_middle}
						</div>
					</div>
					<div className="msgModal" style={{display:_msgShow}}>
						<p>{_msg}</p>
						<span>{_timeCount}</span>
					</div>
					{this.getQR()}
				</div>
		)
	}
}


