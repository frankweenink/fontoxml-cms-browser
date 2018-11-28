import React, { Component } from 'react';

import { merge } from 'glamor';

import {
	Flex,
	Heading,
	HorizontalSeparationLine,
	KeyValueList
} from 'fds/components';
import { block } from 'fds/system';

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

class ImageUploadPreview extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
    }

    handleImageLoaded = (evt) => {
        window.URL.revokeObjectURL(evt.currentTarget.src);
    }

    render() {
        const { stateLabels, selectedItem } = this.props;
        var objectURL = window.URL.createObjectURL(selectedItem.file);
        return (
            <Flex flex="auto" flexDirection="column">
                <Flex flex="auto" flexDirection="column" paddingSize="l" spaceSize="m">
                    <Heading level="4">{selectedItem.label}</Heading>

                    <Flex flex="auto">
                        <img src={objectURL} {...imageStyles} 
                             onLoad={this.handleImageLoaded}/>
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

export default ImageUploadPreview;