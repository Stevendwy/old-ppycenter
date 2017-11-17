import React, {Component} from 'react'
import {render} from 'react-dom'
import {middleEvents, sendEvent} from './eventmodel'

export default class MiddleRightOne extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imgshow: true,
			dataget: props.bindmes
		}
		this.listtitle=[
			{
				title: '登录帐号：',
				key: 'phone'
			},
			{
				title: '登录密码：',
				key: 'pwd'
			},
			{
				title: '用户姓名：',
				key: 'full_name'
			},
			{
				title: '公司名称：',
				key: 'company'
			},
			{
				title: '所在城市：',
				key: 'city'
			},
			{
				title: '公司类型：',
				key: 'office'
			},
			{
				title: '微信绑定：',
				key: 'binded_wechat'
			}
		]
	}

	componentWillReceiveProps(props) {
		this.setState({dataget: props.bindmes})
	}

	NmiddleRightChangeBtnClick(index, ctrl){
		if(index === 1) this.props.BtnShow(false)
		else {
			if(ctrl === '绑定微信') this.props.showQR(true)
			else getAjax('/wechat/bind/unbundling', null, res => {
				alert('微信解绑成功')
				this.props.updateUserInfo()
			})
		}
	}

	handleImageError(){
		this.setState({
			imgshow:false
	    })
	}

	btnClick(){
		var Url2=document.getElementById("biao")
		Url2.select() // 选择对象
		document.execCommand("Copy")
	}

	getItems() {
		let _dataget = this.state.dataget
		let _data = _dataget ? _dataget.data : null

		if(this.listtitle.length > 0) return this.listtitle.map((item, index) => {
			let _isFirst = index === 1
			let _isLast = index === this.listtitle.length - 1

			let _value = _data ? _data[item.key] : ''

			let _inputshow = (_isFirst || _isLast) ? "inline-block" : "none"
			let _passWordName = (_isFirst || _isLast) ? "NmiddleRightMessListRight NmiddleRightMessListRightPwd" : "NmiddleRightMessListRight"

			let _ctrl = '修改'
			let _binded = _data ? _data[item.key] === '1' : false
			if(_isLast) {
				if(!_binded) _ctrl = '绑定微信'
				else _ctrl = '解除绑定'
			}

			if(_isLast) {
				if(_binded) _value = _data.wx_nikename
				else _value = '未绑定微信'
			}

			return (
				<div key={index} className="NmiddleRightMessList">
					<div className="NmiddleRightMessListLeft">{item.title}</div>
					<div className={_passWordName}>{_value}</div>
					<div className="NmiddleRightChangeBtn"
					onClick={this.NmiddleRightChangeBtnClick.bind(this, index, _ctrl)}
					style={{display:_inputshow}}>{_ctrl}</div>
				</div>
			)
		})
	}

	render() {
		let _imgsrc = this.state.dataget.qrcode_filename
		let _imgsrccopy = this.state.dataget.promotion_url
		let _imgshow = _imgsrc==""?"none":"flex"
		if (this.state.imgshow==false) {_imgshow="none"}

		return (
			<div className="NmiddleLeftListImgOnehas">
				<div className="center-title">
					账户管理
				</div>
				{this.getItems()}
				{/* <div className="NmiddleRightMessListWorld">
					<div className="NmiddleRightMessListWorldFirst">*专家积分当前规则：</div>
					<div>
						<p>1. 一次有效查询，积1分；</p>
						<p>2. 一次有效反馈，积5分；</p>
						<p>3. 积分有效期，2年。</p>
					</div>
				</div> */}
				{/* <div className="NmiddleRightMessListImg" style={{display:_imgshow}}>
					<span>我的分享邀请码：</span>
					<img src={_imgsrc}
					onError={this.handleImageError.bind(this)}
					/>
					<div className="NmiddleRightMessListImgbottom">
						<input id="biao" className="NmiddleRightMessListImgsrc"  value={_imgsrccopy} />
						<div className="NmiddleRightMessListImgbtn" onClick={this.btnClick.bind(this)}>复制</div>
					</div>
				</div> */}
			</div>
		)
	}
}
