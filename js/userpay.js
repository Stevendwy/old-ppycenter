import React, {
	Component
} from 'react'
import PropTypes from 'prop-types'
export default class UserPay extends Component {
	constructor(props) {
		super(props)
		this.state = {
			headerTitles: props.headerTitles,
			footerData: [],
			activeIndex: "",
			fatherIndex:"",
			paymoney: "",
			type: "",
			brandExtMsg: "",
			paytype: "wechat",
			discount_num: 0,
			payBrand:"",
			payTitle:"",
			isSucc: false,
			errorTitle: "",
			isDisable: false
		}
		this.isSure = false;
		this.hashDisable = [] 
	}

	componentWillMount() {
		getAjax("/order/commodity", "", response => {
			let _activeIndex = 0
			let _fatherIndex = 0
			for(let i = 0 ;i < response.data.length ; i++) {
				let item = response.data[i]
				for(let j = 0;j < item.data.length ; j++) { 
					if(item.data[j].showHot) {
						_activeIndex = j
						_fatherIndex = i
						if(!item.data[j].coupon_enable) {
							this.setState({
								isDisable: true
							})
						}
					}
					if(!item.data[j].coupon_enable){
						let key = i + "" + j;
						this.hashDisable[key] = true
					}
				}
			}
			this.setState({
				footerData: response.data,
				activeIndex: _activeIndex,
				fatherIndex:_fatherIndex,
				paymoney: response.data[_fatherIndex].data[_activeIndex].contents[2],
				payBrand: response.data[_fatherIndex].data[_activeIndex].contents[1] ? (response.data[_fatherIndex].data[_activeIndex].contents[0] + "(" +response.data[_fatherIndex].data[_activeIndex].contents[1]+ ")" ) : response.data[_fatherIndex].data[_activeIndex].contents[0],
				type: response.data[_fatherIndex].data[_activeIndex].id,
				brandExtMsg: response.data[_fatherIndex].data[_activeIndex].contents[1],
				payTitle: response.data[_fatherIndex].title			
			})
		})
	}
	payTypeClick(type){
		this.setState({
			paytype: type
		})
	}
	
	toPay(){
		if(this.lastMoney) {
			getAjax("/order/purchase", {id:this.state.type}, res=>{
				if(res.enable){
					sessionStorage.setItem('priceType', this.state.type);
					sessionStorage.setItem("payType", this.state.paytype);
					sessionStorage.setItem("brandExtMsg", this.state.brandExtMsg);
					let value = ""
					if(!this.state.isDisable){
						if(this.isSure){
							value = this.refs.codeInput.value				
						}
						sessionStorage.setItem("coupon_num",value)
					}else {
						sessionStorage.setItem("coupon_num", "")
					}
					location.href = "?/loop=buy"
				}else{
					alert(zhEn("你的试用机会已用完",'Your trail purchasing has exceed limit.'))
				}
			})
		}else {
			alert(zhEn("支付金额不能为0",'Illegal Payment'))
		}
	}
// {zhEn('复制','copy')}
	pay(fatherIndex,index){
		// let title = "" 
		// if(fatherIndex == 0){
		// 	title = "试用套餐"
		// }else if(fatherIndex == 1){
		// 	title = "月卡套餐"
		// }else{
		// 	title = "年卡套餐"
		// }
		// debugger;

		let key = fatherIndex + '' + index
		let _isDisable;
		if(this.hashDisable[key]) {
			_isDisable = true;
		}else {
			_isDisable = false
		}
		this.setState({
			isDisable: _isDisable
		},()=>{
			let datas = this.state.footerData[fatherIndex].data[index].contents
			this.setState({
				activeIndex: index,
				fatherIndex: fatherIndex,
				paymoney: datas[2],
				payBrand: datas[1] ? datas[0] + `(${datas[1]})` : datas[0],			
				type: this.state.footerData[fatherIndex].data[index].id,
				brandExtMsg: datas[1],
				payTitle: this.state.footerData[fatherIndex].title
			})
		})
	}

