(function(sprite){
	var model = new sprite.editor.Model(30, 30);
	model.paintPixel(0,0);
	model.paintPixel(29, 0);
	model.paintPixel(29, 29);
	model.paintPixel(0, 29);

	var canvas = document.getElementById('pixel-editor');
	new sprite.editor.View(model, canvas);
})(sprite);
