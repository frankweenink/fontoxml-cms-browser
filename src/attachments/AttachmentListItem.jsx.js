import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Block, ContainedImage, Icon, Label, ListItem, SpinnerIcon } from 'fds/components';
import FxImageLoader from 'fontoxml-fx/FxImageLoader.jsx';

class AttachmentListItem extends Component {
	static defaultProps = {
		isDisabled: false,
		isSelected: false,
		onClick: _item => { },
		onDoubleClick: _item => { },
		onRef: _domNode => { }
	};

	static propTypes = {
		isDisabled: PropTypes.bool,
		isSelected: PropTypes.bool,
		item: PropTypes.shape({
			id: PropTypes.string.isRequired,
			icon: PropTypes.string,
			label: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired
		}).isRequired,
		onClick: PropTypes.func,
		onDoubleClick: PropTypes.func,
		onRef: PropTypes.func
	};

	wrapInListItem = (content, label) => {
		return (
			<ListItem
				isSelected={this.props.isSelected}
				isDisabled={this.props.isDisabled}
				onClick={this.props.onClick}
				onDoubleClick={this.props.onDoubleClick}
				onRef={this.props.onRef}
			>
				{content}
				{label}
			</ListItem>
		);
	};

	render() {
		const { item } = this.props;

		if (item.type === 'folder') {
			return this.wrapInListItem(
				<Icon icon={item.icon || 'folder-o'} size="s" />,
				<Label>{item.label}</Label>
			);
		}

		return this.wrapInListItem(
			<Block applyCss={{ width: '.875rem', height: '.875rem' }}>
				<ContainedImage src={item.metadata.previewUrlThumbnail} />
			</Block>,
			<Label>{item.label}</Label>
		);
	}
}

export default AttachmentListItem;
