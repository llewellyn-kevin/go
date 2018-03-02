// object to contain the location of a piece, from 0 to 18
function Loc(_row, _col) {
	return {
		row: _row,
		col: _col
	}
}

// object to contain all members of a blob
function Blob() {
	this.locs = [];
	this.addNew = function(_loc) {
		this.locs.push(_loc);
	}

	return this;
}

// returns true if space has liberty
function hasLiberty(_loc, _board) {
	var x = _loc.row;
	var y = _loc.col;
	if((x > 0) && (!_board[x - 1][y]))
		return true;
	if((x < 18) && (!_board[x + 1][y]))
		return true;
	if((y < 18) && (!_board[x][y + 1]))
		return true;
	if((y > 0) && (!_board[x][y - 1]))
		return true;
	return false;
}

// function to check if blob should be removed
function captured(_blob, _board) {
	for(var i = 0; i < _blob.locs.length; i++) {
		if(hasLiberty(_blob.locs[i], _board))
			return false;
	}
	return true;
}

// give blob with only first val and a map and a blob is recursively created
// pass 0 for last 2 vals. dir { 0 => LEFT, 1 => UP, 2 => RIGHT, 3 => DOWN }
function constructBlob(_blob, _board, curr, dir) {
	if(curr === _blob.locs.length) {
		return {
			blob: _blob,
			board: _board
		};
	}
	
	var current = {
		x: _blob.locs[curr].row,
		y: _blob.locs[curr].col
	}
	var place = _board[current.x][current.y];
	var color = place.color;

	switch(dir) {
		case 0:
			if(current.x == 0)
				return constructBlob(_blob, _board, curr, 1);
			if(color === _board[current.x - 1][current.y].color
				&& !_board[current.x - 1][current.y].mapped)
				_blob.locs.push(new Loc(current.x - 1, current.y));
			return constructBlob(_blob, _board, curr, 1);
		case 1:
			if(current.y == 0)
				return constructBlob(_blob, _board, curr, 2);
			if(color === _board[current.x][current.y - 1].color
				&& !_board[current.x][current.y - 1].mapped)
				_blob.locs.push(new Loc(current.x, current.y - 1));
			return constructBlob(_blob, _board, curr, 2);
		case 2:
			if(current.x == 18)
				return constructBlob(_blob, _board, curr, 3);
			if(color === _board[current.x + 1][current.y].color
				&& !_board[current.x + 1][current.y].mapped)
				_blob.locs.push(new Loc(current.x + 1, current.y));
			return constructBlob(_blob, _board, curr, 3);
		case 3:
			if(current.y == 18)
				return constructBlob(_blob, _board, curr, 4);
			if(color === _board[current.x][current.y + 1].color
				&& !_board[current.x][current.y + 1].mapped)
				_blob.locs.push(new Loc(current.x, current.y + 1));
			return constructBlob(_blob, _board, curr, 4);
		default:
			_board[current.x][current.y].mapped = true;
			return constructBlob(_blob, _board, curr + 1, 0);

	}
}

// give a map and all of the blobs are found
function mapBlobs(_board) {
	var blobs = new Array();

	for(i = 0; i < _board.length; i++) {
		for(j = 0; j < _board[i].length; j++) {
			var space = _board[i][j];
			if(space && !space.mapped) {
				var tempBlob = new Blob();
				tempBlob.addNew(new Loc(i, j));
				var cb = constructBlob(tempBlob, _board, 0, 0);
				blobs.push(cb.blob);
				_board = cb.board;
			}
		}
	}

	return {
		blobArr: blobs,
		board: _board
	}
}

var board = new Vue({
	el: '#board',
	data: {
		board: new Array(19),
		turn: 'white',
		currHover: {
			row: -1,
			col: -1
		},
		buttonState: 'skip'
	},
	created: function() {
		for(var i = 0; i < 19; i++)
			this.board[i] = new Array(19).fill(false);

		this.paint();
	},
	methods: {
		paint: function() {
			var html = '';
			for(i = 0; i < 19; i++) {
				for(j = 0; j < 19; j++) {
					var id = i + '-' + j;
					var src = 'res/';
					var br = false;
					
					if(i == 0) {
						switch(j) {
							case 0:
								src += 'top-left';
								break;
							case 18:
								src += 'top-right';
								br = true;
								break;
							default:
								src += 'top'
						}
					} else if(i == 18) {
						switch(j) {
							case 0:
								src += 'bottom-left';
								break;
							case 18:
								src += 'bottom-right';
								br = true;
								break;
							default:
								src += 'bottom'
						}
					} else {
						switch(j) {
							case 0:
								src += 'left';
								break;
							case 18:
								src += 'right';
								br = true;
								break;
							default:
								src += 'middle'
						}
					}

					src += '.png';

					html += '<img v-on:mouseover="hover" id="'+id+'" src="'+src+'" />';
					if(br)
						html += '<br />';
				}
			}

			var buttonText = '{{turn}}\'s turn ({{buttonState}})';
			html += '<div v-on:click="skip" id="skip-button">'+buttonText+'</div>';

			html += '<img v-if="turn === \'black\'" id="black-hover-piece" class="piece" v-on:click="click" src="./res/black.png" />';
			html += '<img v-if="turn === \'white\'" id="white-hover-piece" class="piece" v-on:click="click" src="./res/white.png" />';

			$('div#board').html(html);
		},
		hover: function(e) {
			var x = e.originalTarget.x;
			var y = e.originalTarget.y;

			var inds = e.originalTarget.id.split('-').map(parseFloat);
			this.currHover.row = inds[0];
			this.currHover.col = inds[1];

			$('#'+this.turn+'-hover-piece').css('position', 'absolute');
			$('#'+this.turn+'-hover-piece').css('left', x);
			$('#'+this.turn+'-hover-piece').css('top', y);

		},
		click: function(e) {
			//console.log(this.currHover.row, '-', this.currHover.col);
			var currX = e.originalTarget.x;
			var currY = e.originalTarget.y;
			var r = this.currHover.row;
			var c = this.currHover.col;

			var style = 'style="top:'+currY+';left:'+currX+';"';
			var src = 'src="./res/' + this.turn + '.png"';
			var html = '<img class="piece" '+style+' '+src+' />';

			$('div#board').append(html);

			if(!this.board[r][c]) {
				this.board[r][c] = {
					color: this.turn,
					x: currX,
					y: currY,
					mapped: false
				}

				this.turn = (this.turn === 'black') ? 'white' : 'black';
			}

			this.buttonState = 'skip';

			this.resetMapping();
			map = mapBlobs(this.board);
			this.board = map.board;
			var blobs = map.blobArr;

			for(i = 0; i < blobs.length; i++) {
				if(captured(blobs[i], this.board)) {
					console.log('CAPTURE ON BOARD');
				}
			}

		},
		skip: function(e) {
			if(this.buttonState === 'skip') {
				this.turn = (this.turn === 'black') ? 'white' : 'black';
				this.buttonState = 'end game';
			} else {
				$('#skip-button').html('Game Over!');
				$('#black-hover-piece').remove();
				$('#white-hover-piece').remove();
			}
		},
		resetMapping: function() {
			for(i = 0; i < this.board.length; i++) {
				for(j = 0; j < this.board[i].length; j++) {
					if(this.board[i][j])
						this.board[i][j].mapped = false;
				}
			}
		}
	}
});
