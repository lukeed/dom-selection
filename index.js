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
