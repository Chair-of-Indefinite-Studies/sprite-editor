describe('sprite', function(){
	it('it should be defined', function(){
		expect(sprite).toBeDefined();
	});

	it('should have an \'editor\'', function(){
		expect(sprite.editor).toBeDefined();
	});

	describe('editor', function(){
		it('should have a \'Model\'', function(){
			expect('sprite.editor.Model').toBeDefined();
		});

		describe('Model', function(){
			var expectedColumns;
			var expectedRows;

			beforeEach(function(){
				expectedColumns = 4;
				expectedRows = 3;
			});


			it('should set a number of columns and rows', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);

				expect(model.columns).toBe(4);
				expect(model.rows).toBe(3);
			});

			it('should paint pixels', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);

				model.paintPixel(0,0);

				expect(model.colorAt(0,0)).toBe('black');
			});

			it('should set brush color as option', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows, {
					'brushColor': 'red'
				});

				model.paintPixel(0,0);

				expect(model.colorAt(0,0)).toBe('red');
			});

			it('should alter brush color', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);
				model.changeBrushColor('blue')

				model.paintPixel(0,0);

				expect(model.colorAt(0,0)).toBe('blue');
			});

			it('should report \'none\' for uncolored pixels', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);

				expect(model.colorAt(0,0)).toBe('none');

                model.paintPixel(0, 1);

                expect(model.colorAt(0, 0)).toBe('none');
			});

            it('should be able to reset', function(){
                var model = new sprite.editor.Model(expectedColumns, expectedRows);
                model.paintPixel(0, 0);

                model.reset();

                expect(model.colorAt(0, 0)).toBe('none');
            });

			it('should throw an error on out of bounds paint', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);
				expect(function(){ model.paintPixel(-1,0); }).toThrow();
				expect(function(){ model.paintPixel(0,-1); }).toThrow();
				expect(function(){ model.paintPixel(expectedColumns,0); }).toThrow();
				expect(function(){ model.paintPixel(0,expectRows); }).toThrow();
			});

			it('should increase number of rows', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);
				model.increaseRows();

				expect(model.columns).toBe(expectedColumns);
				expect(model.rows).toBe(expectedRows + 1);
			});

			it('should decrease number of columns', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);
				model.decreaseColumns();

				expect(model.columns).toBe(expectedColumns - 1);
				expect(model.rows).toBe(expectedRows);
			});

			it('should decrease number of rows', function(){
				var model = new sprite.editor.Model(expectedColumns, expectedRows);

				model.decreaseRows();

				expect(model.columns).toBe(expectedColumns);
				expect(model.rows).toBe(expectedRows - 1);
			});

			it('should not decrease number of columns below 1', function(){
				var model = new sprite.editor.Model(1, expectedRows);

				model.decreaseColumns();

				expect(model.columns).toBe(1);
				expect(model.rows).toBe(expectedRows);
			});

            it('should clone from original', function(){
                var model = new sprite.editor.Model(1, 1);

                var original = new sprite.editor.Model(2, 2);
                original.paintPixel(0,0);
                model.clone(original);

                expect(model.columns).toBe(2);
                expect(model.rows).toBe(2);
                expect(model.colorAt(0, 0)).toBe('black');
            });


			it('should not decrease number of rows below 1', function(){
				var model = new sprite.editor.Model(expectedColumns, 1);

				model.decreaseRows();

				expect(model.columns).toBe(expectedColumns);
				expect(model.rows).toBe(1);
			});

			describe('notifications', function(){
				it('should notify of pixel paint', function(){
					var notified = false;
					var actualX;
					var actualY;
					var actualColor;
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.on('paint', function(x, y, color){
						notified = true;
						actualX = x;
						actualY = y;
						actualColor = color;
					});

					model.paintPixel(0, 0);

					expect(notified).toBeTruthy();
					expect(actualX).toBe(0);
					expect(actualY).toBe(0);
					expect(actualColor).toBe('black');
				});

				it('should notify of color change', function(){
					var notified = false;
					var actualColor;
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.on('color', function(color){
						notified = true;
						actualColor = color;
					});

					model.changeBrushColor('green');

					expect(notified).toBeTruthy();
					expect(actualColor).toBe('green');
				});

				it('should notify of increase rows', function(){
					var notified = false;
					var actualColumns;
					var actualRows;
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.on('dimension', function(columns, rows){
						notified = true;
						actualColumns = columns;
						actualRows = rows;
					});

					model.increaseRows();

					expect(notified).toBeTruthy();
					expect(actualColumns).toBe(expectedColumns);
					expect(actualRows).toBe(expectedRows + 1);
				});

				it('should notify of increase columns', function(){
					var notified = false;
					var actualColumns;
					var actualRows;
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.on('dimension', function(columns, rows){
						notified = true;
						actualColumns = columns;
						actualRows = rows;
					});

					model.increaseColumns();

					expect(notified).toBeTruthy();
					expect(actualColumns).toBe(expectedColumns + 1);
					expect(actualRows).toBe(expectedRows);
				});

				it('should notify of decrease rows', function(){
					var notified = false;
					var actualColumns;
					var actualRows;
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.on('dimension', function(columns, rows){
						notified = true;
						actualColumns = columns;
						actualRows = rows;
					});

					model.decreaseRows();

					expect(notified).toBeTruthy();
					expect(actualColumns).toBe(expectedColumns);
					expect(actualRows).toBe(expectedRows - 1);
				});

				it('should notify of decrease columns', function(){
					var notified = false;
					var actualColumns;
					var actualRows;
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.on('dimension', function(columns, rows){
						notified = true;
						actualColumns = columns;
						actualRows = rows;
					});

					model.decreaseColumns();

					expect(notified).toBeTruthy();
					expect(actualColumns).toBe(expectedColumns - 1);
					expect(actualRows).toBe(expectedRows);
				});

                it('should notify of reset', function(){
                    var notified = false;
                    var model = new sprite.editor.Model(expectedColumns, expectedRows);
                    model.on('reset', function(){ notified = true; });

                    model.reset();

                    expect(notified).toBeTruthy();
                });
			});

			describe('decrease', function(){
				it ('column should remove the pixels of the last column', function(){
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.paintPixel(0, 0);
					model.paintPixel(expectedColumns - 1, 0);
					model.paintPixel(0, expectedRows - 1);
					model.paintPixel(expectedColumns - 1, expectedRows - 1);

					model.decreaseColumns();

					var coordinates = [];
					model.forEachPixel(function(x, y){
						coordinates.push([x,y]);
					});

					expect(coordinates.length).toBe(2);
					expect(coordinates).toContain([0, 0]);
					expect(coordinates).toContain([0, expectedRows - 1]);
				});

				it ('row should remove the pixels of the last row', function(){
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.paintPixel(0, 0);
					model.paintPixel(expectedColumns - 1, 0);
					model.paintPixel(0, expectedRows - 1);
					model.paintPixel(expectedColumns - 1, expectedRows - 1);

					model.decreaseRows();

					var coordinates = [];
					model.forEachPixel(function(x, y){
						coordinates.push([x,y]);
					});

					expect(coordinates.length).toBe(2);
					expect(coordinates).toContain([0, 0]);
					expect(coordinates).toContain([expectedColumns - 1, 0]);
				});

				it ('row should remove the pixels of the last row', function(){
					var model = new sprite.editor.Model(expectedColumns, expectedRows);
					model.paintPixel(0, 0);
					model.paintPixel(expectedColumns - 1, 0);
					model.paintPixel(0, expectedRows - 1);
					model.paintPixel(expectedColumns - 1, expectedRows - 1);

					model.decreaseRows();

					var coordinates = [];
					model.forEachPixel(function(x, y){
						coordinates.push([x,y]);
					});

					expect(coordinates.length).toBe(2);
					expect(coordinates).toContain([0, 0]);
					expect(coordinates).toContain([expectedColumns - 1, 0]);
				});
			});
		});
	});
});
