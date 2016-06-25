'use strict';

var nextNode = require('next-node');

var win = window;
var doc = document;

/**
 * Get a Selection's Range
 * @see http://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376#13950376
 * @param {Selection} sel
 * @return {Range|null}
 */
function getRange(sel) {
	sel = sel || win.getSelection();
	return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
}

/**
 * Restore a Selection Range
 * @see http://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376#13950376
 * @param {Range} saved
 */
function setRange(saved) {
	if (!saved) return;
	// new selection
	var sel = win.getSelection();
	sel.removeAllRanges();
	sel.addRange(saved);
}

/**
 * Get a Selection Rectangle
 * @see http://stackoverflow.com/questions/12603397/calculate-width-height-of-the-selected-text-javascript
 * @see http://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
 * @param {Selection} sel
 * @return {Object|Boolean}
 */
function getRect(sel) {
	sel = sel || win.getSelection();
	if (!sel.rangeCount) return false;

	var range = sel.getRangeAt(0).cloneRange();

	// on Webkit 'range.getBoundingClientRect()' sometimes return 0/0/0/0 - but 'range.getClientRects()' works
	var rects = range.getClientRects ? range.getClientRects() : [];
	for (var i = 0; i < rects.length; ++i) {
		var rect = rects[i];
		if (rect.left && rect.top && rect.right && rect.bottom) {
			return {
				// Modern browsers return floating-point numbers
				left: parseInt(rect.left),
				top: parseInt(rect.top),
				width: parseInt(rect.right - rect.left),
				height: parseInt(rect.bottom - rect.top)
			};
		}
	}

	return false;
}

/**
 * Is there a Selection active?
 * @param {Selection} sel
 * @return {Boolean}
 */
function isCollapsed(sel) {
	return (sel || win.getSelection()).isCollapsed;
}

/**
 * Collapse a Selection to its beginning.
 * @param {Selection} sel
 * @see  http://stackoverflow.com/questions/8513368/collapse-selection-to-start-of-selection-not-div
 */
function collapseStart(sel) {
	(sel || win.getSelection()).collapseToStart();
}

/**
 * Collapse a Selection to its endpoint.
 * @param {Selection} sel
 */
function collapseEnd(sel) {
	(sel || win.getSelection()).collapseToEnd();
}
