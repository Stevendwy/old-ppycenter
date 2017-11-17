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
        if(this.state.listData){
            return(
                <NormalList
                data={this.state.listData.data}
                headerTitles={['序号', 'VIN / 车型', '报价金额', '创建时间']}
                itemKeys={['num', 'title', 'total_money', 'createtime']}
                listClick={this.listClick.bind(this)}/>
            )
        }
    }

    getpage(){
        if(this.state.listData){
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
        // let ShareForm = this.state.showShare ? <ShareForm/> : null    
        let _content = ""
        if(this.state.listData){
            _content = this.state.listData.data.length ? 
                            <div className="shopping-list-container">
                                <div className="shopping-list">
                                    {this.getList()}
                                </div>
                                <div className="shopping-page">
                                    {this.getpage()}
                                </div>
                            </div>
                            : <div className="container-shopping-null"/>
        }    
        return(
            <div className="shopping-container">
                <div className="shopping-title">
                    报价单
                </div>
                {_content}
                {_shareForm}
            </div>
        )   
    }
}
