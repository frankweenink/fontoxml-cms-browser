import configurationManager from 'fontoxml-configuration/src/configurationManager.js';
import documentsHierarchy from 'fontoxml-documents/src/documentsHierarchy.js';
import documentsManager from 'fontoxml-documents/src/documentsManager.js';
import t from 'fontoxml-localization/src/t.js';
import uiManager from 'fontoxml-modular-ui/src/uiManager.js';
import addTransform from 'fontoxml-operations/src/addTransform.js';
import selectionManager from 'fontoxml-selection/src/selectionManager.js';
import dataProviders from './dataProviders.js';
import DocumentBrowserModal from './documents/DocumentBrowserModal.jsx';
import DocumentTemplateBrowserModal from './documents/DocumentTemplateBrowserModal.jsx';
import DocumentWithLinkSelectorBrowserModal from './documents/DocumentWithLinkSelectorBrowserModal.jsx';
import ImageBrowserModal from './images/ImageBrowserModal.jsx';
import CreateDocumentModalStack from './stacks/CreateDocumentModalStack.jsx';
import OpenOrCreateDocumentModalStack from './stacks/OpenOrCreateDocumentModalStack.jsx';
import AttachmentBrowserModal from './attachments/AttachmentBrowserModal.jsx';

const cmsBrowserUploadMimeTypesToAccept = configurationManager.get(
	'cms-browser-upload-mime-types-to-accept'
);

const cmsBrowserUploadMaxFileSizeInBytes = configurationManager.get(
	'cms-browser-upload-max-file-size-in-bytes'
);

export default function install() {
	addTransform(
		'setBrowseContextToFocusedDocumentOrTopLevelDocumentFromHierarchy',
		function setBrowseContextToFocusedDocumentOrTopLevelDocumentFromHierarchy(stepData) {
			// Use the existing value if set or explicitly omitted
			if (stepData.browseContextDocumentId || stepData.browseContextDocumentId === null) {
				return stepData;
			}

			// Use the focused document
			if (selectionManager.focusedDocumentId) {
				stepData.browseContextDocumentId = documentsManager.getRemoteDocumentId(
					selectionManager.focusedDocumentId
				);
				return stepData;
			}

			// Use the first loaded document in the hierarchy
			var browseContextHierarchyNode = documentsHierarchy.find(function(hierarchyNode) {
				return (
					hierarchyNode.documentReference &&
					hierarchyNode.documentReference.remoteDocumentId
				);
			});
			stepData.browseContextDocumentId = browseContextHierarchyNode
				? browseContextHierarchyNode.documentReference.remoteDocumentId
				: null;

			return stepData;
		}
	);

	dataProviders.set('dataProviderUsingConfiguredConnectorsForDocuments', {
		assetTypes: ['document'],
		resultTypes: ['file', 'folder'],
		rootFolderLabel: t('Document library')
	});
	dataProviders.set('dataProviderUsingConfiguredConnectorsForDocumentTemplates', {
		assetTypes: ['document-template'],
		resultTypes: ['file'],
		rootFolderLabel: t('Templates')
	});
	dataProviders.set('dataProviderUsingConfiguredConnectorsForDocumentFolders', {
		assetTypes: ['document'],
		resultTypes: ['folder'],
		rootFolderLabel: t('Document library')
	});
	dataProviders.set('dataProviderUsingConfiguredConnectorsForImages', {
		assetTypes: ['image'],
		resultTypes: ['file', 'folder'],
		rootFolderLabel: t('Image library'),
		uploadAssetType: 'image',
		uploadMimeTypesToAccept: cmsBrowserUploadMimeTypesToAccept,
		uploadMaxFileSizeInBytes: cmsBrowserUploadMaxFileSizeInBytes
	});
	dataProviders.set('dataProviderUsingConfiguredConnectorsForAttachments', {
			assetTypes: ['attachment'],
			resultTypes: ['file', 'folder'],
			rootFolderLabel: t('Attachments'),
			uploadAssetType: 'file',
			uploadMimeTypesToAccept: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/acad,image/vnd.dwg,image/x-dwg,drawing/x-dwf,model/vnd.dwf,model/vnd.dwfx,application/excel,application/vnd.ms-excel,application/x-excel,application/x-msexcel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/mspowerpoint,application/powerpoint,application/vnd.ms-powerpoint,application/x-mspowerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,application/rtf,application/x-rtf,text/richtext,application/xml,text/xml,application/x-compressed,application/x-zip-compressed,application/zip,multipart/x-zip",
			uploadMaxFileSizeInBytes: cmsBrowserUploadMaxFileSizeInBytes
		}
	);
	dataProviders.set('dataProviderUsingConfiguredConnectorsForAttachmentFolders', {
			assetTypes: ['attachment'],
			resultTypes: ['folder'],
			rootFolderLabel: t('Image library')
		}
	);

	uiManager.registerReactComponent('DocumentBrowserModal', DocumentBrowserModal);
	uiManager.registerReactComponent('DocumentTemplateBrowserModal', DocumentTemplateBrowserModal);
	uiManager.registerReactComponent(
		'DocumentWithLinkSelectorBrowserModal',
		DocumentWithLinkSelectorBrowserModal
	);
	uiManager.registerReactComponent('ImageBrowserModal', ImageBrowserModal);
	uiManager.registerReactComponent('CreateDocumentModalStack', CreateDocumentModalStack);
	uiManager.registerReactComponent(
		'OpenOrCreateDocumentModalStack',
		OpenOrCreateDocumentModalStack
	);
	uiManager.registerReactComponent('AttachmentBrowserModal', AttachmentBrowserModal);
}
