import React, {
	Component
} from 'react'

export default class VerificationWindows extends Component {
	constructor() {
		super()
		this.waitTime = 60 //这里修改等待时间
		this.state = {
			hiddenSelf: false,
			surplusNumber: this.waitTime,
			buttonWait: true
		}
		this.interval = null
	}

	componentDidMount() {
		// console.log("aaaa")
		this.restart()
			// console.log("bbbbbb")
	}

	componentWillReceiveProps(props) {
		if (props.show) {
			this.setState({
				hiddenSelf: false
			}, () => {
				let _uri = '/smscode'
				let _obj = {
					mobile: props.registRequest.username,
					type: 1
				}
				postAjax(_uri, _obj, res => {
					this.restart()
				})
			})
		}
	}

	restart() {
		if (!this.state.buttonWait) return
		this.setState({
			surplusNumber: this.waitTime,
			buttonWait: false
		})
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

	hidden() {
		this.setState({
			hiddenSelf: true
		})
	}

	render() {
		let _hidden = this.hidden.bind(this)
		let _restart = this.restart.bind(this)
		let _buttonWait = this.state.buttonWait
		let _buttonContent = _buttonWait ? '获取验证码' : (this.state.surplusNumber + 's 后重发')
		let _buttonVerificationClass = 'button_verification'
		if (_buttonWait) {
			_buttonVerificationClass += ' wait'
		}

		return (
			<div className='container_verification_window' style={{display: this.state.hiddenSelf ? 'none' : 'flex'}}>
				<div className='container_content'>
					<span className='title'>注册验证</span>
					<span className='remind'>验证码发送至 123****3211</span>
					<div>
						<span className='short_span'>验证码</span>
						<input className='short' placeholder='6位数字' />
						<button className={_buttonVerificationClass} onClick={_restart}>{_buttonContent}</button>
					</div>
					<div>
						<span>新密码</span>
						<input className='long' placeholder='字母与数字组合，6位以上' />
					</div>
					<div>
						<span>确认新密码</span>
						<input className='long' placeholder='字母与数字组合，6位以上' />
					</div>
					<button className='goto_pay'>确认</button>
					<button className='close' onClick={_hidden}></button>
				</div>
			</div>
		)
	}
}