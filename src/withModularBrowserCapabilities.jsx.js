import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default function withModularBrowserCapabilities(WrappedComponent, initialViewMode = null) {
	return class ModularBrowser extends Component {
		static propTypes = {
			cancelModal: PropTypes.func.isRequired,
			data: PropTypes.object.isRequired,
			submitModal: PropTypes.func.isRequired
		};
		isComponentMounted = false;

		state = {
			// Contains information on the current/last known request
			// { type: initial|search|browse|upload, ?query, ?error, ?resultCount }
			request: {},

			// Contains the items that the user can choose from
			breadcrumbItems: [],

			// Contains the items that the user can choose from
			items: [],

			// The item that is previewed and would be submitted if the user continues
			selectedItem: null,

			// Contains information for the viewMode, for example list or grid
			viewMode: initialViewMode,

			// Contains the already loaded files
			cachedFileByRemoteId: {},

			// Contains the files which failed to load
			cachedErrorByRemoteId: {}
		};

		addCachedFileByRemoteId = (id, file) => {
			const map = this.state.cachedFileByRemoteId;
			map[id] = file;
			this.setState({ cachedFileByRemoteId: map });
		};

		addCachedErrorByRemoteId = (id, error) => {
			const map = this.state.cachedErrorByRemoteId;
			map[id] = error;
			this.setState({ cachedErrorByRemoteId: map });
		};

		deleteCachedFileByRemoteId = id => {
			const map = this.state.cachedFileByRemoteId;
			delete map[id];
			this.setState({ cachedFileByRemoteId: map });
		};

		deleteCachedErrorByRemoteId = id => {
			const map = this.state.cachedErrorByRemoteId;
			delete map[id];
			this.setState({ cachedErrorByRemoteId: map });
		};

		// Used by any component to change the currently selected item
		onItemSelect = item => {
			if (this.isComponentMounted) {
				this.setState({
					selectedItem: item
				});
			}
		};

		// Used by components that changes the visible items
		onUpdateItems = (items, breadcrumbItems, request = this.state.request) => {
			if (this.isComponentMounted) {
				this.setState({
					breadcrumbItems: breadcrumbItems,
					items: items,
					request: request
				});
			}
		};

		// Used by any component that initiates a request
		onUpdateRequest = request => {
			if (this.isComponentMounted) {
				this.setState({
					request: request
				});
			}
		};

		// Used to update the viewMode
		onUpdateViewMode = viewMode => {
			if (this.isComponentMounted) {
				this.setState({
					viewMode: viewMode
				});
			}
		};

		render() {
			const props = {
				...this.props,
				...this.state,
				addCachedErrorByRemoteId: this.addCachedErrorByRemoteId,
				addCachedFileByRemoteId: this.addCachedFileByRemoteId,
				deleteCachedErrorByRemoteId: this.deleteCachedErrorByRemoteId,
				deleteCachedFileByRemoteId: this.deleteCachedFileByRemoteId,
				onItemSelect: this.onItemSelect,
				onUpdateItems: this.onUpdateItems,
				onUpdateRequest: this.onUpdateRequest,
				onUpdateViewMode: this.onUpdateViewMode
			};

			return <WrappedComponent {...props} />;
		}

		componentDidMount() {
			this.isComponentMounted = true;
		}

		componentWillUnmount() {
			this.isComponentMounted = false;
		}
	};
}
