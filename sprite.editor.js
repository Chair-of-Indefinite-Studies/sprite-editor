;(function(sprite, undefined){
	var Observable = function(){
		this.observers = {};
	};
	Observable.prototype.on = function(event, callback){
		(this.observers[event] = this.observers[event] || []).push(callback);
	};
	Observable.prototype.signal = function(event){
		var args = Array.prototype.slice.call(arguments, 1);
		(this.observers[event] || []).forEach(function(observer){
			observer.apply(this, args);
		}.bind(this));
	};

	var editor = sprite.editor = {};

	var defaultModelOptions = {
		'brushColor': 'black',
		'uncolored': 'none'
	}

	var Model = editor.Model = function(columns, rows, options){
		Observable.call(this);
		options = options || {};
		for (var key in defaultModelOptions) {
			this[key] = options[key] !== undefined ? options[key] : defaultModelOptions[key];
		}
		this.columns = columns;
		this.rows = rows;
		this.pixels = {};
	};
	Model.prototype = Object.create(Observable.prototype);
	Model.prototype.constructor = Model;
	Model.prototype.paintPixel = function(x, y){
		var column = this.pixels[x] = this.pixels[x] || {};
		column[y] = this.brushColor;
		this.signal('paint', x, y, this.brushColor);
	};
	Model.prototype.colorAt = function(x, y){
		if (this.pixels[x] && this.pixels[y]) {
			return this.pixels[x][y];
		}
		return this.uncolored;
	}
	Model.prototype.changeBrushColor = function(color){
		this.brushColor = color !== undefined ? color : defaultModelOptions.brushColor;
		this.signal('color', this.brushColor);
	}
})(window.sprite = window.sprite || {});
