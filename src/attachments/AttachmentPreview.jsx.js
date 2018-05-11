import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { merge } from 'glamor';

import {
	FadeIn,
	Flex,
	Heading,
	HorizontalSeparationLine,
	KeyValueList,
	SpinnerIcon,
	StateMessage
} from 'fds/components';
import { block } from 'fds/system';
import FxImageLoader from 'fontoxml-fx/FxImageLoader.jsx';

const imageStyles = merge(block, {
	position: 'absolute',
	maxWidth: '100%',
	maxHeight: '100%',
	width: 'auto',
	height: 'auto',
	top: '50%',
	left: '50%',
	transform: 'translateX(-50%) translateY(-50%)'
});

class AttachmentPreview extends Component {
	render() {
		const { stateLabels, selectedItem } = this.props;

		return (
			<Flex flex="auto" flexDirection="column">
				<Flex flex="auto" flexDirection="column" paddingSize="l" spaceSize="m">
					<Heading level="4">{selectedItem.metadata.title}</Heading>

					<Flex flex="auto">
						<img src={selectedItem.metadata.previewUrlWeb} />
					</Flex>
				</Flex>

				{selectedItem.metadata &&
					selectedItem.metadata.properties && (
						<Flex flex="none" flexDirection="column">
							<Flex paddingSize={{ horizontal: 'l' }}>
								<HorizontalSeparationLine />
							</Flex>

							<KeyValueList
								valueByKey={selectedItem.metadata.properties}
								scrollLimit={5}
								paddingSize="l"
							/>
						</Flex>
					)}
			</Flex>
		);
	}
}

export default AttachmentPreview;
