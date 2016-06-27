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
 * Get all Nodes within a selected Range.
 * @see http://stackoverflow.com/questions/7781963/js-get-array-of-all-selected-nodes-in-contenteditable-div
 * @param  {Range} range
 * @return {Array}
 */
function getNodes(range) {
	range = range || getRange();
	if (!range) return [];

	var node = range.startContainer;
	var endNode = range.endContainer;

	// Special case for a range that is contained within a single node
	if (node == endNode) return [node];

	// Iterate nodes until we hit the end container
	var nodes = [];
	while (node && node != endNode) {
		nodes.push(node = nextNode(node));
	}

	// Add partially selected nodes at the start of the range
	node = range.startContainer;
	while (node && node != range.commonAncestorContainer) {
		nodes.unshift(node);
		node = node.parentNode;
	}

	return nodes;
}

/**
 * Get the inner HTML content of a selection.
 * @see http://stackoverflow.com/questions/4652734/return-html-from-a-user-selected-text/4652824#4652824
 * @param {Selection} sel
 * @return {String}
 */
function getHTML(sel) {
	sel = sel || win.getSelection();
	if (!sel.rangeCount || sel.isCollapsed) return null;

	var len = sel.rangeCount;
	var container = doc.createElement('div');

	for (var i = 0; i < len; ++i) {
		container.appendChild(sel.getRangeAt(i).cloneContents());
	}

	return container.innerHTML;
};

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

/**
 * Is the Selection within given container Node?
 * @param {Node} container  The container node
 * @param {Selection} sel
 * @return {Boolean}
 */
function isWithin(container, sel) {
	sel = sel || win.getSelection();
	return container.contains(sel.anchorNode) && container.contains(sel.focusNode);
}

/**
 * Force/Restrict a Selection to the container & its children only.
 * @param {Node} container
 * @param {Selection} sel
 */
function forceWithin(container, sel) {
	sel = sel || win.getSelection();
	var range = doc.createRange();

	range.selectNodeContents(container);
	range.collapse(false);
	sel.removeAllRanges();
	sel.addRange(range);
}
