/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media/mediastyle/mediastylecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The media style command. It is used to apply different media styles.
 *
 * @extends module:core/command~Command
 */
export default class MediaStyleCommand extends Command {
	/**
	 * Creates an instance of the media style command. Each command instance is handling one style.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat>} styles The styles that this command supports.
	 */
	constructor( editor, styles ) {
		super( editor );

		/**
		 * The name of the default style, if it is present. If there is no default style, it defaults to `false`.
		 *
		 * @readonly
		 * @type {Boolean|String}
		 */
		this.defaultStyle = false;

		/**
		 * A style handled by this command.
		 *
		 * @readonly
		 * @member {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat>} #styles
		 */
		this.styles = styles.reduce( ( styles, style ) => {
			styles[ style.name ] = style;

			if ( style.isDefault ) {
				this.defaultStyle = style.name;
			}

			return styles;
		}, {} );
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = !!element && element.is( 'media' );

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'mediaStyle' ) ) {
			const attributeValue = element.getAttribute( 'mediaStyle' );
			this.value = this.styles[ attributeValue ] ? attributeValue : false;
		} else {
			this.value = this.defaultStyle;
		}
	}

	/**
	 * Executes the command.
	 *
	 *		editor.execute( 'mediaStyle', { value: 'side' } );
	 *
	 * @param {Object} options
	 * @param {String} options.value The name of the style (based on the
	 * {@link module:media/media~mediaConfig#styles `media.styles`} configuration option).
	 * @fires execute
	 */
	execute( options ) {
		const styleName = options.value;

		const model = this.editor.model;
		const mediaElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			// Default style means that there is no `mediaStyle` attribute in the model.
			// https://github.com/ckeditor/ckeditor5-media/issues/147
			if ( this.styles[ styleName ].isDefault ) {
				writer.removeAttribute( 'mediaStyle', mediaElement );
			} else {
				writer.setAttribute( 'mediaStyle', styleName, mediaElement );
			}
		} );
	}
}
