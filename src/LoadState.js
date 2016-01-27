"use strict";

function LoadState() {
	GameState.call(this);
	this.overlay = document.getElementById("loadState_overlay");
}

LoadState.prototype = new GameState();
LoadState.prototype.constructor = LoadState;
LoadState.prototype.loadImage = 0;
LoadState.prototype.overlay = 0;

LoadState.prototype.loadPercentage = 0;

LoadState.prototype.init = function(_saveState) {		// use arguments here to pass saved state data.
	console.log("LoadState: loading locally");

	let payloadSuccess = function(res) {
		console.log("MainLoadState: download complete - parsing loadData");
		asset_parseLoadData(res);

		var lstLength = _assets["art/tiles/tiles.lst"].length;		//@TODO: IMPROVE THIS
		for(var i = 0; i < lstLength; i++) {
			_assets["art/tiles/tiles.lst"][i].ptr = _assets["art/tiles/" + _assets["art/tiles/tiles.lst"][i].data];
		}

		lstLength = _assets["art/items/items.lst"].length;
		for(var i = 0; i < lstLength; i++) {
			_assets["art/items/items.lst"][i].ptr = _assets["art/items/" + _assets["art/items/items.lst"][i].data];
		}

		lstLength = _assets["art/scenery/scenery.lst"].length;
		for(var i = 0; i < lstLength; i++) {
			_assets["art/scenery/scenery.lst"][i].ptr = _assets["art/scenery/" + _assets["art/scenery/scenery.lst"][i].data];
		}

		lstLength = _assets["art/misc/misc.lst"].length;
		for(var i = 0; i < lstLength; i++) {
			_assets["art/misc/misc.lst"][i].ptr = _assets["art/misc/" + _assets["art/misc/misc.lst"][i].data];
		}

		console.log("LoadState: load complete");
		this.gameInit(_saveState);

	}.bind(this);

	console.log("MainLoadState: loading remotely");
	main_loadJsonPayload("jsfdata/" + _saveState.map.split(".")[0] + ".jsf")
		.then(payloadSuccess)
		.catch(main_payloadError);

};

LoadState.prototype.gameInit = function(_saveState) {
	mainState.init(_saveState);
	stateQ.splice(stateQ.indexOf(loadState),1);
	stateQ.push(mainState);
};


LoadState.prototype.input = function(e) { }

LoadState.prototype.update = function() { }


LoadState.prototype.render = function() {		// @TODO: REMOVE
	_context.globalAlpha = 1;
	_context.fillStyle = "rgb(0,10,0)";
	_context.fillRect(0,0,_screenWidth,_screenHeight);

	var fullWidth = ((_screenWidth/2)|0);
	var barWidth = fullWidth * this.loadPercentage;
	var barX = fullWidth - (fullWidth/2)|0;
	var barY = _screenHeight - 128;

	_context.drawImage(this.overlay,0,0,1024,768,0,0,_screenWidth,_screenHeight);

	_context.fillStyle = "rgb(0,10,0)";
	_context.fillRect(barX,barY,fullWidth,64);

	_context.beginPath();
	_context.moveTo(barX-6, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6);
	_context.lineTo((barX-6) + fullWidth + 12, barY-6+76);
	_context.lineTo(barX-6, barY-6+76);
	_context.lineTo(barX-6, barY-6);
	_context.closePath();
	_context.lineWidth = 4;
	_context.strokeStyle = "rgb(130,240,170)";
	_context.stroke();

	_context.fillStyle = "rgb(130,240,170)";
	_context.fillRect(barX,barY,barWidth,64);

	var flickerChance = 0.02;	// flicker
	if(Math.random() > 1-flickerChance) {
		_context.globalAlpha = Math.random()*0.35;
		_context.fillStyle = "rgb(255,255,255)";
		_context.fillRect(0,0,_screenWidth,_screenHeight);
	}

	_context.globalAlpha = 0.07;	// scanlines, consider replacing with hardcoded image
	_context.fillStyle = "rgb(255,255,255)";
	var lines = 0;
	while(lines < _screenHeight) {
		_context.fillRect(0,lines,_screenWidth,4);
		lines += 8;

	}

	_context.globalAlpha = 1;
};
