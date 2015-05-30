"use strict";

function InventoryState() {
	GameState.call(this);
}

InventoryState.prototype = new GameState();
InventoryState.prototype.constructor = InventoryState;


InventoryState.prototype.x = 0;
InventoryState.prototype.y = 0;
SkilldexState.prototype.activeItem = -1;
SkilldexState.prototype.mouseState = -1;

InventoryState.prototype.closeButton = {
	x: 437,
	y: 328,
	width: 15,
	height: 16,
};

InventoryState.prototype.input = function(e) {
	switch(e.type) {
		case "mousemove":
			break;
		case "keydown":
			break;
		case "mousedown":
			this.mouseState = 1;
			break;
		case "mouseup":
			this.mouseState = 0;
			break;
		case "click":
			switch(this.activeItem) {
				case "closeButton":
					main_closeInventory();
					this.activeItem = -1;	// reset this so that it mouse event doesn't propagate through on reopen
					break;
			}
			break;
		case 'contextmenu':	// switch input modes on mouse2
			break;
	};	
};

InventoryState.prototype.update = function() {
	this.activeItem = -1;	
	if(intersectTest(_mouse.x,_mouse.y,0,0,
		this.x + this.closeButton.x,
		this.y + this.closeButton.y,
		this.closeButton.width,
		this.closeButton.height)) {
			this.activeItem = "closeButton";
			return;
		}
};

InventoryState.prototype.render = function() {	
	_context.globalAlpha = 1;
	_context.drawImage(_assets["art/intrface/invbox.frm"].frameInfo[0][0].img, this.x, this.y);	// bg	
	
	_context.drawImage((this.activeItem == "closeButton" && this.mouseState == 1) ? _assets["art/intrface/lilreddn.frm"].frameInfo[0][0].img : _assets["art/intrface/lilredup.frm"].frameInfo[0][0].img,
		this.x + this.closeButton.x, this.y + this.closeButton.y);	// bg	
	
	_context.drawImage(_assets["art/intrface/hand.frm"].frameInfo[0][0].img, _mouse.x, _mouse.y);		// cursor
};