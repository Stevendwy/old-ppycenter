import React, {Component} from 'react'
import {render} from 'react-dom'
import Sliders from './sliders'

import {middleEvents, sendEvent} from './eventmodel'
export default class MiddleRightTwo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
		// this.imgs = ['https://cdns.007vin.com/img/to_user1.png', 'https://cdns.007vin.com/img/to_user2.png', 'https://cdns.007vin.com/img/to_user3.png', 'https://cdns.007vin.com/img/to_user4.png']
		this.imgs = ['/img/to_user1.png', '/img/to_user2.png', '/img/to_user3.png', '/img/to_user4.png']
		
	}
	
	render() {
		return (
				<div className="NmiddleLeftListImgTwohas">
				{/* <Sliders imgs={this.imgs} /> */}
					{
						this.imgs.map((item,index)=>{
							return(
								<img src={item} key={index}/>
							)
						})
					}
				</div>
			
		)
	}
}
