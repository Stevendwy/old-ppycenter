import React, {
	Component
} from 'react'
import InquireCarContentUlLi from './inquirecarcontentulli'

export default class CarContentOne extends Component {
	constructor(peops) {
		super(peops)
	}
	handleClick(index) {
		this.props.onClick()
	}

	render() {
		return (
			<div id={this.props.setid}
				onClick={this.handleClick.bind(this,this.props.index)}
				 style={{display:this.props.isShow==1?"block":"none"}}
				 className="InqireCarContainerContent" 
				 >
				<div className="InquireCarContainerContentTop">
					{this.props.settitle}
					<img src={this.props.setsrc} alt="" />
				</div>
				<InquireCarContentUlLi
				 index={this.props.index}
				 ulliid="InquireCarContentUlLiContent1"/>
			</div>
		)
	}
}