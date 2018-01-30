import React, {Component} from 'react'
import FloatWindow from './floatwindow'
import UserAgreement from './useragreement'
import UserAgreementen from './useragreementen' 

export default class Bottom extends Component {
	constructor() {
		super()
		this.state = {
			showUserAgreement: 'none'
		}
	}

	userAgreementClick() {
		this.setState({
			showUserAgreement: 'block'
		})
	}

	render() {
		let _showUserAgreement = this.state.showUserAgreement
		let _userAgreementClick = this.userAgreementClick.bind(this)
		let _title = "用户协议"
		let _Copyright = "版权所有"
		if (zhEn(false,true)) {
			_title = "User Agreement"
			_Copyright = "Copyright"
		}

		
		return (
			<div className="BottomContainer">
					{zhEn(<FloatWindow 
						title={_title}
						img={ cdnHost+'/img/icon_san.png'}
						show={_showUserAgreement}
						hiddenEvent={() => {
							this.setState({
								showUserAgreement: 'none'
							})
						}}
						content={<UserAgreementen />}
					/>,
					<FloatWindow 
						title={_title}
						img={ cdnHost+'/img/icon_san.png'}
						show={_showUserAgreement}
						hiddenEvent={() => {
							this.setState({
								showUserAgreement: 'none'
							})
						}}
						content={<UserAgreement />}
					/>)}
					
				    <div className="BottomContentContainer">
				     <span onClick={()=>{window.open( "http://www.peipeiyun.com/")}} style={{cursor: 'pointer'}}>{zhEn("关于我们","About Us")}</span>
				     <span onClick={_userAgreementClick} style={{cursor: 'pointer'}}>{zhEn("用户协议","User Agreement")}</span>
				     <div>
				      © 2016-2017 007vin.com  <span onClick={()=>{window.open("http://www.miitbeian.gov.cn/")}} style={{cursor: 'pointer'}}> {_Copyright} ICP证：浙17026959号-2</span> 
				     </div>
				    </div>
			</div>
		)
	}
}