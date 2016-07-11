(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory); // AMD. Register as an anonymous module.
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.DOMSelection = factory(); // root is `window`
	}
}(this, function () {
	'use strict';

	var win = window;
	var doc = document;
	var ver = '0.1.0';

	/**
	 * Get the next Node within a container; without leaving container.
	 * @see https://github.com/lukeed/next-node
	 * @param  {Node} node      The initial node.
	 * @param  {Node} container The container.
	 * @return {Node}           The next node.
	 */
	function nextNode(node, container) {
		if (node.firstChild) return node.firstChild;
		while (node) {
			// do not walk out of the container
			if (node == container) return null;
			if (node.nextSibling) return node.nextSibling;
			node = node.parentNode;
		}
	};

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
	 * @param {Selection} sel
	 */
	function setRange(saved, sel) {
		if (!saved) return;
		// will make new selection, if unset
		sel = sel || win.getSelection();
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
		var range = doc.createRange();
		range.selectNodeContents(container);
		range.collapse(false);
		setRange(range, sel);
	}

	/**
	 * Expand the Selection to include the full word that the Caret is (partially) within.
	 * @see http://stackoverflow.com/questions/11247737/how-can-i-get-the-word-that-the-caret-is-upon-inside-a-contenteditable-div
	 * @param {Selection} sel
	 */
	function expandToWord(sel) {
		sel = sel || win.getSelection();
		if (sel.modify) {
			var range = getRange(sel);
			collapseStart(sel);
			sel.modify('move', 'backward', 'word');
			sel.modify('extend', 'forward', 'word');
		} else if (sel.type !== 'Control') {
			var range = sel.createRange();
			range.collapse(true);
			range.expand('word');
		}
	}

	/**
	 * Get the full word that the Caret is within.
	 * @see http://stackoverflow.com/questions/11247737/how-can-i-get-the-word-that-the-caret-is-upon-inside-a-contenteditable-div
	 * @param  {Selection} sel
	 * @return {String}
	 */
	function getCaretWord(sel) {
		sel = sel || win.getSelection();
		var rng = getRange(sel);
		expandToWord(sel);
		var str = sel.toString(); // range?
		// Restore selection
		setRange(rng);
		return str;
	}

	/**
	 * Detect the direction of the Selection
	 * @param  {Selection} sel
	 * @return {Boolean}
	 */
	function isBackwards(sel) {
		sel = sel || win.getSelection();
		if (isCollapsed(sel)) return;

		// Detect if selection is backwards
		var range = doc.createRange();
		range.setStart(sel.anchorNode, sel.anchorOffset);
		range.setEnd(sel.focusNode, sel.focusOffset);
		range.detach();

		// if `collapsed` then it's backwards
		return range.collapsed;
	}

	return {
		getRange: getRange,
		setRange: setRange,
		getRect: getRect,
		getNodes: getNodes,
		getHTML: getHTML,
		isCollapsed: isCollapsed,
		isBackwards: isBackwards,
		collapseStart: collapseStart,
		collapseEnd: collapseEnd,
		isWithin: isWithin,
		forceWithin: forceWithin,
		// snapToWord: snapToWord,
		expandToWord: expandToWord,
		getCaretWord: getCaretWord,
		version: ver,
	};
}));
