import React, { Component } from 'react'
import { render } from 'react-dom'
import Pagination from 'pagination-react'

export default class TickeyBox extends Component {
    constructor(){
        super()
        this.state = {
            dataList: [],
            total_page: 1
        }
        this.selectedIndex = 1
    }

    componentWillMount(){
        getAjax("/pays/coupon/list",{page:1,size:10},res=>{
            this.setState({
                dataList: res.data,
                total_page: res.total_page
            })
        })
    }

    cobyPart(code, e) {
        let oDiv = document.createElement('textarea');
        oDiv.value = code;
        oDiv.innerHTML = code;
        document.body.appendChild(oDiv)
        oDiv.select();
        document.execCommand("Copy")
        document.body.removeChild(oDiv)
        e.stopPropagation()
    }

    getList() {
        let _cobyPart = this.cobyPart.bind(this)
        let keydata = [ "coupon_num", "title", "", "user_phone_ex"]
        if(this.state.dataList){
            let content = this.state.dataList.map((item, index) => {
                return (
                    <div className="list-main-row" key={index}>
                        {
                            keydata.map((it, ins) => {

                                if(ins == 2){
                                    return(
                                        <div className="list-main-cell" key={ins}>
                                            {item.valid_time_start.replace(/-/g,".")+"-"+item.valid_time_end.replace(/-/g,".")}
                                        </div>
                                    )
                                }else if(ins == 0){
                                    return(
                                        <div className="list-main-cell" key={ins}>
                                            {item[it]}
                                            {
                                                item.user_phone_ex ? null : <span className="coby-icon" onClick={e => _cobyPart(item[it], e)}>
                                                                                <span className="cody-success">
                                                                                    复制成功
                                                                                </span>
                                                                                <span className="coby-msg">
                                                                                    复制
                                                                                </span>
                                                                            </span>
                                            }
                                            
                                        </div>
                                    )
                                }else{
                                    return (
                                        <div className="list-main-cell" key={ins}>
                                            {item[it]}
                                        </div>
                                    )
                                }
                                
                            })
                        }
                    </div>

                )
            })
            return content
        }        
    }

    //分页
    getData(index) {
        // if(this.selectedIndex == index) return;
        getAjax("/pays/coupon/list",{page:index, size:10},res=>{
            this.setState({
                dataList: res.data,
            })
        })
    }

    render(){
        let _ticketListTitle = ["优惠码","优惠内容", "使用期限", "使用者"]
        return(
            <div className={"middle-ticket-list-container"}>
                <div className="list-main-container">
                    <div className="list-main-title">
                        我的优惠码
                    </div>
                    <div className="list-body-box">
                        {
                            this.state.dataList.length !== 0 ? <div className="body-have-data">
                            <div className="list-body">
                                <div className="list-container">
                                    <div className="header-row">
                                        {_ticketListTitle.map((item, index) => {
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
                        </div> : <div className="body-data-null"><img src="/img/tickey_nully.png" alt="优惠码为空"/></div> 
                        }
                    </div>
                    <div className="tickey-msg-ex">
                        <div>特别提示</div>
                        <span></span>当您或他人购买或续费时，在订单页面可以选择（或输入）您的优惠码，获得相应的优惠。 <br/>
                        <span></span>每个订单限使用一个优惠码。 <br/>
                        <span></span>请注意：每个优惠码都有使用期限，请在期限之内使用，过期作废。<br/>
                        <span></span>当您使用优惠码购买的商品发生退货时，将不会退还该优惠码对应的优惠金额。<br/>
                        <span></span>订单享受某些特定的大力度促销优惠时，因为亏本销售，恕不支持使用优惠码。 <br/>        
                    </div>
                </div>
            </div>
        )
    }
}