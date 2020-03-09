/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media/mediatoolbar
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { getSelectedMediaViewWidget } from '@ckeditor/ckeditor5-media-embed/src/utils';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';

/**
 * The media toolbar plugin. It creates and manages the media toolbar (the toolbar displayed when an media is selected).
 *
 * For a detailed overview, check the {@glink features/media#media-contextual-toolbar media contextual toolbar} documentation.
 *
 * Instances of toolbar components (e.g. buttons) are created using the editor's
 * {@link module:ui/componentfactory~ComponentFactory component factory}
 * based on the {@link module:media/media~mediaConfig#toolbar `media.toolbar` configuration option}.
 *
 * The toolbar uses the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaToolbar extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ WidgetToolbarRepository ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MediaToolbar';
	}

	/**
	 * @inheritDoc
	 */
	afterInit() {
		const editor = this.editor;
		const t = editor.t;
		const widgetToolbarRepository = editor.plugins.get( WidgetToolbarRepository );

		widgetToolbarRepository.register( 'media', {
			ariaLabel: t( 'Media toolbar' ),
			items: editor.config.get( 'mediaEmbed.toolbar' ) || [],
			getRelatedElement: getSelectedMediaViewWidget,
		} );
	}
}

/**
 * Items to be placed in the media toolbar.
 * This option is used by the {@link module:media/mediatoolbar~mediaToolbar} feature.
 *
 * Assuming that you use the following features:
 *
 * * {@link module:media/mediastyle~mediaStyle} (with a default configuration),
 * * {@link module:media/mediatextalternative~mediaTextAlternative},
 *
 * three toolbar items will be available in {@link module:ui/componentfactory~ComponentFactory}:
 * `'mediaStyle:full'`, `'mediaStyle:side'`, and `'mediaTextAlternative'` so you can configure the toolbar like this:
 *
 *		const mediaConfig = {
 *			toolbar: [ 'mediaStyle:full', 'mediaStyle:side', '|', 'mediaTextAlternative' ]
 *		};
 *
 * Of course, the same buttons can also be used in the
 * {@link module:core/editor/editorconfig~EditorConfig#toolbar main editor toolbar}.
 *
 * Read more about configuring toolbar in {@link module:core/editor/editorconfig~EditorConfig#toolbar}.
 *
 * @member {Array.<String>} module:media/media~mediaConfig#toolbar
 */
