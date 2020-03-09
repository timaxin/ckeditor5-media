/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media/mediastyle/utils
 */

import fullWidthIcon from '@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg';
import leftIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import centerIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
import rightIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';
import { attachLinkToDocumentation } from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

/**
 * Default media styles provided by the plugin that can be referred in the
 * {@link module:media/media~mediaConfig#styles} configuration.
 *
 * Among them, 2 default semantic content styles are available:
 *
 * * `full` is a full–width media without any CSS class,
 * * `side` is a side media styled with the `media-style-side` CSS class.
 *
 * There are also 3 styles focused on formatting:
 *
 * * `alignLeft` aligns the media to the left using the `media-style-align-left` class,
 * * `alignCenter` centers the media using the `media-style-align-center` class,
 * * `alignRight` aligns the media to the right using the `media-style-align-right` class,
 *
 * @member {Object.<String,Object>}
 */
const defaultStyles = {
	// This option is equal to the situation when no style is applied.
	full: {
		name: 'full',
		title: 'Full size media',
		icon: fullWidthIcon,
		isDefault: true
	},

	// This represents a side media.
	side: {
		name: 'side',
		title: 'Side media',
		icon: rightIcon,
		className: 'media-style-side'
	},

	// This style represents an media aligned to the left.
	alignLeft: {
		name: 'alignLeft',
		title: 'Left aligned media',
		icon: leftIcon,
		className: 'media-style-align-left'
	},

	// This style represents a centered media.
	alignCenter: {
		name: 'alignCenter',
		title: 'Centered media',
		icon: centerIcon,
		className: 'media-style-align-center'
	},

	// This style represents an media aligned to the right.
	alignRight: {
		name: 'alignRight',
		title: 'Right aligned media',
		icon: rightIcon,
		className: 'media-style-align-right'
	}
};

/**
 * Default media style icons provided by the plugin that can be referred in the
 * {@link module:media/media~mediaConfig#styles} configuration.
 *
 * There are 4 icons available: `'full'`, `'left'`, `'center'` and `'right'`.
 *
 * @member {Object.<String, String>}
 */
const defaultIcons = {
	full: fullWidthIcon,
	left: leftIcon,
	right: rightIcon,
	center: centerIcon
};

/**
 * Returns a {@link module:media/media~mediaConfig#styles} array with items normalized in the
 * {@link module:media/mediastyle/mediastyleediting~mediaStyleFormat} format and a complete `icon` markup for each style.
 *
 * @returns {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat>}
 */
export function normalizeMediaStyles( configuredStyles = [] ) {
	return configuredStyles.map( _normalizeStyle );
}

// Normalizes an media style provided in the {@link module:media/media~mediaConfig#styles}
// and returns it in a {@link module:media/mediastyle/mediastyleediting~mediaStyleFormat}.
//
// @param {Object} style
// @returns {@link module:media/mediastyle/mediastyleediting~mediaStyleFormat}
function _normalizeStyle( style ) {
	// Just the name of the style has been passed.
	if ( typeof style == 'string' ) {
		const styleName = style;

		// If it's one of the defaults, just use it.
		if ( defaultStyles[ styleName ] ) {
			// Clone the style to avoid overriding defaults.
			style = Object.assign( {}, defaultStyles[ styleName ] );
		}
		// If it's just a name but none of the defaults, warn because probably it's a mistake.
		else {
			console.warn(
				attachLinkToDocumentation( 'media-style-not-found: There is no such media style of given name.' ),
				{ name: styleName }
			);

			// Normalize the style anyway to prevent errors.
			style = {
				name: styleName
			};
		}
	}
	// If an object style has been passed and if the name matches one of the defaults,
	// extend it with defaults – the user wants to customize a default style.
	// Note: Don't override the user–defined style object, clone it instead.
	else if ( defaultStyles[ style.name ] ) {
		const defaultStyle = defaultStyles[ style.name ];
		const extendedStyle = Object.assign( {}, style );

		for ( const prop in defaultStyle ) {
			// eslint-disable-next-line no-prototype-builtins
			if ( !style.hasOwnProperty( prop ) ) {
				extendedStyle[ prop ] = defaultStyle[ prop ];
			}
		}

		style = extendedStyle;
	}

	// If an icon is defined as a string and correspond with a name
	// in default icons, use the default icon provided by the plugin.
	if ( typeof style.icon == 'string' && defaultIcons[ style.icon ] ) {
		style.icon = defaultIcons[ style.icon ];
	}

	return style;
}
