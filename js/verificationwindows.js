import React, {
	Component
} from 'react'
import {
	render
} from 'react-dom'

export default class VerificationWindows extends Component {
	constructor(props) {
		super(props)
		this.waitTime = 60 //这里修改等待时间
		this.state = {
			selfshow: true,
			hiddenSelf: true,
			surplusNumber: this.waitTime,
			passwordsureWord: "字母与数字组合，6位以上",
			buttonWait: true,
			inputvalue: "",
			inputpassnum: "",
			inputpassnew: ""
		}
		this.interval = null
	}

	componentDidMount() {

	}

	componentWillReceiveProps(props) {
		this.setState({
			selfshow: props.show
		})
	}
	okbtn() {		
		var _newmess = ""
		let _surenum = this.refs.surenum.value
		let _passwords = this.refs.passwords.value
		let _passwordsure = this.refs.passwordsure.value
		if (_passwords == "" || _passwordsure == "" || _surenum == "") {
			return
		}

		if (_passwords !== _passwordsure) {
			_newmess = "两次密码输入不一致"
			this.props.verificBack(false, _newmess)
			return
		}

		this.setState({
			hiddenSelf: true
		}, () => {
			if(this.props.special){
				let _url = '/user/payspwd/modify'
				let _obj ={
					sms_code: _surenum,
					password: _passwords,
				}
				postAjax(_url,_obj,res=>{
					if (res.code == 1) {
						_newmess = "提现密码设置成功"
						clearInterval(this.interval)
						this.state.surplusNumber = this.waitTime
						this.setState({
							buttonWait: true,
							inputvalue: "",
							inputpassnum: "",
							inputpassnew: ""
						})					
						if(window.pwdSuccCallback){
							window.pwdSuccCallback()							
						}
					} else {
						_newmess = res.msg
					}
					this.props.verificBack(true, _newmess)
				})
			}else{
				let _uri = '/user/pwdmodify'
				let _obj = {
					sms_code: _surenum,
					pwd1: _passwords,
					pwd2: _passwordsure
				}
				postAjax(_uri, _obj, res => {
					if (res.code == 1) {
						_newmess = "密码修改成功"
						clearInterval(this.interval)
						this.state.surplusNumber = this.waitTime
						this.setState({
							buttonWait: true,
							inputvalue: "",
							inputpassnum: "",
							inputpassnew: ""
						})
					} else if (res.code == 4) {
						_newmess = "密码格式错误"
					} else {
						_newmess = "短信验证码不正确"
					}
					this.props.verificBack(true, _newmess)
					//					this.restart()
				})
			}


		})
	}
	restart() {
		if (!this.state.buttonWait) return
		this.setState({
			surplusNumber: this.waitTime,
			buttonWait: false
		})
		//执行倒计时和发送验证码
		let _uri = '/smsloggedin'
		getAjax(_uri, "", res => {
			// console.log(res+"验证码")
			//					this.restart()
		},true)
		this.interval = setInterval(() => {
			let _surplusNumber = this.state.surplusNumber
			if (_surplusNumber <= 1) {
				clearInterval(this.interval)
				this.state.surplusNumber = this.waitTime
				this.setState({
					buttonWait: true
				})
				return
			}
			this.setState({
				surplusNumber: --_surplusNumber,
				buttonWait: false
			})
		}, 1000)
	}
	change() {
		let _surenum = this.refs.surenum.value
		let _passwords = this.refs.passwords.value
		let _passwordsure = this.refs.passwordsure.value
		this.setState({
			inputvalue: _surenum,
			inputpassnum: _passwords,
			inputpassnew: _passwordsure
		})
	}

	hidden() {
		clearInterval(this.interval)
		this.state.surplusNumber = this.waitTime
		this.setState({
			hiddenSelf: true,
			buttonWait: true,
			inputvalue: "",
			inputpassnum: "",
			inputpassnew: ""
		})
		this.props.verificBack(true, false)
	}

	render() {
		let _okbtn = this.okbtn.bind(this)
		let _hidden = this.hidden.bind(this)
		let _restart = this.restart.bind(this)
		let _buttonWait = this.state.buttonWait
		let _passwordsureWord = this.state.passwordsureWord
		let _buttonContent = _buttonWait ? '获取验证码' : (this.state.surplusNumber + 's 后重发')
		let _buttonVerificationClass = 'button_verification'
		if (_buttonWait) {
			_buttonVerificationClass += ' wait'
		}
		let _sentto = "验证码发送至 " + this.props.phonenum
		//输入显示内容
		let _inputvalue = this.state.inputvalue
		let _inputpassnum = this.state.inputpassnum
		let _inputpassnew = this.state.inputpassnew
		let _show1 = _inputvalue.length >= 1 ? "block" : "none"
		let _show2 = _inputpassnum.length >= 1 ? "block" : "none"
		let _show3 = _inputpassnew.length >= 1 ? "block" : "none"
	
		let _title = this.props.special ? "手机验证设置提现密码":"修改密码"
		let _password = this.props.special ? "设置提现密码":"新密码"
		let _passwordsure = this.props.special ? "确认提现密码":"修改密码"
		return (
			<div className='container_verification_window' style={{ display: this.state.selfshow ? 'none' : 'flex' }}>
				<div className='container_content'>
					<span className='title'>{_title}</span>
					<span className='remind'>{_sentto}</span>
					<div>
						<span className='short_span'>验证码</span>
						<input type="text" name="texthidden" style={{ display: "none" }} />
						<input
							type="text"
							value={_inputvalue}
							className='short'
							autoComplete="off"
							placeholder='6位数字'
							onChange={this.change.bind(this)}
							ref="surenum" />
						<div className='clear inputvalue' style={{ display: _show1 }}
							onClick={() => {
								this.setState({
									inputvalue: ""
								})
								this.refs.surenum.value = ''
							}}></div>
						<button className={_buttonVerificationClass} onClick={_restart}>{_buttonContent}</button>
					</div>
					<div>
						<span>{_password}</span>
						<input type="password" name="passwordhidden" style={{ display: "none" }} />
						<input type="password"
							className='long'
							autoComplete="off"
							value={_inputpassnum}
							placeholder='字母与数字组合，6位以上'
							onChange={this.change.bind(this)}
							ref="passwords" />
						<div className='clear inputpassnum' style={{ display: _show2 }}
							onClick={() => {
								this.setState({
									inputpassnum: ""
								})
								this.refs.passwords.value = ''
							}}></div>
					</div> 
					<div>
						<span>{_passwordsure}</span> 
						<input type="password"
							className='long'
							autoComplete="off"
							value={_inputpassnew}
							placeholder={_passwordsureWord}
							onChange={this.change.bind(this)}
							ref="passwordsure" />
						<div className='clear inputpassnew'
							 style={{display: _show3}}
							 onClick={() => {
									this.setState({inputpassnew: ""})
									this.refs.passwordsure.value = ''
							 }}> 
						</div> 
					</div > 
					<button className='goto_pay'
							onClick={_okbtn}>
						确认
					</button>
					<button className='close'
							onClick={_hidden}> 
					</button> 
				</div> 
			</div>
		)
	}
}