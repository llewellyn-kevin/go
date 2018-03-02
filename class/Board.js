/*function loc(_row, _col) {
	return {
		row: _row,
		col: _col
	}
}

function blob() {
	this.locs = [];
	this.addNew = function(_loc) {
		this.locs.push(_loc);
	}

	return {
		
	}
}*/

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
					y: currY
				}

				this.turn = (this.turn === 'black') ? 'white' : 'black';
			}

			this.buttonState = 'skip';

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
		}
	}
});
