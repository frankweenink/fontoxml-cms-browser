import PropTypes from 'prop-types';
import React, { Component } from 'react';

import t from 'fontoxml-localization/t';

import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalContentToolbar,
	ModalFooter,
	ModalHeader,
	Toast
} from 'fontoxml-vendor-fds/components';

import ImageGridItem from './ImageGridItem.jsx';
import ImageListItem from './ImageListItem.jsx';
import ImagePreview from './ImagePreview.jsx';
import ImageLoader from './ImageLoader.jsx';
import ModalBrowserFileAndFolderResultList from '../shared/ModalBrowserFileAndFolderResultList.jsx';
import ModalBrowserHierarchyBreadcrumbs from '../shared/ModalBrowserHierarchyBreadcrumbs.jsx';
import ModalBrowserListOrGridViewMode, {
	VIEWMODES
} from '../shared/ModalBrowserListOrGridViewMode.jsx';
import ModalBrowserUploadButton from '../shared/ModalBrowserUploadButton.jsx';
import withModularBrowserCapabilities from '../withModularBrowserCapabilities.jsx';

const stateLabels = {
	loading: {
		title: t('Loading images…'),
		message: null
	},
	browseError: {
		title: t('Can’t open this folder'),
		message: t('FontoXML can’t open this folder. You can try again, or try a different folder.')
	},
	empty: {
		title: t('No results'),
		message: t('This folder does not contain images that can be opened with FontoXML.')
	},
	loadingPreview: {
		title: t('Loading image preview…'),
		message: null
	},
	previewError: {
		title: t('Can’t open this image'),
		message: t('FontoXML can’t open this image. You can try again, or try a different image.')
	}
};

const uploadErrorMessages = {
	fileSizeTooLargeMessage: t(
		'This image is larger than 4 megabyte, please select another image or resize it and try again.'
	),
	serverErrorMessage: t('FontoXML can’t upload this image, please try again.')
};

class ImageBrowserModal extends Component {
	static propTypes = {
		cancelModal: PropTypes.func.isRequired,
		data: PropTypes.shape({
			browseContextDocumentId: PropTypes.string,
			dataProviderName: PropTypes.string.isRequired,
			modalTitle: PropTypes.string,
			modalPrimaryButtonLabel: PropTypes.string,
			selectedImageId: PropTypes.string
		}).isRequired,
		submitModal: PropTypes.func.isRequired
	};

	submitModal = itemToSubmit => this.props.submitModal({ selectedImageId: itemToSubmit.id });

	handleFileAndFolderResultListItemSubmit = selectedItem => this.submitModal(selectedItem);

	handleRenderListItem = ({
		key,
		isDisabled,
		isSelected,
		item,
		onClick,
		onDoubleClick,
		onRef
	}) => (
		<ImageListItem
			key={key}
			isDisabled={isDisabled}
			isSelected={isSelected}
			item={item}
			loadItem={this.props.loadItem}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
			onRef={onRef}
		/>
	);

	handleRenderGridItem = ({ key, isDisabled, isSelected, item, onClick, onDoubleClick }) => (
		<ImageGridItem
			key={key}
			isDisabled={isDisabled}
			isSelected={isSelected}
			item={item}
			loadItem={this.props.loadItem}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
		/>
	);

	handleSubmitButtonClick = () => this.submitModal(this.props.selectedItem);

	render() {
		const {
			cancelModal,
			data: {
				browseContextDocumentId,
				dataProviderName,
				modalTitle,
				modalPrimaryButtonLabel
			},
			hierarchyItems,
			items,
			loadItem,
			onItemSelect,
			onUploadFileSelect,
			onViewModeChange,
			refreshItems,
			request,
			selectedItem,
			viewMode
		} = this.props;
		const hasHierarchyItems = hierarchyItems.length > 0;

		return (
			<Modal size="l" isFullHeight={true}>
				<ModalHeader title={modalTitle || t('Select an image')} />

				<ModalBody>
					<ModalContent flexDirection="column">
						<ModalContentToolbar
							justifyContent={hasHierarchyItems ? 'space-between' : 'flex-end'}
						>
							{hasHierarchyItems && (
								<ModalBrowserHierarchyBreadcrumbs
									browseContextDocumentId={browseContextDocumentId}
									hierarchyItems={hierarchyItems}
									refreshItems={refreshItems}
									request={request}
								/>
							)}

							<Flex flex="none" spaceSize="m">
								<ModalBrowserUploadButton
									browseContextDocumentId={browseContextDocumentId}
									dataProviderName={dataProviderName}
									hierarchyItems={hierarchyItems}
									request={request}
									uploadErrorMessages={uploadErrorMessages}
									onUploadFileSelect={onUploadFileSelect}
								/>

								<ModalBrowserListOrGridViewMode
									onViewModeChange={onViewModeChange}
									viewMode={viewMode}
								/>
							</Flex>
						</ModalContentToolbar>

						{request.type === 'upload' &&
						request.error && (
							<ModalContent flex="none" paddingSize="m">
								<Toast
									connotation="error"
									icon="exclamation-triangle"
									content={request.error}
								/>
							</ModalContent>
						)}

						<ModalContent flexDirection="row">
							<ModalContent flexDirection="column">
								<ModalBrowserFileAndFolderResultList
									browseContextDocumentId={browseContextDocumentId}
									items={items}
									onItemSelect={onItemSelect}
									onItemSubmit={this.handleFileAndFolderResultListItemSubmit}
									refreshItems={refreshItems}
									renderListItem={this.handleRenderListItem}
									renderGridItem={this.handleRenderGridItem}
									request={request}
									selectedItem={selectedItem}
									stateLabels={stateLabels}
									viewMode={viewMode}
								/>
							</ModalContent>

							{this.props.selectedItem &&
							this.props.selectedItem.type !== 'folder' && (
								<ModalContent flexDirection="column">
									<ImagePreview
										loadItem={loadItem}
										selectedItem={selectedItem}
										stateLabels={stateLabels}
									/>
								</ModalContent>
							)}
						</ModalContent>
					</ModalContent>
				</ModalBody>

				<ModalFooter>
					<Button type="default" label={t('Cancel')} onClick={cancelModal} />

					<Button
						type="primary"
						label={modalPrimaryButtonLabel || t('Insert')}
						isDisabled={!selectedItem || selectedItem.type === 'folder'}
						onClick={this.handleSubmitButtonClick}
					/>
				</ModalFooter>
			</Modal>
		);
	}

	componentDidMount() {
		const {
			data: { browseContextDocumentId, selectedImageId },
			onInitialSelectedItemIdChange,
			refreshItems
		} = this.props;

		if (selectedImageId) {
			onInitialSelectedItemIdChange(selectedImageId);
		}

		refreshItems(browseContextDocumentId, { id: null });
	}
}

ImageBrowserModal = withModularBrowserCapabilities(ImageBrowserModal, ImageLoader, VIEWMODES.GRID);

export default ImageBrowserModal;
