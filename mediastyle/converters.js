/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * @module media/mediastyle/converters
 */

/**
 * Returns a converter for the `mediaStyle` attribute. It can be used for adding, changing and removing the attribute.
 *
 * @param {Object} styles An object containing available styles. See {@link module:media/mediastyle/mediastyleediting~mediaStyleFormat}
 * for more details.
 * @returns {Function} A model-to-view attribute converter.
 */
export function modelToViewStyleAttribute( styles ) {
	return ( evt, data, conversionApi ) => {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) || data.item.parent.name === 'spoilerContent') {
			return;
		}

		// Check if there is class name associated with given value.
		const newStyle = getStyleByName( data.attributeNewValue, styles );
		const oldStyle = getStyleByName( data.attributeOldValue, styles );

		const viewElement = conversionApi.mapper.toViewElement( data.item );
		const viewWriter = conversionApi.writer;

		if ( oldStyle ) {
			viewWriter.removeClass( oldStyle.className, viewElement );
		}

		if ( newStyle ) {
			viewWriter.addClass( newStyle.className, viewElement );
		}
	};
}

/**
 * Returns a view-to-model converter converting media CSS classes to a proper value in the model.
 *
 * @param {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat>} styles The styles for which the converter is created.
 * @returns {Function} A view-to-model converter.
 */
export function viewToModelStyleAttribute( styles ) {
	// Convert only non–default styles.
	const filteredStyles = styles.filter( style => !style.isDefault );

	return ( evt, data, conversionApi ) => {
		if ( !data.modelRange ) {
			return;
		}

		const viewFigureElement = data.viewItem;
		const modelMediaElement = first( data.modelRange.getItems() );

		// Check if `mediaStyle` attribute is allowed for current element.
		if ( !conversionApi.schema.checkAttribute( modelMediaElement, 'mediaStyle' ) ) {
			return;
		}

		// Convert style one by one.
		for ( const style of filteredStyles ) {
			// Try to consume class corresponding with style.
			if ( conversionApi.consumable.consume( viewFigureElement.parent, { classes: style.className } ) && modelMediaElement.parent.name !== 'spoilerContent' ) {
				// And convert this style to model attribute.
				conversionApi.writer.setAttribute( 'mediaStyle', style.name, modelMediaElement );
			}
		}
	};
}

// Returns the style with a given `name` from an array of styles.
//
// @param {String} name
// @param {Array.<module:media/mediastyle/mediastyleediting~mediaStyleFormat> } styles
// @returns {module:media/mediastyle/mediastyleediting~mediaStyleFormat|undefined}
function getStyleByName( name, styles ) {
	for ( const style of styles ) {
		if ( style.name === name ) {
			return style;
		}
	}
}
