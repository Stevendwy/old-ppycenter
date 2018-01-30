import React, { Component } from 'react'
import MiddleRightOne from './middlerightmess'
import { render } from 'react-dom'
import Pagination from 'pagination-react'
export default class MiddleVipDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            brandrole: [],
            moneyDetailShow: this.props.detailShow || false,
            moneyListShow: false,
            total_balance: "",
            balance: "",
            has_password: false,
            moneyListData: [],
            total_page: 1,
            rememberIndex: 3
        }
        window.pwdSuccCallback = this.pwdSuccCallback.bind(this)
    }
    componentWillReceiveProps(props) {
        if(props.detailShow) {
            this.toMoneyClick();            
        }
    }

    componentWillMount(){
       this.updateMoneyFlash()
    }

    updateMoneyFlash(){
        getAjax("/account/balance/detail","",res=>{
            this.setState({
                total_balance: res.data.total_balance,
                balance: res.data.balance,
                has_password: res.data.has_password
            })
            this.props.updataMoney(res.data.total_balance)
        })
    }
    
    componentDidMount() {
        getAjax("/users/brandrole", "", res => {
            this.setState({
                brandrole: res.data
            })
        })
    }

    coby(code) {
        let oDiv = document.createElement('textarea');
        oDiv.value = code;
        oDiv.innerHTML = code;
        document.body.appendChild(oDiv)
        oDiv.select();
        document.execCommand("Copy")
        document.body.removeChild(oDiv)
    }

    toMoneyClick() {
        this.setState({
            moneyDetailShow: true
        })
    }

    toMiddleContainer() {
        this.setState({
            moneyDetailShow: false,
            moneyListShow: false

        })
    }

    moneySubmit() {
        let money = this.refs.moneyInput.value
        let password = this.refs.passwordInput.value
        if(!this.state.has_password){
            alert(zhEn("请先设置提现密码","Please set the withdrawal password first."))
            return
        }
        // if (money == "") {
        //     return;
        // } else if (money > this.state.balance) {
        //     alert("提现金额不得大于可提现金额")
        //     return
        // } else if (money > 1000) {
        //     alert("受微信红包政策影响，每日提现总金额不得超过1000元")
        //     return
        // }
        // if (password == "") {
        //     alert("请输入提现密码")
        //     return
        // }

        postAjax("/account/balance/draw",{amount:money,password:password},res=>{
           this.updateMoneyFlash()   
            alert(zhEn("提现成功","Withdrawal Success"))
        })

    }

    toMoneyList() {
        getAjax("/account/balance/history",{page:1,size:10},res=>{
            this.setState({
                moneyListData: res.data,
                moneyListShow: true,
                total_page: res.total_page
            })
        })
    }

    getList() {
        let keydata = ["serial", "reason", "creattime", "amount", "type", "remark"]
        // let data = [
        //     { code: 234, type: "微信红包", time: "2017-09-09 10:23", count: "-100", status: "转入" },
        //     { code: 234, type: "微信红包", time: "2017-09-09 10:23", count: "-100", status: "转入" },
        //     { code: 234, type: "微信红包", time: "2017-09-09 10:23", count: "-100", status: "转入" },
        //     { code: 234, type: "微信红包", time: "2017-09-09 10:23", count: "-100", status: "转入" },
        // ]
        let content = this.state.moneyListData.map((item, index) => {
            return (
                <div className="list-main-row" key={index}>
                    {
                        keydata.map((it, ins) => {
                            return (
                                <div className="list-main-cell" key={ins}>
                                    {item[it]}
                                </div>
                            )
                        })
                    }
                </div>

            )
        })
        return content
    }

    showFloatPassword(){
        this.props.BtnShow(false, true)
    }

    pwdSuccCallback(){
        this.setState({
            has_password: true
        })
    }
    //分页
    getData(index) {
        getAjax("/account/balance/history",{page:index,size:10},res=>{
            this.setState({
                moneyListData: res.data
            })
        })
    }



    wxdata(){
         if(this.props.bindmes.data){
            return(
                this.props.bindmes.data.binded_wechat === '1' ? 
                <span>{this.props.bindmes.data.wx_nikename}
                    <b onClick={()=>{
                        getAjax('/wechat/bind/unbundling', null, res => {
                            alert(zhEn('微信解绑成功',"Remove Successfully."))
                            this.props.updateUserInfo()})  
                        }}>
                        {zhEn("解除绑定","Remove Wechat")}
                    </b>
                </span> :
                <span onClick={() => this.props.showQR(true)}>{zhEn("您还没有绑定微信","Your account is unlinked to Wechat")} <b>{zhEn("绑定微信","Add Wechat")}</b></span>    
            )
        }    
    }
    toggle(flag) {
        if(flag === "展开全部") {
            this.setState({
                rememberIndex: this.state.brandrole.length-1
            })
        } else if(flag === "收起全部"){
            this.setState({
                rememberIndex: 3
            })
        }
    }
