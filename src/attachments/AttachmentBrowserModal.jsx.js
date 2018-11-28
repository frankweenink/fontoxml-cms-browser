import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
} from 'fds/components';
import t from 'fontoxml-localization/t';

import AttachmentGridItem from './AttachmentGridItem.jsx';
import AttachmentListItem from './AttachmentListItem.jsx';
import AttachmentPreview from './AttachmentPreview.jsx';
import AttachmentUploadPreview from './AttachmentUploadPreview.jsx';
import ModalBrowserFileAndFolderResultList from '../shared/ModalBrowserFileAndFolderResultList.jsx';
import ModalBrowserHierarchyBreadcrumbs from '../shared/ModalBrowserHierarchyBreadcrumbs.jsx';
import ModalBrowserListOrGridViewMode, {
	VIEWMODES
} from '../shared/ModalBrowserListOrGridViewMode.jsx';
import ModalBrowserUploadButton from '../shared/ModalBrowserUploadButton.jsx';
import withInsertOperationNameCapabilities from '../withInsertOperationNameCapabilities.jsx';
import withModularBrowserCapabilities from '../withModularBrowserCapabilities.jsx';

const stateLabels = {
	loading: {
		title: t('Loading attachments…'),
		message: null
	},
	browseError: {
		title: t('Can’t open this folder'),
		message: t('FontoXML can’t open this folder. You can try again, or try a different folder.')
	},
	empty: {
		title: t('No results'),
		message: t('This folder does not contain attachments that can be opened with FontoXML.')
	},
	loadingPreview: {
		title: t('Loading attachment preview…'),
		message: null
	},
	previewError: {
		title: t('Can’t open this attachment'),
		message: t('FontoXML can’t open this attachment. You can try again, or try a different attachment.')
	}
};

const uploadErrorMessages = {
	fileSizeTooLargeMessage: t(
		'This attachment is larger than 4 megabyte, please select another attachment or resize it and try again.'
	),
	serverErrorMessage: t('FontoXML can’t upload this attachment, please try again.')
};

function getSubmitModalData(itemToSubmit) {
	return {
		selectedAttachmentId: itemToSubmit.id
	};
}

function canSubmitSelectedItem(selectedItem) {
	return !!(selectedItem && selectedItem.type !== 'folder');
}

class AttachmentBrowserModal extends Component {
	static propTypes = {
		cancelModal: PropTypes.func.isRequired,
		data: PropTypes.shape({
			browseContextDocumentId: PropTypes.string,
			dataProviderName: PropTypes.string.isRequired,
			insertOperationName: PropTypes.string,
			modalIcon: PropTypes.string,
			modalPrimaryButtonLabel: PropTypes.string,
			modalTitle: PropTypes.string,
			selectedAttachmentId: PropTypes.string
		}).isRequired,
		submitModal: PropTypes.func.isRequired
	};

	handleKeyDown = event => {
		const { selectedItem } = this.props;
		switch (event.key) {
			case 'Escape':
				this.props.cancelModal();
				break;
			case 'Enter':
				if (!this.props.isSubmitButtonDisabled) {
					this.props.submitModal(getSubmitModalData(selectedItem));
				}
				break;
		}
	};

	handleFileAndFolderResultListItemSubmit = selectedItem =>
		this.props.determineAndHandleItemSubmitForSelectedItem(selectedItem);

	handleRenderListItem = ({ key, isSelected, item, onClick, onDoubleClick, onRef }) => (
		<AttachmentListItem
			key={key}
			isDisabled={item.isDisabled}
			isSelected={isSelected}
			item={item}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
			onRef={onRef}
		/>
	);

	handleRenderGridItem = ({ key, isSelected, item, onClick, onDoubleClick }) => (
		<AttachmentGridItem
			key={key}
			isDisabled={item.isDisabled}
			isSelected={isSelected}
			item={item}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
		/>
	);

	handleSubmitButtonClick = () =>
		this.props.submitModal(getSubmitModalData(this.props.selectedItem));

	render() {
		const {
			cancelModal,
			data: {
				browseContextDocumentId,
				dataProviderName,
				modalIcon,
				modalPrimaryButtonLabel,
				modalTitle
			},
			hierarchyItems,
			isSubmitButtonDisabled,
			items,
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
			<Modal size="l" isFullHeight onKeyDown={this.handleKeyDown}>
				<ModalHeader icon={modalIcon} title={modalTitle || t('Select an attachment')} />

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

							{selectedItem &&
							selectedItem.type !== 'folder' && (
								<ModalContent flexDirection="column">									
									{selectedItem.uploaded ? (
									  <AttachmentUploadPreview
									  	selectedItem={selectedItem}
									  	stateLabels={stateLabels} />
									) : (
									  <AttachmentPreview
										selectedItem={selectedItem}
										stateLabels={stateLabels}
										/>
									)}
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
						isDisabled={isSubmitButtonDisabled}
						onClick={this.handleSubmitButtonClick}
					/>
				</ModalFooter>
			</Modal>
		);
	}

	componentDidMount() {
		const {
			data: { browseContextDocumentId, selectedAttachmentId },
			onInitialSelectedItemIdChange,
			refreshItems
		} = this.props;

		if (selectedAttachmentId) {
			onInitialSelectedItemIdChange({ id: selectedAttachmentId });
		}

		refreshItems(browseContextDocumentId, { id: null });
	}
}

AttachmentBrowserModal = withModularBrowserCapabilities(VIEWMODES.GRID)(AttachmentBrowserModal);
AttachmentBrowserModal = withInsertOperationNameCapabilities(getSubmitModalData, canSubmitSelectedItem)(
	AttachmentBrowserModal
);

export default AttachmentBrowserModal;
