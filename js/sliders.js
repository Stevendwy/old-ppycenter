import React, { Component } from 'react'

export default class Sliders extends Component {
	
	constructor() {
		super()
		this.state = {
			currentIndex: 0
		}
		this.next = false
		this.last = false
	}

	getImgs() {
		return this.props.imgs.map((item, index) => {
			return <img key={index} src={item} />
		})
	}
	
	getPaginations() {
		let _imgs = this.props.imgs
		return _imgs.map((item, index) => {
			if (index == 0 || index == _imgs.length - 1) {
				return <div key={index}></div>
			}
			let _class = 'pagination'
			if(index - 1 == this.state.currentIndex) _class += ' blue'
			return <div key={index} className={_class}></div>
		})
	}
	
	lastClick() {
		let _length = this.props.imgs.length
		this.last = true
		this.next = false
		let _currentIndex = --this.state.currentIndex < 0 ? _length-3 : this.state.currentIndex
		this.setState({
			currentIndex: _currentIndex
		})
	}
	
	nextClick() {
		this.next = true
		this.last = false
		let _length = this.props.imgs.length
//		console.log(this.state.currentIndex + ' ' + _length)
		let _currentIndex = ++this.state.currentIndex > _length - 3 ? 0 : this.state.currentIndex //有两张是备用图
		this.setState({
			currentIndex: _currentIndex
		})
	}

	render() {
		let _imgs = this.getImgs()
		let _paginations = this.getPaginations()
		let _last = this.lastClick.bind(this)
		let _next = this.nextClick.bind(this)
		let _currentIndex = this.state.currentIndex
//		console.log(_currentIndex)
		let _containerImgsClass = 'container_imgs'
		if(this.next) _containerImgsClass += ' nextStart' + (_currentIndex == 0 ? _imgs.length - 3 : --_currentIndex ) //动画 class 起点是当前，与 currentIndex 有1的差值
		else if(this.last) _containerImgsClass += ' lastStart' + (_currentIndex == _imgs.length - 3 ? 0 : ++_currentIndex)

		return(
			<div className='container_sliders'>
				<div className={_containerImgsClass}>
					{_imgs}
				</div>
				<button className='last' onClick={_last}></button>
				<button className='next' onClick={_next}></button>
				<div className='container_paginations'>
					{_paginations}
				</div>
			</div>
		)
	}
}

Sliders.propTypes = {
	imgs: React.PropTypes.array.isRequired
}