// {zhEn("","")}
    render() {
        let _zhEn = zhEn(false, true)
        let _vipmiddlefloat = "vip-middle-float"
        let _bgimg = "/img/tickey_null.png"
        let _moneyListTitle = ["流水号", "红包", "时间", "收支金额", "类型", "备注"]
        let _marginLeft = "85px"
            if(_zhEn){
                _marginLeft = "40px"
                _bgimg = "/img/tickey_null_en.png"
                _vipmiddlefloat = "vip-middle-float vip-middle-float-en"
                _moneyListTitle = ["Serial Number", "Redpack", "Time", "Amount", "Type", "Notes"]
            }
        let _role = this.state.brandrole.map((item, index) => {
            let _hiddenClass = ""
            let _text = ""
            if(this.state.brandrole.length > 3) {
                if(this.state.rememberIndex === index) {
                    if(index === 3) {
                        _text = "展开全部"
                    }else {
                        _text = "收起全部"
                    }
                }
                if(index > this.state.rememberIndex) {
                    _hiddenClass = " hidden"
                }
            }
            return (
                <div className={"list-item" + _hiddenClass} key={index}>
                    <div>{item.name}</div>
                    <div>{item.valid_datetime}</div>
                    <div onClick={this.toggle.bind(this, _text)}>
                        <span>{
                            zhEn(_text, _text==="展开全部"? "Show All" : (_text ==="收起全部" ? "Hide All" : ""))
                        }</span>
                    </div>
                </div>
            )
        })

        let _url = this.props.data.promotion_url
        let _moneyShow = this.state.moneyDetailShow ? "" : " hidden"
        let _mainShow = this.state.moneyDetailShow || this.state.moneyListShow ? " hidden" : ""
        let _moneyListShow = this.state.moneyListShow ? "" : " hidden"
        return (
            <div className="middle-vip-container">
                <div className={"middle-main-container" + _mainShow} >
                    <div className="vip-middle-box">
                        <div className="vip-rules-box">
                            <div className="vip-title">
                            {zhEn("会员权益","Privilege")}
                            </div>
                            <div className="user-score">
                                <div className="user-score-container">
                                    <span> {zhEn("我的积分：","My points:")}{this.props.score}
                                        <div className="badge-iocn">?
                                            <div className="container-rule-title">
                                                <div>{zhEn("*当前积分规则：","* Rules:")}</div>
                                                {zhEn("1. 一次有效查询，积1分；","1. 1 pont/query.")}<br />
                                                {zhEn("2. 一次有效反馈，积5分；","2. 5 points/feedback")}<br />
                                                {zhEn("3. 积分有效期，2年。","3. points valid for 2 years.")}
                                            </div>
                                        </div>
                                    </span>

                                    {/* <div className="operation-container"><span>兑换</span><span>查看明细</span></div> */}

                                </div>
                                <div className="total-money-container">
                                    <span> {zhEn("我的现金：","Balance: ")}￥{this.state.total_balance} <div className="null-div"></div>
                                    </span>
                                    <div className="operation-container" style={{marginLeft:_marginLeft}}>
                                        <span onClick={this.toMoneyList.bind(this)}>{zhEn("查看明细","Check details")}</span>
                                    </div>                               
                                </div>
                                <div className="user-money-container">
                                    <span> {zhEn("可提现金额： ￥","Avaiable Balance: ￥")}{this.state.balance}
                                        <div className="badge-iocn">?
                                            <div className="container-rule-title">
                                                <div>{zhEn("*可提现金额规则：","* Withdrawal rule:")}</div>
                                                {zhEn("当日获得现金次日可提现","You can withdraw cash on next day.")}<br/>
                                            </div>
                                        </div>
                                    </span>
                                    <div className="operation-container" style={{marginLeft:_marginLeft}}><span onClick={this.toMoneyClick.bind(this)}>{zhEn("提现","Withdrawal")}</span>
                                    {/* <span onClick={this.toMoneyList.bind(this)}>查看明细</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="data-list-container">
                            <div className="data-list-title">
                                <div>{zhEn("品牌套餐","Brand package")}</div>
                                <div>
                                {/* {zhEn("使用期限","Expires")} */}
                                </div>
                            </div>
                            <div className="data-list-item">
                                {_role}
                            </div>
                        </div>
                    </div>
                    <div className={_vipmiddlefloat}>
                        <img src={this.props.data.qrcode_filename} />
                        <div className="detail-link-container">
                        {/*zhEn("长按二维码完成注册","Long press the qr code to complete.")*/}
                            <input onChange={() => { }} value={_url} />
                            <span onClick={this.coby.bind(this, _url)}>{zhEn("复制链接","Copy Link")}</span>
                        </div>
                    </div>
                    <MiddleRightOne
                        bindmes={this.props.middlerightonemess}
                        BtnShow={this.props.BtnShow.bind(this)}
                        updateUserInfo={this.props.updateUserInfo.bind(this)}
                        showQR={this.props.showQR.bind(this)}
                    />
                </div>
                <div className={"middle-money-container" + _moneyShow}>
                    <div className="middle-header">
                        <span className="link-title" onClick={this.toMiddleContainer.bind(this)}>{zhEn("会员权益","Privilege")}</span>&nbsp;&gt;&nbsp;
                        <span className="header-title"> {zhEn("现金提现","Withdrawal")}</span>
                    </div>
                    <div className="list-container">
                        <div className="list-row-item">
                            <span>{zhEn("提现方式：","Method:")}</span>
                            <span>{zhEn("微信提现","Withdrawal")}</span>
                        </div>
                        <div className="list-row-item">
                            <span>{zhEn("提现微信账户：","Account:")}</span>
                            {this.wxdata()}
                        </div>
                        <div className="list-row-item">
                            <span>{zhEn("我的可提现金额：","Avaiable balance:")}</span>
                            <span className="total-money">￥{this.state.balance}</span>
                        </div>
                        <div className="list-row-item">
                            <span>{zhEn("提现金额：","Amount:")}</span>
                            <div className="money-input-box">
                                <input placeholder={zhEn("输入提现金额（元）","Enter withdrawal amount (¥)")} ref="moneyInput" />
                                <span>{zhEn("单笔最大提现金额200元","The maximum withdrawal amount is 200 yuan.")}</span>
                            </div>
                        </div>
                        <div className="list-row-item">
                            <span>{zhEn("提现密码：","Password:")}</span>
                            <div className="password-container">
                                <input type="password" placeholder={zhEn("输入账号密码","Enter password")} ref="passwordInput" />
                                <span onClick={this.showFloatPassword.bind(this)}>{this.state.has_password ? (zhEn("更改提现密码","Change withdrawal password.")) : (zhEn("设置提现密码","Set withdrawal password."))}</span>
                            </div>
                        </div>
                        <div className="list-row-item">
                            <span></span>
                            <div className="submit-button" onClick={this.moneySubmit.bind(this)}>
                            {zhEn("确认提现","Confirm")}
                            </div>
                        </div>
                    </div>
                    <div className="declare-container">
                        <span className="declare-title">{zhEn("提现须知","Withdrawal Notification:")}</span> <br />
                        {zhEn("1、微信提现：最小提现金额1元；工作日9:00~18:00提现1小时内到账，其它提现到账时间不定；受微信红包政策影响，单人单笔提现金额不超过200元，每日提现次数不超过10次；提现发放是以","1. Wechat Withdrawal: Minimum withdrawal amount is 1 yuan; During 9:00 ~ 18:00 workday, transfer will be issued within 1 hours. Besides, processing time is unexpectable； According to Wechat policy, maxinum amount for each withdrawal is 200 yuan, up to 10 times/day. The withdrawal will be processed via")}<span className="red-mark">{zhEn("“云汽”公众号红包的形式发放",'redpack in "yunqi" wechat offical account. ')}</span>{zhEn("，请注意公众号所发出的红包提醒。",', notice the message from "yunqi" wechat offical account.')}<br />
                        {zhEn("2、免责申明：提现前请确认自己的收款帐号无误并已通过微信实名认证，","2. Statement: Check your wechat account with wechat real-name authentication. ")}<span className="red-mark">{zhEn("未实名认证将导致您的提现不到账","Transfer can't be processed with unauthenticated wechat account.")}</span>{zhEn("，提现支付后由于收款帐号问题造成的资金退回、冻结、消失本站概不负责；申请提现成功，预计1小时内到账，请在24小时内领取微信红包，否则红包将会过期。","It's your responsibility if transfer failed by wechat account issues. The transfer will be processed wthin 1 hour, please take your redpack as soon as possible. Otherwise, redpack will expire after 24 hours.")}<br />
                    </div>
                </div>
                <div className={"middle-money-list-container " + _moneyListShow}>
                    <div className="middle-header">
                    <span className="link-title" onClick={this.toMiddleContainer.bind(this)}>{zhEn("会员权益","MEMBERSHIP")} </span> &nbsp;&gt;&nbsp;
                        <span className="header-title">{zhEn("现金明细","Details")}</span>
                    </div>
                    <div className="list-main-title">
                    {zhEn("我的现金","Balance")} <span>￥{this.state.total_balance}</span>
                    </div>
                    {this.state.moneyListData.length !== 0 ? 
                        <div className="list-main-container">
                            <div className="list-body">
                                <div className="list-container">
                                    <div className="header-row">
                                        {_moneyListTitle.map((item, index) => {
                                            return (
                                                <div className="header-item" key={index}>
                                                    {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="item-main">
                                        {this.getList()}
                                    </div>
                                </div>
                            </div>
                            <div className="list-footer">
                                <Pagination
                                    count={this.state.total_page}
                                    groupCount={10}
                                    selectedCount={1}
                                    callback={(index) => {
                                        this.getData(index)
                                    }}
                                />
                            </div>
                        </div> : <div className="money-list-null"><img src={_bgimg} alt=""/></div>
                    } 
                </div>
            </div>

        )
    }
}