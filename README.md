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
new sprite.editor.View(model, canvas);
```

### Controller

The controller translates click events to model changes.

```js
canvas.addEventListener('mousedown', sprite.editor.controllerFor(model, canvas));
```