	inputChange(){
		let valueLength = this.refs.codeInput.value.length;
		let _isSucc = ""
		let _errorTitle = ""
		let _discount_num = "0"
		let _calculateType = ""
		this.isSure = false
		if(valueLength > 5){
			_isSucc = true
		}else{
			_isSucc = false
		}
		this.setState({
			isSucc: _isSucc,
			errorTitle: _errorTitle,
			discount_num: _discount_num,
			calculateType: _calculateType
		})
	}

	toActive(){
		if(this.state.isDisable){
			alert(zhEn("此商品不能优惠劵",'Voucher is unaviable for this product.'))
			return;
		}
		let value = this.refs.codeInput.value
		if(this.state.isSucc){
			getAjax("/pays/coupon/detail",{coupon_num:value},res=>{
				if(res.data.status == 1){
					this.setState({
						discount_num: res.data.discount_num,
						calculateType: res.data.type,
						errorTitle: res.data.title
					})
					this.isSure = true;
				}else{
					this.setState({
						errorTitle: res.data.title,
					})
					this.isSure = false;
				}
			})
		}
	}

	render() {
		let _headerTitles = this.state.headerTitles
		let _footerData = this.state.footerData
		let _activeIndex = this.state.activeIndex
		let _fatherIndex = this.state.fatherIndex
		let _paymoney = this.state.paymoney
		let alipay_url = this.state.paytype =="alipay" ? "/img/icon_select.png" : "/img/icon_unselected.png"
		let wechat_url = this.state.paytype =="alipay" ? "/img/icon_unselected.png" : "/img/icon_select.png"
		let text = this.state.paytype == "alipay" ? zhEn("确认使用支付宝付款" ,'CHECKOUT SECURELY'): zhEn("确认使用微信付款",'CHECKOUT SECURELY')
		// let lastMoney = (this.state.paymoney - this.state.discountMoney) > 0 ?
		let totalMoney;
		let tureMoney = this.state.paymoney;
		
		if(!this.state.isDisable){
			if(this.state.calculateType == "proportion"){
				totalMoney = tureMoney * this.state.discount_num
				totalMoney = totalMoney.toFixed(2);
		
			}else{
				totalMoney = tureMoney - this.state.discount_num
				totalMoney = totalMoney.toFixed(2);				
			}
		}else {
			totalMoney = tureMoney
		}
		
		this.lastMoney =  totalMoney > 0 ? totalMoney : 0
		return (
			<div className="userpay-container">
				<div className="userpay-title">
				{zhEn('购买续费','Purchase/Renew Membership')}
				</div>
				<div className="container-head">
					<div> 
					{zhEn('第一步：选择套餐类型','Step 1：Choose A Deal')}
					</div>
					<div>
					{zhEn('第二步：选择支付方式','Step 2：Select Payment Method')}
					</div>
				</div>
				<div className="container-main">
					<div className='container-list'>
						{/* <Header
							headerTitles={_headerTitles} /> */}
						<Footer
							footerData={_footerData}
							activeIndex={_activeIndex} 
							fatherIndex={_fatherIndex}
							pay={this.pay.bind(this)}
						/>
					</div>
					<div className='container-right'>
						<div className='pay-money-title'>
							<div className="buy-type-box">
								<span>
								{zhEn('套餐类型：','Package Type：')}{this.state.payTitle}
								</span>
								<span>
								</span>
							</div>
							<div className="brand-type-box">
								<span>
									<b>
									{zhEn('使用内容：','Brand Coverd：')}
									</b>
									<span>
										{this.state.payBrand}
									</span>
								</span>
								<b className="total-money-box">
									￥{_paymoney}
								</b>
							</div>
						</div>
						
						<div className="pay-code-container">
							<div className={this.state.isSucc ? "big-sale-box active":"big-sale-box"}>
								<input onChange={this.inputChange.bind(this)} className="big-sale-code" placeholder={zhEn("输入优惠码",'Enter Voucher')} ref="codeInput" type="text"/>
								<span className="to-active-button" onClick={this.toActive.bind(this)}>{zhEn('激活并使用','Activate')}</span>
							</div>
							<div className="big-sale-ex">
								<span className="msg-ex">
								{zhEn('如何获取优惠码？','How to get voucher?')}
									<div className="msg-data-hover">
									{zhEn('优惠码来源：','')}<br/>
									{zhEn('1.个人中心-我的优惠码； ','1. My account > Voucher')}<br/>
										{/* 2.向其他零零汽用户索取；<br/> */}
										{zhEn('2.向零零汽市场人员索取。','2. Ask 007vin seller for voucher.')}<br/>
									</div>		
								</span>
								<div className="error-ex-box">
									{this.state.isDisable ? zhEn("不能使用优惠劵","This voucher is unavaibale.") : this.state.errorTitle}
								</div>
							</div>
						</div>
						<div className='pay-money'>
							<span>{zhEn('应付金额：','Total:')}</span>
							<span className="money-detail">￥{this.lastMoney}</span>
						</div>
						<div className="choose-pay">
							<div onClick={this.payTypeClick.bind(this,"wechat")}>
								<img src="/img/p_wechat.png" alt=""/>	
								<img src={wechat_url} alt=""/>
							</div>	
							<div onClick={this.payTypeClick.bind(this,"alipay")}>
								<img src="/img/p_alipay.png" alt={zhEn("支付宝",'Alipay')}/>
								<img src={alipay_url} alt=""/>
							</div>					
						</div>
						<div className="media-button">
							<div className="media-pay-button" onClick={this.toPay.bind(this)}>{text}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class Header extends Component {
	render() {
		let _headerTitles = this.props.headerTitles
		return (
			<div className='header'>
				<Row titles={_headerTitles} />
			</div>
		)
	}
}

class Footer extends Component {

	pay(fatherIndex,index) {
		// sessionStorage.setItem('priceType', index);
		// location.href = "/pays/wxpage"
		this.props.pay(fatherIndex,index)
	}
	
	getItems(){
		let item =	this.props.footerData.map((item,index)=>{
				let classChoose = index < 3 ? "item-type-container" : "item-container"
				// let msg = index == 0 ? "试用版" : item.title
				// msg = index == 1 ? "月卡版" : msg
				// msg = index == 2 ? "豪华版" : msg
				let msg = item.title
				return( <div key={index} className={classChoose}>
					<div className="item-title">
						{msg}
					</div>
					<div className="item-group">
						{this.getRows(item.data,index)}
					</div>
				</div>
				)
			})
		return item
	}
	getRows(items,fatherIndex) {
		// console.log(items)
		let _rows = items.map((item, index) => {
			// console.log(item)
			let _active = false
			if(this.props.fatherIndex==fatherIndex && this.props.activeIndex==index){
				_active = true
			}
			return (
				<Row key={index}
					active = {_active}
					click={this.pay.bind(this,fatherIndex,index)}
					tagImgShow={item.activity_tag}
					dateType = {item.type}
					titles={item.contents} />
			)
		})
		return _rows
	}

	render() {
		return (
			<div className='footer'>
				{this.getItems()}
			</div>
		)
	}
}

class Row extends Component {
	render() {
		let _rowData = this.props.titles
		let _tagImgShow = this.props.tagImgShow
		let _pay = this.props.click
		let _active = this.props.active ? "active":""
		let _src = this.props.active ? "/img/icon_select.png" : "/img/icon_unselected.png"
		let _dateType = this.props.dateType == "day" ? zhEn("/当日",'/today') : (this.props.dateType == "month" ? zhEn("/月",'/month') : zhEn("/年",'/year'))
		return (
			<div className={'container-row '} onClick={_pay}>
				<div className='column'>
					<span>{_rowData[0]}<b>{ _rowData[1] ? `(${_rowData[1]})` : "" }</b> </span>
					<img className='hot' src={'/img/hot.png'} alt='hot'
						style={{display: _tagImgShow ? 'block' : 'none'}} />
				</div>
				{/* <div className='column'>
					<span>{_rowData[1]}</span>
				</div> */}
				<div className='column'>
					<span>￥{_rowData[2]+_dateType}
						<b>
							{_rowData[3] ? "￥"+_rowData[3] + _dateType : ""}
						</b>
					</span>
				</div>
				<div className='column'>
					<img src={_src} alt=""/>
				</div>
			</div>
		)
	}
}