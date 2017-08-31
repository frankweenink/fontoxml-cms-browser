import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { GridItem, Icon, Label, ListItem, SpinnerIcon, StateMessage, TextLink } from 'fontoxml-vendor-fds/components';

import FileOrFolderBrowser from '../../browsers/file-or-folders/FileOrFolderBrowser.jsx';
import dataProviders from '../../dataProviders';
import FxDocumentLoader from '../../loaders/documents/FxDocumentLoader.jsx';
import FxDocumentPreview from '../../previews/documents/FxDocumentPreview.jsx';

class FxDocumentBrowser extends Component {
	constructor (props) {
		super(props);

		this.state = {
			// In state, this component's render method does directly depend on it (see render(List|Grid)Item below).
			cachedDocumentIdByRemoteDocumentId: {},
			cachedErrorByRemoteDocumentId: {},

			viewMode: 'list'
		};
	}

	render () {
		const { dataProviderName, browseContextDocumentId, onDocumentSelect, onDocumentOpen, labels } = this.props;
		const { cachedDocumentIdByRemoteDocumentId, cachedErrorByRemoteDocumentId, viewMode } = this.state;

		const rootFolder = { label: labels.rootFolderLabel, type: 'folder', id: null };

		const dataProvider = dataProviders.get(dataProviderName);

		return (
			<FileOrFolderBrowser
				rootFolder={ rootFolder }
				getFolderContents={ (folder, noCache) => (
					dataProvider.getFolderContents(browseContextDocumentId, rootFolder, folder.id, noCache)
				) }
				onFileOpen={ onDocumentOpen }
				onFileOrFolderSelect={ () => onDocumentSelect(null) }
				onViewModeChange={ (viewMode) => this.setState({ viewMode }) }
				renderLoadingMessage={ () => (
					<StateMessage visual={ <SpinnerIcon align='center' /> } { ...labels.states.loading } />
				) }
				renderBrowseErrorMessage={ () => (
					<StateMessage connotation='warning' visual='exclamation-triangle' { ...labels.states.browseError } />
				) }
				renderEmptyMessage={ () => <StateMessage visual='folder-open-o' { ...labels.states.empty } /> }
				renderGoToFolderLink={ (folder) => {
					return folder.externalUrl ?
						<TextLink icon='external-link' onClick={ () => window.open(folder.externalUrl) } /> :
						null;
				} }
				renderListItem={ ({ key, item, isSelected, isDisabled, onClick, onDoubleClick }) => {
					if (item.type !== 'folder') {
						if (cachedErrorByRemoteDocumentId[item.id]) {
							return (
								<ListItem key={ key } isSelected={ isSelected } onClick={ onClick }>
									<Icon icon={ item.icon || 'file-text-o' } colorName='icon-s-error-color' size='s' />
									<Label colorName='text-muted-color'>{ item.label }</Label>
								</ListItem>
							);
						}
						else if (!cachedDocumentIdByRemoteDocumentId[item.id]) {
							return (
								<ListItem key={ key } isSelected={ isSelected } isDisabled={ isDisabled } onClick={ onClick }>
									<Icon icon={ item.icon || 'file-text-o' } size='s' />
									<Label>{ item.label }</Label>
								</ListItem>
							);
						}
					}

					return (
						<ListItem key={ key } isSelected={ isSelected } isDisabled={ isDisabled } onClick={ onClick } onDoubleClick={ onDoubleClick }>
							<Icon icon={ item.icon } size='s' />
							<Label>{ item.label }</Label>
						</ListItem>
					);
				} }
				renderGridItem={ ({ key, item, isSelected, isDisabled, onClick, onDoubleClick }) => {
					if (item.type !== 'folder') {
						if (cachedErrorByRemoteDocumentId[item.id]) {
							return (
								<GridItem key={ key } isSelected={ isSelected } onClick={ onClick }>
									<Icon icon={ item.icon || 'file-text-o' } colorName='icon-m-error-color' size='m' align='center' />
									<Label align='center' colorName='text-muted-color' isFullWidth>{ item.label }</Label>
								</GridItem>
							);
						}
						else if (!cachedDocumentIdByRemoteDocumentId[item.id]) {
							return (
								<GridItem key={ key } isSelected={ isSelected } isDisabled={ isDisabled } onClick={ onClick }>
									<Icon icon={ item.icon || 'file-text-o' } size='m' align='center' />
									<Label align='center' isFullWidth>{ item.label }</Label>
								</GridItem>
							);
						}
					}

					return (
						<GridItem key={ key } isSelected={ isSelected } isDisabled={ isDisabled } onClick={ onClick } onDoubleClick={ onDoubleClick }>
							<Icon icon={ item.icon } size='m' align='center' />
							<Label align='center' isFullWidth>{ item.label }</Label>
						</GridItem>
					);
				} }
				renderPreview={ (selectedFileOrFolder) => {
					if (selectedFileOrFolder.type === 'folder') {
						return null;
					}

					const selectedFile = { ...selectedFileOrFolder };

					return (
						<FxDocumentLoader
							onError={ (error) => {
								cachedErrorByRemoteDocumentId[selectedFile.id] = error;
								this.setState({ cachedErrorByRemoteDocumentId });

								onDocumentSelect(null);
							} }
							onLoadComplete={ (documentId) => {
								cachedDocumentIdByRemoteDocumentId[selectedFile.id] = documentId;
								this.setState({ cachedDocumentIdByRemoteDocumentId });

								onDocumentSelect(selectedFile);
							} }
							renderLoadingMessage={ () => (
								<StateMessage
									visual={ <SpinnerIcon align='center' /> }
									paddingSize='l'
									{ ...labels.states.loadingPreview }
								/>
							) }
							remoteDocumentId={ selectedFile.id }>
							{ (documentId, error) => {
								if (error) {
									return (
										<StateMessage
											connotation='warning'
											visual='exclamation-triangle'
											paddingSize='l'
											{ ...labels.states.previewError }
										/>
									);
								}

								return <FxDocumentPreview documentId={ documentId } />;
							} }
						</FxDocumentLoader>
					);
				} }
				showBreadcrumbs
				viewMode={ viewMode }
			/>
		);
	}
}

FxDocumentBrowser.propTypes = {
	onDocumentOpen: PropTypes.func.isRequired,
	onDocumentSelect: PropTypes.func.isRequired,
	browseContextDocumentId: PropTypes.string
};

FxDocumentBrowser.defaultProps = {
	browseContextDocumentId: null
};

export default FxDocumentBrowser;
