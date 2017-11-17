import React, {
	Component
} from 'react'
import InquireVIN from './inquirevin'
import InquireCar from './inquirecar'
import InquirePart from './inquirepart'
import InquireCenter from './inquirecenter'

export default class Middle extends Component {

	constructor(props) {
		super(props)
		this.vinType = "vin"
		this.carType = "car"
		this.partType = "part"
		this.centerType = "center"
	}

	renderContent(inquireType = this.centerType) {
		let _content
		switch (1) {
			case this.vinType:
				_content = <InquireVIN />
				break
			case this.carType:
				_content = <InquireCar />
				break
			case this.partType:
				_content = <InquirePart />
				break
			case 1:
				_content = <InquireCenter />
				break
			default:
				_content = <InquireVIN />
				break
		}
		return _content
	}

	render() {
		let _inquireType = this.props.inquireType
		let _content = this.renderContent(_inquireType)
		let _height = "calc(100% - 116px)"
		let _bgc = "#fff"
			//		if (_inquireType == this.partType) _height = "100%"
		return (
			<div className="MiddleContainer" style={{backgroundColor:_bgc}}>
				{_content}
			</div>
		)
	}
}