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
	Model.prototype.forEachPixel = function(callback){
		for (var x in this.pixels) {
			for (var y in this.pixels[x]) {
				callback(x, y, this.pixels[x][y]);
			}
		}
	};

	var View = sprite.editor.View = function(model, canvas){
		this.model = model;
		this.canvas = canvas;
		this.initialize();
		this.update();
	};
	View.prototype.initialize = function(){
		this.pixelSize = Math.max(
			this.canvas.width/this.model.columns,
			this.canvas.height/this.model.rows
		);
		this.context = this.canvas.getContext('2d');
		this.horizontalOffset = (this.canvas.width - this.model.columns * this.pixelSize)/2;
		this.verticalOffset = (this.canvas.height - this.model.rows * this.pixelSize)/2;
	};
	View.prototype.update = function(){
		this.model.forEachPixel(function(x, y, color){
			this.context.save();
			this.context.fillStyle = color;
			this.context.fillRect(
				x * this.pixelSize + this.horizontalOffset,
				y * this.pixelSize + this.verticalOffset,
				this.pixelSize,
				this.pixelSize
			);
			this.context.restore();
		}.bind(this));
		this.grid();
	};
	View.prototype.grid = function(){
		this.context.save();
		this.context.strokeStyle = 'gray';
		this.context.beginPath();
		for (var x = 0; x <= this.model.columns; x++) {
			this.context.moveTo(x * this.pixelSize, 0);
			this.context.lineTo(x * this.pixelSize, this.canvas.height);
		}
		for (var y = 0; y <= this.model.columns; y++) {
			this.context.moveTo(0, y * this.pixelSize);
			this.context.lineTo(this.canvas.width, y * this.pixelSize);
		}
		this.context.stroke();
		this.context.restore();
	}

})(window.sprite = window.sprite || {});
