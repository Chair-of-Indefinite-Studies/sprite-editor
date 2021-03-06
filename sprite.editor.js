;(function(ns, sprite, undefined){
    var editor = sprite.editor = {};

    var defaultModelOptions = {
        'brushColor': 'black',
        'uncolored': 'none'
    }

    var Model = editor.Model = function(columns, rows, options){
        ns.Observable.call(this);
        options = options || {};
        for (var key in defaultModelOptions) {
            this[key] = options[key] !== undefined ? options[key] : defaultModelOptions[key];
        }
        this.columns = columns;
        this.rows = rows;
        this.pixels = {};
    };
    Model.prototype = Object.create(ns.Observable.prototype);
    Model.prototype.constructor = Model;
    Model.prototype.paintPixel = function(x, y){
        if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) {
            throw new Error('Not within bounds: (' + x + ',' + y + ')');
        }
        var column = this.pixels[x] = this.pixels[x] || {};
        column[y] = this.brushColor;
        this.signal('paint', x, y, this.brushColor);
    };
    Model.prototype.colorAt = function(x, y){
        if (this.pixels[x] && this.pixels[x][y]) {
            return this.pixels[x][y];
        }
        return this.uncolored;
    }
    Model.prototype.setDimensions = function(columns, rows){
        this.columns = Math.max(columns, 1);
        this.rows = Math.max(rows, 1);
        this.signal('dimension', this.columns, this.rows);
    }
    Model.prototype.increaseColumns = function(){
        this.setDimensions(this.columns + 1, this.rows);
    }
    Model.prototype.decreaseColumns = function(){
        if (this.columns > 1) { delete this.pixels[this.columns - 1]; }
        this.setDimensions(this.columns - 1, this.rows);
    }
    Model.prototype.increaseRows = function(){
        this.setDimensions(this.columns, this.rows + 1);
    }
    Model.prototype.decreaseRows = function(){
        if(this.rows > 1){
            for(var column in this.pixels) {
                delete this.pixels[column][this.rows - 1];
            }
        }
        this.setDimensions(this.columns, this.rows - 1);
    }
    Model.prototype.changeBrushColor = function(color){
        this.brushColor = color !== undefined ? color : defaultModelOptions.brushColor;
        this.signal('color', this.brushColor);
    }
    Model.prototype.reset = function(){
        this.pixels = {};
        this.signal('reset');
    }
    Model.prototype.clone = function(original){
        this.reset();
        this.setDimensions(original.columns, original.rows);
        original.forEachPixel(function(x, y, color){
            this.changeBrushColor(color);
            this.paintPixel(x, y);
        }.bind(this));
    }
    Model.prototype.forEachPixel = function(callback){
        for (var x in this.pixels) {
            for (var y in this.pixels[x]) {
                callback(
                    Number.parseInt(x),
                    Number.parseInt(y),
                    this.pixels[x][y]
                );
            }
        }
    };

    var View = sprite.editor.View = function(model, canvas){
        this.model = model;
        this.canvas = canvas;
        this.model.on('paint', this.update.bind(this));
        this.model.on('dimension', this.initialize.bind(this));
        this.initialize();
    };
    View.prototype.initialize = function(){
        this.pixelSize = Math.min(
            this.canvas.width/this.model.columns,
            this.canvas.height/this.model.rows
        );
        this.context = this.canvas.getContext('2d');
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.horizontalOffset = (this.canvas.width - this.model.columns * this.pixelSize)/2;
        this.verticalOffset = (this.canvas.height - this.model.rows * this.pixelSize)/2;
        this.updateAll();
    };
    View.prototype.updateAll = function(){
        this.model.forEachPixel(function(x, y, color){
            this.update(x, y, color)
        }.bind(this));
        this.grid();
    };
    View.prototype.update = function(x, y, color){
        this.context.save();
        this.context.clearRect(
            x * this.pixelSize + this.horizontalOffset,
            y * this.pixelSize + this.verticalOffset,
            this.pixelSize,
            this.pixelSize
        );
        this.context.fillStyle = color;
        this.context.fillRect(
            x * this.pixelSize + this.horizontalOffset,
            y * this.pixelSize + this.verticalOffset,
            this.pixelSize,
            this.pixelSize
        );
        this.context.restore();
        this.grid();
    };
    View.prototype.grid = function(){
        this.context.save();
        this.context.strokeStyle = 'gray';
        this.context.beginPath();
        for (var x = 0; x <= this.model.columns; x++) {
            this.context.moveTo(
                x * this.pixelSize + this.horizontalOffset,
                this.verticalOffset
            );
            this.context.lineTo(
                x * this.pixelSize + this.horizontalOffset,
                this.canvas.height - this.verticalOffset
            );
        }
        for (var y = 0; y <= this.model.rows; y++) {
            this.context.moveTo(
                this.horizontalOffset,
                y * this.pixelSize + this.verticalOffset
            );
            this.context.lineTo(
                this.canvas.width - this.horizontalOffset,
                y * this.pixelSize + this.verticalOffset
            );
        }
        this.context.stroke();
        this.context.restore();
    }

    var Controller = function(model, view, canvas){
        this.model = model;
        this.view = view;
        this.canvas = canvas;
        this.drawing = false;
        this.boundReceivePaintEvent = this.receivePaintEvent.bind(this);
    };
    Controller.prototype.startDrawing = function(event){
        if (!this.drawing) {
            this.drawing = true;
            this.boundReceivePaintEvent(event);
            this.canvas.addEventListener('mousemove', this.boundReceivePaintEvent);
        }
    };
    Controller.prototype.stopDrawing = function(event){
        if (this.drawing) {
            this.drawing = false;
            this.boundReceivePaintEvent(event);
            this.canvas.removeEventListener('mousemove', this.boundReceivePaintEvent);
        }
    };
    Controller.prototype.receivePaintEvent = function(event){
        var x = event.clientX - this.view.horizontalOffset - this.canvas.offsetLeft;
        var y = event.clientY - this.view.verticalOffset - this.canvas.offsetTop;

        var column = Math.floor(x/this.view.pixelSize);
        var row = Math.floor(y/this.view.pixelSize);

        try {
            this.model.paintPixel(column, row);
        } catch(e) {
            if (!e.message.match(/^Not within bounds/)) {
                throw e;
            }
        }
    };

    editor.controllerFor = function(model, view, canvas){
        return new Controller(model, view, canvas);
    };
})(ns, window.sprite = window.sprite || {});
