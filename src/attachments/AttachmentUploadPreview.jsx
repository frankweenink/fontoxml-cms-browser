import React, { Component } from 'react';

import { Flex, Heading } from 'fds/components';

class AttachmentPreview extends Component {
	render() {
		const { selectedItem } = this.props;

		return (
			<Flex flex="auto" flexDirection="column">
				<Flex flex="auto" flexDirection="column" paddingSize="l" spaceSize="m">
					<Heading level="4">{selectedItem.label}</Heading>

					<Flex flex="auto" />
				</Flex>
			</Flex>
		);
	}
}

export default AttachmentPreview;
