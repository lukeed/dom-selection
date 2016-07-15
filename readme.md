# dom-selection [![Build Status](https://travis-ci.org/lukeed/dom-selection.svg?branch=master)](https://travis-ci.org/lukeed/dom-selection)

> A lightweight, cross-browser library for DOM selections and ranges. IE9+


## Install

```
$ npm install --save dom-selection
# or
$ bower install --save dom-selection
```

You may also [download the repo](https://github.com/lukeed/dom-selection/archive/master.zip) directly.


## Usage

This package is available as a AMD and a CommonJS module, so you may import it directly into your JavaScript:

```js
const domSel = require('dom-selection');
```

Or you may import it directly into your HTML markup:

```html
<script src="dom-selection.min.js"></script>
<script>
  // the 'DOMSelection' global is now available
  var range = DOMSelection.getRange();
</script>
```

## API

The parameter `[sel]` indicates that an existing `Selection` object may be provided. By default, the current, active `Selection` will be used if available.

### getRange([sel])

Get a `Selection`'s Range.<br>
Returns: `Range`


### setRange(saved, [sel])

Restore a `Range` to a `Selection`.

> #### saved
> Type: `Range`

> The `Range` to apply.


### getRect([sel])

Get a `Selection`'s rectangular bounds.<br>
Returns: `Object` or `false`


### getNodes([sel])

Get all `Node`s within a `Selection`.<br>
Returns: `Array`


### getHTML([sel])

Get the inner HTML content of a `Selection`.<br>
Returns: `String`


### isCollapsed([sel])

Is there a `Selection` active?<br>
Returns: `Boolean`


### collapseStart([sel])

Collapse a `Selection` to its beginning.


### collapseEnd([sel])

Collapse a `Selection` to its endpoint.


### isBackwards([sel])

Check if the direction of the `Selection` was RTL.<br>
Returns: `Boolean`


### isWithin(container, [sel])

Is the `Selection` within given container `Node`?<br>
Returns: `Boolean`

> #### container
> Type: `Node`

> The DOM element to check.


### forceWithin(container, [sel])

Force/Restrict a `Selection` to the container & its children only.

> #### container
> Type: `Node`

> The DOM element that should be the boundary.


### expandToWord([sel])

Expand the `Selection` to include the full word that the Caret is (partially) within.


### getCaretWord([sel])

Get the full word that the Caret is within.<br>
Returns: `String`


### forceInclude([sel])

Force the `Selection` to include entire words. Can be thought of as "snap to words".


## License

MIT © [Luke Edwards](https://lukeed.com)
