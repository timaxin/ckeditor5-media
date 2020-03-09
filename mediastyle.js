/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media/mediastyle
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaStyleEditing from './mediastyle/mediastyleediting';
import MediaStyleUI from './mediastyle/mediastyleui';

/**
 * The media style plugin.
 *
 * For a detailed overview, check the {@glink features/media#media-styles media styles} documentation.
 *
 * This is a "glue" plugin which loads the {@link module:media/mediastyle/mediastyleediting~MediaStyleEditing}
 * and {@link module:media/mediastyle/mediastyleui~MediaStyleUI} plugins.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaStyle extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ MediaStyleEditing, MediaStyleUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MediaStyle';
	}
}

/**
 * Available media styles.
 *
 * The default value is:
 *
 *		const mediaConfig = {
 *			styles: [ 'full', 'side' ]
 *		};
 *
 * which configures two default styles:
 *
 *  * the "full" style which does not apply any class, e.g. for medias styled to span 100% width of the content,
 *  * the "side" style with the `.media-style-side` CSS class.
 *
 * See {@link module:media/mediastyle/utils~defaultStyles} to learn more about default
 * styles provided by the media feature.
 *
 * The {@link module:media/mediastyle/utils~defaultStyles default styles} can be customized,
 * e.g. to change the icon, title or CSS class of the style. The feature also provides several
 * {@link module:media/mediastyle/utils~defaultIcons default icons} to choose from.
 *
 *		import customIcon from 'custom-icon.svg';
 *
 *		// ...
 *
 *		const mediaConfig = {
 *			styles: [
 *				// This will only customize the icon of the "full" style.
 *				// Note: 'right' is one of default icons provided by the feature.
 *				{ name: 'full', icon: 'right' },
 *
 *				// This will customize the icon, title and CSS class of the default "side" style.
 *				{ name: 'side', icon: customIcon, title: 'My side style', className: 'custom-side-media' }
 *			]
 *		};
 *
 * If none of the default styles is good enough, it is possible to define independent custom styles, too:
 *
 *		import fullSizeIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
 *		import sideIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';
 *
 *		// ...
 *
 *		const mediaConfig = {
 *			styles: [
 *				// A completely custom full size style with no class, used as a default.
 *				{ name: 'fullSize', title: 'Full size', icon: fullSizeIcon, isDefault: true },
 *
 *				{ name: 'side', title: 'To the side', icon: sideIcon, className: 'side-media' }
 *			]
 *		};
 *
 * Note: Setting `title` to one of {@link module:media/mediastyle/mediastyleui~MediaStyleUI#localizedDefaultStylesTitles}
 * will automatically translate it to the language of the editor.
 *
 * Read more about styling medias in the {@glink features/media#media-styles media styles guide}.
 *
 * The feature creates commands based on defined styles, so you can change the style of a selected media by executing
 * the following command:
 *
 *		editor.execute( 'mediaStyle' { value: 'side' } );
 *
 * The feature also creates buttons that execute the commands. So, assuming that you use the
 * default media styles setting, you can {@link module:media/media~mediaConfig#toolbar configure the media toolbar}
 * (or any other toolbar) to contain these options:
 *
 *		const mediaConfig = {
 *			toolbar: [ 'mediaStyle:full', 'mediaStyle:side' ]
 *		};
 *
 * @member {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat>} module:media/media~mediaConfig#styles
 */
