/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media/mediastyle/mediastyleui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { normalizeMediaStyles } from './utils';

/**
 * The media style UI plugin.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaStyleUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MediaStyleUI';
	}

	/**
	 * Returns the default localized style titles provided by the plugin.
	 *
	 * The following localized titles corresponding with
	 * {@link module:media/mediastyle/utils~defaultStyles} are available:
	 *
	 * * `'Full size media'`,
	 * * `'Side media'`,
	 * * `'Left aligned media'`,
	 * * `'Centered media'`,
	 * * `'Right aligned media'`
	 *
	 * @returns {Object.<String,String>}
	 */
	get localizedDefaultStylesTitles() {
		const t = this.editor.t;

		return {
			'Full size media': t( 'Full size media' ),
			'Side media': t( 'Side media' ),
			'Left aligned media': t( 'Left aligned media' ),
			'Centered media': t( 'Centered media' ),
			'Right aligned media': t( 'Right aligned media' )
		};
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const configuredStyles = editor.config.get( 'mediaEmbed.styles' );

		const translatedStyles = translateStyles( normalizeMediaStyles( configuredStyles ), this.localizedDefaultStylesTitles );

		for ( const style of translatedStyles ) {
			this._createButton( style );
		}
	}

	/**
	 * Creates a button for each style and stores it in the editor {@link module:ui/componentfactory~ComponentFactory ComponentFactory}.
	 *
	 * @private
	 * @param {module:media/mediastyle/mediastyleediting~mediaStyleFormat} style
	 */
	_createButton( style ) {
		const editor = this.editor;

		const componentName = `mediaStyle:${ style.name }`;

		editor.ui.componentFactory.add( componentName, locale => {
			const command = editor.commands.get( 'mediaStyle' );
			const view = new ButtonView( locale );

			view.set( {
				label: style.title,
				icon: style.icon,
				tooltip: true,
				isToggleable: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );
			view.bind( 'isOn' ).to( command, 'value', value => value === style.name );

			this.listenTo( view, 'execute', () => editor.execute( 'mediaStyle', { value: style.name } ) );

			return view;
		} );
	}
}

/**
 * Returns the translated `title` from the passed styles array.
 *
 * @param {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat>} styles
 * @param titles
 * @returns {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat>}
 */
function translateStyles( styles, titles ) {
	for ( const style of styles ) {
		// Localize the titles of the styles, if a title corresponds with
		// a localized default provided by the plugin.
		if ( titles[ style.title ] ) {
			style.title = titles[ style.title ];
		}
	}

	return styles;
}
