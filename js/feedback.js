import React, {
	Component
} from 'react'

export default class Feedback extends Component {

	render() {
		let _icons = this.props.icons
		let _selectedIcons = this.props.selectedIcons

		return (
			<div className="FeedbackContainer">
				<ImagePark icons={_icons} selectedIcons={_selectedIcons} />
			</div>
		)
	}
}

class ImagePark extends Component {
	constructor(props) {
		super(props)
		this.icons = props.icons
		this.selectedIcons = props.selectedIcons
		this.state = {
			selectedIcons: this.icons
		}
		this.height = canvasHeight;
		this.width = canvasWidth;
	}

	itemClick(index) {
		let _icons = this.icons.slice()
		let _selectedIcon = this.selectedIcons[index]
		_icons[index] = _selectedIcon
		this.setState({
			selectedIcons: _icons
		})
		switch (index) {
			case 0:
				tools.tool = "pencil";
				tools.graphic = "rect";
				break;
			case 1:
				tools.tool = "pencil";
				tools.graphic = "circle";
				break;
			case 2:
				tools.tool = "pencil";
				tools.graphic = "line";
				break;
			case 3:
				tools.tool = "word";
				break;
			case 4:
				tools.tool = "pencil";
				tools.graphic = "";
				break;
		}
	}

	render() {
		let _icons = this.state.selectedIcons
		let _itemClick = this.itemClick

		let _selector = (
			_icons.map((icon, index) => {
				return (
					<ImageParkItem key={index}
						click={_itemClick.bind(this, index)}
						icon={icon}
					/>
				)
			})
		)
		let _width = this.width;
		let _height = this.height;
		return (
			<div className="ImageParkContainer">
				{/*<img className="Image" src="" alt="image break" />*/}
        		<canvas id="canvas" width={_width} height={_height} style={{width:_width+"px",height:_height+"px"}}></canvas>

				<div className="ImageParkSelectorContainer">
					{_selector}
				</div>
			</div>
		)
	}
}

class ImageParkItem extends Component {

	render() {
		let _icon = this.props.icon
		let _click = this.props.click

		return (
			<div className="ImageParkSelector" onClick={_click}>

				<img className="ImageParkSelectorImg" src={_icon} alt="text" />
			</div>
		)
	}
}