import React, { Component } from 'react';

import {
	Flex,
	Heading,
	HorizontalSeparationLine,
	KeyValueList,
	ContainedImage
} from 'fds/components';

class AttachmentPreview extends Component {
	render() {
		const { stateLabels, selectedItem } = this.props;

		return (
			<Flex flex="auto" flexDirection="column">
				<Flex flex="auto" flexDirection="column" paddingSize="l" spaceSize="m">
					<Heading level="4">{selectedItem.metadata.title}</Heading>

					<Flex flex="auto">
						<ContainedImage src={selectedItem.metadata.previewUrlThumbnail} />
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
