/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media/mediastyle/mediastyleediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaStyleCommand from './mediastylecommand';
import { viewToModelStyleAttribute, modelToViewStyleAttribute } from './converters';
import { normalizeMediaStyles } from './utils';

/**
 * The media style engine plugin. It sets the default configuration, creates converters and registers
 * {@link module:media/mediastyle/mediastylecommand~MediaStyleCommand MediaStyleCommand}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaStyleEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MediaStyleEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Define default configuration.
		editor.config.define( 'mediaEmbed.styles', [ 'full', 'side' ] );

		// Get configuration.
		const styles = normalizeMediaStyles( editor.config.get( 'mediaEmbed.styles' ) );

		// Allow mediaStyle attribute in media.
		// We could call it 'style' but https://github.com/ckeditor/ckeditor5-engine/issues/559.
		schema.extend( 'media', { allowAttributes: 'mediaStyle' } );

		// Converters for mediaStyle attribute from model to view.
		const modelToViewConverter = modelToViewStyleAttribute( styles );
		editing.downcastDispatcher.on( 'attribute:mediaStyle:media', modelToViewConverter );
		data.downcastDispatcher.on( 'attribute:mediaStyle:media', modelToViewConverter );

		// Converter for figure element from view to model.
		data.upcastDispatcher.on( 'element:div', viewToModelStyleAttribute( styles ), { priority: 'low' } );

		// Register mediaStyle command.
		editor.commands.add( 'mediaStyle', new MediaStyleCommand( editor, styles ) );
	}
}

/**
 * The media style format descriptor.
 *
 *		import fullSizeIcon from 'path/to/icon.svg';
 *
 *		const mediaStyleFormat = {
 *			name: 'fullSize',
 *			icon: fullSizeIcon,
 *			title: 'Full size media',
 *			className: 'media-full-size'
 *		}
 *
 * @typedef {Object} module:media/mediastyle/mediastyleediting~mediaStyleFormat
 *
 * @property {String} name The unique name of the style. It will be used to:
 *
 * * Store the chosen style in the model by setting the `mediaStyle` attribute of the `<media>` element.
 * * As a value of the {@link module:media/mediastyle/mediastylecommand~MediaStyleCommand#execute `mediaStyle` command},
 * * when registering a button for each of the styles (`'mediaStyle:{name}'`) in the
 * {@link module:ui/componentfactory~ComponentFactory UI components factory} (this functionality is provided by the
 * {@link module:media/mediastyle/mediastyleui~mediaStyleUI} plugin).
 *
 * @property {Boolean} [isDefault] When set, the style will be used as the default one.
 * A default style does not apply any CSS class to the view element.
 *
 * @property {String} icon One of the following to be used when creating the style's button:
 *
 * * An SVG icon source (as an XML string).
 * * One of {@link module:media/mediastyle/utils~defaultIcons} to use a default icon provided by the plugin.
 *
 * @property {String} title The style's title.
 *
 * @property {String} className The CSS class used to represent the style in the view.
 */
