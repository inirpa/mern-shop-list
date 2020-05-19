import React, { Component } from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input
} from 'reactstrap';
import {connect} from 'react-redux';
import { addItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

class ItemModal extends Component{
	state = {
		modal: false,
		name: ''
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool
	}

	toggle = () => {
		this.setState({
			modal: !this.state.modal
		});
	}

	onChange = (e) => {
		this.setState({
			[e.target.name] : e.target.value
		});
	}

	onSubmit = (e) => {
		e.preventDefault();

		const newItem = {
			name: this.state.name
		}

		//Add item via add item action
		this.props.addItem(newItem);

		//Close modal
		this.toggle();
	}

	render(){
		return (
			<div>
				{
					this.props.isAuthenticated
					? <Button
						color="dark"
						style={{marginBottom:'2rem'}}
						onClick={this.toggle}
					>
						Add Item
					</Button>
					: <h4 className="mb-3 ml-4">
						Login to add new items
					</h4>
				}
				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}
				>
					<ModalHeader
						toggle={this.toggle}
					>
						Add to list
					</ModalHeader>
					<ModalBody>
						<Form
							onSubmit={this.onSubmit}
						>
							<FormGroup>
								<Label for="item">Item</Label>
								<Input
									type="text"
									name="name"
									id="item"
									placeholder="add shopping item"
									onChange={this.onChange}
								/>
								<Button
									color="dark"
									style={{marginTop:'2rem'}}
									block
								>
									Save Item
								</Button>
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		)
	}
}

const mapsStateToProps = state => ({
	item: state.item,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapsStateToProps, { addItem })(ItemModal);