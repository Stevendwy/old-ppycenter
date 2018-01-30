import React, {Component} from 'react'
import {render} from 'react-dom'
import Utils from './utils'
import NormalList from 'normal-list-react'
import ShareForm from "./shareform"
import Pagination from 'pagination-react'
export default class MiddleShopping extends Component{
    constructor(){
        super()
        this.state = {
            showShare: false,
            uid: "",
            chooseIndex: 1,
            listData: null
        }
    }
    componentDidMount(){
        // getAjax("/quotes/quotes/list",{page:this.state.chooseIndex,size:10},res=>{
        //     this.setState({
        //         listData: res
        //     })
        // })
        this.getData(1)
    }

    getData(index){
        getAjax("/quotes/quotes/list",{page:index,size:10},res=>{
            this.setState({
                listData: res
            })
        })
    }

    listClick(data){
        this.setState({
            showShare: true,
            uid: data.uid
        })
    }

    // changeIndex(index){
    //     this.getData(index)
    // }

    getList(){
        let _headerTitles = ['序号', 'VIN / 车型', '报价金额', '创建时间']
        if (zhEn(false,true)) {
            _headerTitles = ['Index', 'Model', 'Total', 'Create at']
        }
        if(this.state.listData){
            return(
                <NormalList
                data={this.state.listData.data}
                headerTitles={_headerTitles}
                itemKeys={['num', 'title', 'total_money', 'createtime']}
                listClick={this.listClick.bind(this)}/>
            )
        }
    }

    getpage(){
        if(this.state.listData && this.state.listData.total_page > 1){
            return(
                <Pagination 
                        count={this.state.listData.total_page}
                        groupCount={10}
                        selectedCount={1}
                        callback={(index)=>{
                            this.getData(index)
                        }}
                />
            )
        }
    }

    hiddenShare(){
        this.setState({
            showShare: false
        })
    }
    
    render(){
        let _shareForm = this.state.showShare ? (
            <ShareForm uid={this.state.uid}  hidden={this.hiddenShare.bind(this)}/>
        ) : null
        let _bgimg = "container-shopping-null"
        if (zhEn(false,true)) {
            _bgimg = "container-shopping-null container-shopping-null-en"
        }
        // let ShareForm = this.state.showShare ? <ShareForm/> : null    
        let _content = ""
        if(this.state.listData){
            _content = this.state.listData.data.length ? 
                            <div className="shopping-list-container">
                                <div className="list-body-box">
                                    <div className="shopping-list">
                                        {this.getList()}
                                    </div>
                                    <div className="shopping-page">
                                        {this.getpage()}
                                    </div>
                                </div>
                                <div className="tickey-msg-ex">
                                    <div>{zhEn('特别提示','Notification:')}</div>
                                    <span></span>{zhEn('每笔报价单保存期限为1年。','Each quotation will be kept for one year')}
                                </div>
                            </div>
                            : <div className={_bgimg}/>
        }    
        return(
            <div className="shopping-container">
                <div className="shopping-title">
                {zhEn('报价单','Quotations')}
                </div>
                {_content}
                {_shareForm}
            </div>
        )   
    }
}
