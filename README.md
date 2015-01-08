sprite-editor
=============

A canvas based editor to create sprites.

Usage
-----

The sprite-editor is composed of the following parts.

### Model

A model is created to keep track of which pixels are set to what
color.

```js
var model = new sprite.editor.Model(10, 6);
```

### View

The view is responsible for showing the resulting sprite.

```js
var canvas = document.getElementById('sprite-editor');
var view = new sprite.editor.View(model, canvas);
```

### Controller

The controller translates click events to model changes.

```js
var controller = sprite.editor.controllerFor(model, view, canvas);
canvas.addEventListener('mousedown', controller.startDrawing.bind(controller));
canvas.addEventListener('mouseup', controller.stopDrawing.bind(controller));
```

API
---

The model responds to the following API

### Constructor

* **columns**: the number of columns the sprite will be wide.
* **rows**: the number of rows the sprite will be high.
* **options** _optional_: an options hash that support the following
keys

* **brushColor** that defaults to `black`
* **uncolored** that defaults to `none`

### paintPixel

Paints a pixel of the sprite.

* **x**: the `x`-coordinate of the pixel that will be painted.
* **y**: the `y`-coordinate of the pixel that will be painted.

If either the `x`-coordinate or the `y`-coordinate is out of bounds an
exception is thrown.

### colorAt

Returns the color of the pixel at the coordinate

* **x**: the `x`-coordinate of the pixel that is inspected.
* **y**: the `y`-coordinate of the pixel that is inspected.

### changeBrushColor

Changes the color of the brush with pixels are painted.

* **color** a string representing the color which to paint.

### forEachPixel

Iterator for the pixels that are defined.

* **callback** a callback that will be called for each pixel that is
painted. It gets passed the following arguments

1. **x**: the `x`-coordinate of the pixel.
2. **y**: the `y`-coordinate of the pixel.
3. **color**: the color of the pixel.
