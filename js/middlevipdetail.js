import React, { Component } from 'react'
import { render } from 'react-dom'
import Pagination from 'pagination-react'
export default class MiddleVipDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            brandrole: [],
            moneyDetailShow: false,
            moneyListShow: false,
            total_balance: "",
            balance: "",
            has_password: false,
            moneyListData: [],
            total_page: 1
        }
        window.pwdSuccCallback = this.pwdSuccCallback.bind(this)
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
            alert("请先设置提现密码")
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
            alert("提现成功")
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
                            alert('微信解绑成功')
                            this.props.updateUserInfo()})  
                        }}>解除绑定
                    </b>
                </span> :
                <span onClick={() => this.props.showQR(true)}>您还没有绑定微信 <b>绑定微信</b></span>    
            )
        }    
    }

    render() {
        let _moneyListTitle = ["流水号", "红包", "时间", "收支金额", "类型", "备注"]

        let _role = this.state.brandrole.map((item, index) => {
            return (
                <div className="list-item" key={index}>
                    <div>{item.name}</div>
                    <div>{item.valid_datetime}</div>
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
                                会员权益
                            </div>
                            <div className="user-score">
                                <div className="user-score-container">
                                    <span> 我的积分：{this.props.score}
                                        <div className="badge-iocn">?
                                            <div className="container-rule-title">
                                                <div>*当前积分规则：</div>
                                                1. 一次有效查询，积1分；<br />
                                                2. 一次有效反馈，积5分；<br />
                                                3. 积分有效期，2年。
                                            </div>
                                        </div>
                                    </span>

                                    {/* <div className="operation-container"><span>兑换</span><span>查看明细</span></div> */}

                                </div>
                                <div className="total-money-container">
                                    <span> 我的现金： ￥{this.state.total_balance} <div className="null-div"></div>
                                    </span>
                                    <div className="operation-container">
                                        <span onClick={this.toMoneyList.bind(this)}>查看明细</span>
                                    </div>                               
                                </div>
                                <div className="user-money-container">
                                    <span> 可提现金额： ￥{this.state.balance}
                                        <div className="badge-iocn">?
                                            <div className="container-rule-title">
                                                <div>*可提现金额规则：</div>
                                                当日获得现金次日可提现<br/>
                                            </div>
                                        </div>
                                    </span>
                                    <div className="operation-container"><span onClick={this.toMoneyClick.bind(this)}>提现</span>
                                    {/* <span onClick={this.toMoneyList.bind(this)}>查看明细</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="data-list-container">
                            <div className="data-list-title">
                                <div>品牌套餐</div>
                                <div>
                                    使用期限
                                </div>
                            </div>
                            <div className="data-list-item">
                                {_role}
                            </div>
                        </div>
                    </div>
                    <div className="vip-middle-float">
                        <img src={this.props.data.qrcode_filename} />
                        <div className="detail-link-container">
                            长按二维码完成注册
                            <input onChange={() => { }} value={_url} />
                            <span onClick={this.coby.bind(this, _url)}>复制链接</span>
                        </div>
                    </div>
                </div>
                <div className={"middle-money-container" + _moneyShow}>
                    <div className="middle-header">
                        <span className="link-title" onClick={this.toMiddleContainer.bind(this)}>会员权益</span>&nbsp;&gt;&nbsp;
                        <span className="header-title"> 现金提现</span>
                    </div>
                    <div className="list-container">
                        <div className="list-row-item">
                            <span>提现方式：</span>
                            <span>微信提现</span>
                        </div>
                        <div className="list-row-item">
                            <span>提现微信账户：</span>
                            {this.wxdata()}

                        </div>
                        <div className="list-row-item">
                            <span>我的可提现金额：</span>
                            <span className="total-money">￥{this.state.balance}</span>
                        </div>
                        <div className="list-row-item">
                            <span>提现金额：</span>
                            <div className="money-input-box">
                                <input placeholder="输入提现金额（元）" ref="moneyInput" />
                                <span>单笔最大提现金额200元</span>
                            </div>
                        </div>
                        <div className="list-row-item">
                            <span>提现密码：</span>
                            <div className="password-container">
                                <input type="password" placeholder="输入账号密码" ref="passwordInput" />
                                <span onClick={this.showFloatPassword.bind(this)}>{this.state.has_password ? "更改提现密码" : "设置提现密码"}</span>
                            </div>
                        </div>
                        <div className="list-row-item">
                            <span></span>
                            <div className="submit-button" onClick={this.moneySubmit.bind(this)}>
                                确认提现
                            </div>
                        </div>
                    </div>
                    <div className="declare-container">
                        <span className="declare-title">提现须知</span> <br />
                        1、微信提现：最小提现金额1元；工作日9:00~18:00提现1小时内到账，其它提现到账时间不定；受微信红包政策影响，单人单笔提现金额不超过200元，每日提现次数不超过10次；提现发放是以<span className="red-mark">“云汽”公众号红包的形式发放</span>，请注意公众号所发出的红包提醒。<br />
                        2、免责申明：提现前请确认自己的收款帐号无误并已通过微信实名认证，<span className="red-mark">未实名认证将导致您的提现不到账</span>，提现支付后由于收款帐号问题造成的资金退回、冻结、消失本站概不负责；申请提现成功，预计1小时内到账，请在24小时内领取微信红包，否则红包将会过期。<br />
                    </div>
                </div>
                <div className={"middle-money-list-container " + _moneyListShow}>
                    <div className="middle-header">
                    <span className="link-title" onClick={this.toMiddleContainer.bind(this)}>会员权益 </span> &nbsp;&gt;&nbsp;
                        <span className="header-title">现金明细</span>
                    </div>
                    <div className="list-main-title">
                        我的现金 <span>￥{this.state.total_balance}</span>
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
                        </div> : <div className="money-list-null"><img src="/img/tickey_null.png" alt=""/></div>
                    } 
                </div>
            </div>

        )
    }
}