import React, {Component} from 'react'
import {render} from 'react-dom'
import {middleEvents, sendEvent} from './eventmodel'
// import FloatBox from './floatbox'
import Cityselect from "./cityselect"
export default class MiddleRightOne extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imgshow: true,
			dataget: [],
			showFloat: false,
			type: null,
			office: ""
		}
		this.safelisttitle=[
			{
				title: zhEn('登录帐号：',"Username"),
				key: 'username',
				value: '',
				type: ''
			},
			{
				title: zhEn('用户姓名：',"Full name"),
				key: 'full_name',
				value: zhEn('修改',"Edit"),
				type: 'username'				
			},
			{
				title: zhEn('邮箱绑定：',"Email"),
				key: 'email',
				value: zhEn('立即绑定','Add'),
				type: 'email'
				
			},
			{
				title: zhEn('微信绑定：','WeChat'),
				key: 'wx',
				value: zhEn('立即绑定','Add'),
				type: ""
				
			},
			{
				title: zhEn('登录密码：','Password'),
				key: 'passowrd',
				value: zhEn('修改','Edit'),
				type: ""
			},
			{
				title: zhEn('提现密码：','Withdrawal password'),
				key: 'withdrawal_pwd',
				value: zhEn('立即设置','Set your withdrawal password right now'),
				type: ""
				
			},
		]
		this.componylisttitle = [
			{
				title: zhEn('公司名称：','Company name'),
				key: 'company',
				value: zhEn('修改','Edit'),
				type: "componyName"
			},
			{
				title: zhEn('公司LOGO：','Company logo'),
				key: 'company_logo',
				value: zhEn('立即上传','Upload'),
				type: ""				
			},
			{
				title: zhEn('营业执照：','Business license'),
				key: 'license',
				value: zhEn('立即上传','Upload'),
				type: ""
				
			},
			{
				title: zhEn('公司类型：','Company type'),
				key: 'office',
				value: zhEn('修改','Edit'),
				type: "componyType"				
			},
			{
				title: zhEn('所在城市：','City'),
				key: 'city',
				value: zhEn('修改','Edit'),
				type: 'componyCity'				
			},
			{
				title: zhEn('公司地址：','Address'),
				key: 'company_address',
				value: zhEn('立即设置','Edit'),
				type: 'location'
			}
		]
	}

	componentWillMount() {
		this.refashData()
	}

	refashData() {
		postAjax("/user/user_profile",null,res=>{
			this.setState({
				dataget: res
			})
		})
	}

	NmiddleRightChangeBtnClick(index, ctrl){
		if(index === 1) this.props.BtnShow(false)
		else {
			if(ctrl === zhEn('绑定微信','Add Wechat')) this.props.showQR(true)
			else getAjax('/wechat/bind/unbundling', null, res => {
				alertX(zhEn('微信解绑成功','Remove Wechat Successfully.'))
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

	// getItems() {
	// 	let _dataget = this.state.dataget
	// 	let _data = _dataget ? _dataget.data : null

	// 	if(this.listtitle.length > 0) return this.listtitle.map((item, index) => {
	// 		let _isFirst = index === 1
	// 		let _isLast = index === this.listtitle.length - 1
	// 		let _value = _data ? _data[item.key] : ''
	// 		let _inputshow = (_isFirst || _isLast) ? "inline-block" : "none"
	// 		let _passWordName = (_isFirst || _isLast) ? "NmiddleRightMessListRight NmiddleRightMessListRightPwd" : "NmiddleRightMessListRight"
	// 		let _ctrl = '修改'
	// 		let _binded = _data ? _data[item.key] === '1' : false
	// 		if(_isLast) {
	// 			if(!_binded) _ctrl = '绑定微信'
	// 			else _ctrl = '解除绑定'
	// 		}
	// 		if(_isLast) {
	// 			if(_binded) _value = _data.wx_nikename
	// 			else _value = '未绑定微信'
	// 		}
	// 		return (
	// 			<div key={index} className="NmiddleRightMessList">
	// 				<div className="NmiddleRightMessListLeft">{item.title}</div>
	// 				<div className={_passWordName}>{_value}</div>
	// 				<div className="NmiddleRightChangeBtn"
	// 				onClick={this.NmiddleRightChangeBtnClick.bind(this, index, _ctrl)}
	// 				style={{display:_inputshow}}>{_ctrl}</div>
	// 			</div>
	// 		)
	// 	})
	// }

	showFloat(item) {
		if(item.key == "wx") {
			this.props.showQR(true, this.refashData.bind(this))
		}else if(item.key == "passowrd"){
			this.props.BtnShow(false)
		}else if(item.key == "withdrawal_pwd"){
			this.props.BtnShow(false,true)
		}else if(item.key == "office"){
			let data = this.state.dataget.data			
			this.setState({
				showFloat: true,
				type: item.type,
				office: data.office
			})
		} else if(item.key == "company_logo") {

		} else if(item.key == "license"){
		
		} else if(item.key == "city"){
			// 城市点击 英文状态下无效
			if(zhEn(true,false)){
				this.setState({
					showFloat: true,
					type: item.type
				})
			}
		} else {
			this.setState({
				showFloat: true,
				type: item.type
			})
		}
	}
	hiddenFloatBox() {
		this.setState({
			showFloat: false
		})
	}

	unbind(type, e) {
		e.stopPropagation()
		var r=confirm(zhEn("确认取消绑定吗？",'Confirm your operation?'))
		if (r==true) {
			// getAjax()
			if(type == "wx") {
				getAjax('/wechat/bind/unbundling', null, res => {
					alertX(zhEn('微信解绑成功','Remove Wechat Successfully'))
					this.refashData()
				})
			}else {
				postAjax("/user/email_remove",null,res=>{
					alertX(zhEn('邮箱解绑成功','Remove Email Succesfully'))
					this.refashData()					
				})
			}

		}else {

		}
	}

	getSafeItem() {
		let _unbind = this.unbind.bind(this)
		let _dataget = this.state.dataget.data
		if(!_dataget) {
			return
		}
		return (
			this.safelisttitle.map((item, index)=> {
				let content = _dataget[item.key] 
				let baseText = zhEn("修改",'Edit')
				if(!content) {
					baseText = zhEn("立即设置",'Set')
					if(item.key == "email") {
						content = <b>{zhEn("未绑定",'Add email to help secure your account')}</b>
						baseText = zhEn("立即绑定",'Add')
					} else if(item.key == 'wx'){
						content = <b>{zhEn("未绑定",'Add wechat to help secure your account')}</b>						
						baseText = zhEn("立即绑定",'Add')
					} else {
						content = <b>{zhEn("未设置",'Set withdrawal password')}</b>						
						baseText = zhEn("立即设置",'Edit')
					}
				}else {
					if(item.key == "wx") {
						content = _dataget.wx_nikename
						// baseText = <div onClick={this.unbind.bind(this,"wx", e)}>
						baseText = <div onClick = {e => _unbind("wx",e)} style={{lineHeight: zhEn(false,true) ? "17px" : "",textAlign: "right"}}>
										{zhEn('解除绑定','Remove Wechat')}
								   </div>
					}else if(item.key == "email") {

						// onClick={e => _cobyPart(itemvalue, e)
						baseText = <div onClick = {e => _unbind("email",e)}>
										{zhEn('解除绑定','Remove Email')}						
									</div>
					}
				}

				if(index == 0) {
					baseText = ""											
				}
				let _zhEnwidth = "90px"
				if(zhEn(false,true)){
					_zhEnwidth = "150px"
				} 
				return(
					<div className="detail-row-item" key={index}>
						<span style={{"width" : _zhEnwidth}}>{item.title}</span>
						<span>{content}</span>
						<span onClick={this.showFloat.bind(this,item)}>{baseText}</span>				
					</div>
				)
			})
		)
	}
	handleChange(comp) {
		this.gen_base64(comp);           		
	}

	gen_base64(comp) {
		var file = this.refs[comp].files[0];
		let ext = file.name.split(".")[1].toUpperCase();
        // ext = path.substring(extStart,path.length).toUpperCase();  
        //判断图片格式  
        if(ext !== 'PNG' && ext !== 'JPG' && ext !== 'JPEG' && ext !== 'GIF'){  
			alertX(zhEn('请上传正确格式的图片','Please upload image with appropriate format.'))
			return;
		}

		if(file.size > 1000000) {
			alertX(zhEn('请上传小于1M的图片','Please upload image within size of 1M.'))
			return;
		}

		let  r = new FileReader();  //本地预览
        r.readAsDataURL(file);    //Base64
        r.onload = ()=>{
			let imgBase64Data = r.result
			let imgData = imgBase64Data.split("4,")[1]
			postAjax("/user/company_pic_upload", {pic_type:comp, imageData: imgData}, res=> {
				alertX(zhEn("上传成功",'Upload Successfully'))
				this.refashData()
			})
        }
	}
	
	getCompanyItem() {
		let _dataget = this.state.dataget.data
		if(!_dataget) {
			return
		}
		return (
			this.componylisttitle.map((item, index)=> {
				let content = _dataget[item.key]
				let baseText = zhEn("修改",'Edit')
				if(!content) {
					baseText = zhEn("立即设置",'Edit')
					if(item.key == "company_logo") {
						content = <b>{zhEn('未上传','Upload your company logo')}</b>
						baseText= 
							<div className="upload">
								{zhEn('立即上传','Upload')}
								<input
									accept="image/*"
									ref="company_logo" 
									type="file"
									name="upimage"
									onChange={this.handleChange.bind(this,"company_logo")} 
								/>
							</div>
					} else if(item.key == 'license'){
						// content = "未上传"
						content = <b>{zhEn('未上传','Upload your business license')}</b>
						
						baseText = <div className="upload">
									{zhEn('立即上传','Upload')}
										<input
											accept="image/*"
											ref="license" 
											type="file"
											name="upimage"
											onChange={this.handleChange.bind(this,"license")} 
										/>
									</div>
					} else if(item.key == 'office'){
						content = <b>{zhEn('未设置','Select type of your company')}</b>						
					} else if(item.key == 'city'){
						content = <b>{zhEn('未设置','Select where your company based on')}</b>						
					} else if(item.key == 'company_address'){
						content = <b>{zhEn('设置','Enter your address')}</b>						
					}else {
						content = <b>{zhEn('未设置','Enter your address')}</b>	
					}
				}else {
					if(item.key == "company_logo") {
						content = <img src={_dataget.company_logo} alt="公司LOGO"/>
						baseText = <div className="upload">
									{zhEn('修改','Edit')}
										<input
											accept="image/*"
											ref="company_logo" 
											type="file"
											name="upimage"
											onChange={this.handleChange.bind(this,"company_logo")} 
										/>
									</div>
					}else if(item.key == "license"){
						content = <img src={_dataget.license} alt={zhEn("营业执照",'Business license')}/>	
						baseText = <div className="upload">
									{zhEn("修改",'Edit')}
										<input
											accept="image/*"
											ref="license" 
											type="file"
											name="upimage"
											onChange={this.handleChange.bind(this,"license")} 
										/>
									</div>					
					}
				}
				let _zhEnwidth = "90px"
				if(zhEn(false,true)){
					_zhEnwidth = "150px"
					if (index === 4) {
						baseText = ""
					}
				}
				
				return(
					<div className="detail-row-item" key={index}>
						<span style={{"width" : _zhEnwidth}}>{item.title}</span>
						<span>{content}</span>
						<span onClick={this.showFloat.bind(this,item)}>{baseText}</span>				
					</div>
				)
			})
		)
	}

	render() {
// zhEn(,'')
		let _imgsrc = this.state.dataget.qrcode_filename
		let _imgsrccopy = this.state.dataget.promotion_url
		let _imgshow = _imgsrc==""?"none":"flex"
		if (this.state.imgshow==false) {_imgshow="none"}
		return (
			<div className="NmiddleLeftListImgOnehas">
				{/*
				<div className="center-title">
				{zhEn("账户管理",'Account')}
				</div>
				*/}
				
				
				<div className="safety-container">
					<p><b>{zhEn("安全信息",'Personal Info')}</b>
					{/*&nbsp;&nbsp;{zhEn("请尽快完善账户安全信息，更好地保护您的数据安全！",'In order to secure your account, please completing your profile!')}*/}
					</p>			
					{this.getSafeItem()}
				</div>
				<div className="company-container">
					<p><b>{zhEn("公司资料",'Company Info')}</b>
					{/*&nbsp;&nbsp;{zhEn("完善公司资料，享受最优服务！",'Complete your company information，experience premium service!')}*/}
					</p>
					{this.getCompanyItem()}
				</div>
				{
					this.state.showFloat
					? <FloatBox 
						type={this.state.type}
						choosed={this.state.office}
						refash={this.refashData.bind(this)}						
						hidden={this.hiddenFloatBox.bind(this)}/>
					: null
				}
			</div>
		)
	}
}


class FloatBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			baseChoose: props.choosed,
			cityCode: ''
		}
		this.officeArray = ["汽配商", "修理厂", "4s店", "保险公司", "个人", "其他"]
	}


	hidden() {
		this.props.hidden()
	}

	changeChoose(choosed) {
		this.setState({
			baseChoose:choosed
		})
	}

	change(type) {
		let obj = {}
		if(type == "office"){
			obj.profile_type = "office"
			obj.new_profile = this.state.baseChoose
		}else if(type == 'city') {
			obj.profile_type = "city"
			obj.new_profile = this.state.cityCode
		}else if(type == 'email') {
			let email = this.refs[type].value
			var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
			if(reg.test(email)) {
				postAjax("/user/send_verification_email",{email: email}, res=> {
					this.hidden();
					this.props.refash()
					alertX(zhEn("请前往邮箱验证",'Go to verify your Email address'))
				})
			}else {
				alertX(zhEn("请输入格式正确的邮箱",'Enter correct Email address'))
			}
			return;
		}else{
			obj.profile_type = type
			obj.new_profile = this.refs[type].value
		}
		postAjax("/user/profile_edit", obj, res=>{
			this.hidden();
			this.props.refash()
			alertX(zhEn("修改成功",'Edit Successfully'))
		})
	}
// {zhEn("",'')}
	backCode(code) {
		// console.log(code)
		this.setState({
			cityCode: code
		})
	}

	getContent() {
		if(zhEn(false,true)){
			this.officeArray = ["Parts Trader", "Auto Repair Shop", "Auto Trader", "Insurance Company", "Personal", "Other"]
		}
		let content
		let baseChoose
		switch(this.props.type) {
			case "password": 
				break;
			case "moneypassword":
				break;
			case "username": 
				return(
					<div className="userName">
						<div className="title">{zhEn("修改用户姓名",'Edit your name')}</div> 
						<input type="text" ref="full_name" placeholder={zhEn("输入用户姓名",'Enter your name.')}/>
						<div className="submit" onClick={this.change.bind(this,"full_name")}>
						{zhEn("确认",'Confirm')}
							<div className="submit-loading" onClick={(e)=>{e.stopPropagation()}}>
								
							</div>
						</div>
					
					</div>
				)
				break;
			case "email":
				return(
					<div className="email">
						<div className="title">{zhEn("绑定邮箱",'Add Email')}</div> 
						<input type="text" ref="email" placeholder={zhEn("输入邮箱地址",'Enter email address')}/>
						<div className="submit" onClick={this.change.bind(this,"email")}> 
						{zhEn("确认",'Confirm')}
							<div className="submit-loading" onClick={(e)=>{e.stopPropagation()}}>
								
							</div>
						</div>

						<span>
						{zhEn("*点击确认按钮，我们将会向您所填写的邮箱发送一封邮件，",'* Click confirm and you will receive a verification email in your mailbox.')}<br/>
						{zhEn("您需要前往邮箱点击邮件内的链接以完成绑定。",'Go to the mailbox and click the link in the mail to complete this process.')}
						</span>
					</div>
				)
				break;
			case "componyName":
				return(
					<div className="componyName">
						<div className="title">{zhEn("修改公司名称",'Edit company name')}</div>
						<input type="text" ref="company" placeholder={zhEn("输入公司名称",'Enter company name')}/>
						<div className="submit" onClick={this.change.bind(this,"company")}>
						{zhEn("确认",'Confirm')}
							<div className="submit-loading" onClick={(e)=>{e.stopPropagation()}}>
								
							</div>
						</div>
					</div>
				)
				break;
			case "componyType":
				return(
					<div className="componyType">
						<div className="title">{zhEn("修改公司类型",'Edit company type')}</div>
						<div className="inputitems">
							{
								this.officeArray.map((item,index)=>{
									return(
										<div className={this.state.baseChoose==item ? "type-item active":"type-item"} key={index} onClick={this.changeChoose.bind(this,item)}>
											{item}
										</div>
									)
								})
							}
						</div>
						<div className="submit" onClick={this.change.bind(this,"office")}>
						{zhEn("确认",'Confirm')}
							<div className="submit-loading" onClick={(e)=>{e.stopPropagation()}}>
								
							</div>
						</div>
					</div>
				)
				break;
			case "componyCity":
				return(
					<div className="componyCity">
						<div className="title">{zhEn("修改所在城市",'Edit city')}</div> 
						<div className="city-box">
							<Cityselect backcode={this.backCode.bind(this)}/>
						</div>
						<div className="submit" onClick={this.change.bind(this,"city")}>
						{zhEn("确认",'Confirm')}
							<div className="submit-loading" onClick={(e)=>{e.stopPropagation()}}>
								
							</div>
						</div>
					</div>
				)
				break;
			case "location":
				return(
					<div className="location">
						<div className="title">{zhEn("修改公司地址",'Edit company address')}</div>
						<div className="textAreaContainer">
							<textarea name="location" ref="company_address" id="" cols="30" rows="10" placeholder={zhEn("输入公司地址",'Enter company address')}></textarea>
						</div>
						<div className="submit" onClick={this.change.bind(this,"company_address")}>
						{zhEn("确认",'Confirm')}
							<div className="submit-loading" onClick={(e)=>{e.stopPropagation()}}>
								
							</div>
						</div>
					</div>
				)
				break;
		}
		// return content;
	}

	render() {

		return(
			<div className="float-container">
				<div className="float-box">
					<span className="close" onClick={this.hidden.bind(this)}>
						<img src="https://cdns.007vin.com/img/user_close.png" alt="close"/>
					</span>
					{this.getContent()}
				</div>
			</div>
			
		)
	}
}