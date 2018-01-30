/*
* @Author: steven
* @Date:   2017-05-10 14:42:45
* @Last Modified by:   steven
* @Last Modified time: 2017-11-28 14:25:01
*/

'use strict';
import React, {Component} from 'react'
import {render} from 'react-dom'
import {message} from './datetest'
import DgroupPage from './middlerightmessagepage';//页码生成

import {middleEvents, sendEvent} from './eventmodel'
export default class MiddleRightThree extends Component {
	constructor(props) {
		super(props)
		this.state = {
			clickstore:[], //是否阅读
			current:1, //当前页码
			totalPage:1, //总页数
			mesdata:{data:[]},
			clickindex:-1,
			clicktype:zhEn("全文","All")
		}
		this.head= zhEn("系统消息","Messages")		//头部信息
		this.clickstore = []
	}
	showClick(index,type){
		let _type = type==zhEn("全文","All")?zhEn("收起","Hide"):zhEn("全文","All")
		this.setState({
			clickindex:index,
			clicktype:_type
		})
	}
	//点击翻页 zhEn('',"")
	pageClick(pageNum) {
		let _this = this;
		if (pageNum != _this.state.current) {
			this.setState({
				current: pageNum
			})
			this.getlistdata(pageNum) 				//重新请求数据
			$("html,body").animate({scrollTop:0}, 500)//页面回滚到顶部
		}

	}
	goPrevClick() {
		var _this = this;
		let cur = this.state.current;
		if (cur > 1) {
			_this.pageClick(cur - 1);
		}
	}
	goNext() {
		var _this = this;
		let cur = _this.state.current;
		if (cur < _this.state.totalPage) {
			_this.pageClick(cur + 1);
		}
	}
	
	readMessage(indexs,inid,type){
		if (type=="none") {
			return
		}
		let _instore = $.inArray(indexs,this.clickstore) //		clickstore
		if (_instore ==-1) {
			this.clickstore.push(indexs)
			let _urlread = "/user/msglocalread"
			let _data = {
				"inid":inid
			}
			getAjax(_urlread, _data, response => {
				// console.log(response)
				this.getlistdata(this.state.current)
			},()=>{
				this.setState({
					clickstore:this.clickstore
				})
			})
		}
	}
	
	componentWillMount(){
		this.getlistdata()
	}
	
	getlistdata(page=1){
		let _url = "/user/msglocal"
		let _data = {
			"page":page
		}
		getAjax(_url, _data, response => {
			let _pagelength = response.max_page
			this.setState({
				mesdata:response,
				current:response.page||1,
				totalPage:_pagelength
			})
		})
	}
	
	render() {
		let _totalpage = this.state.totalPage
		let _page = this.state.current
		let _data = this.state.mesdata
		let _datalist = <div></div>
		if (_data.data.length>0) {
			_datalist = _data.data.map((item,i)=>{
				let _length = item["msg_text"].length
				let _world =_length >120?zhEn("全文","All"):""
				let _heigth = _length >120?"36px":"auto"
				if (this.state.clickindex==i) {
					_world=this.state.clicktype
					_heigth=_world==zhEn("收起","Hide")?"auto":"36px"
				}
				let _reading = item.status == 1 ? "block":"none"
				return (
					<div key={i} className="FourContent" onClick={this.readMessage.bind(this,i,item.inid,_reading)}>
						<div className="FourListLeft">
							<p>
								{item.title}
								<span className="redmessage" style={{display:_reading}}></span>
							</p>
							<p>{item.magtime}</p>
						</div>
						<div className="FourListRight">
							<div className="FourListRightLeft" style={{height:_heigth}}>{item["msg_text"]}</div>
							<div className="FourListRightRight" onClick={this.showClick.bind(this,i,_world)}>{_world}</div>
						</div>
					</div>
				)
			})
		}
		return (
				<div className="NmiddleLeftListImgFourhas">
					<div className="FourHead">{this.head}</div>
						{_datalist}
					{
						_totalpage > 1 
						? <DgroupPage
							current={_page}
							totalPage={_totalpage}
							pageClick={this.pageClick.bind(this)}
							goPrev={this.goPrevClick.bind(this)}
							goNext={this.goNext.bind(this)}/>
						: null
					}
				</div>
			
		)
	}
}

