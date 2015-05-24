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
	var LoadStatePtr = this;
	
	var mainLoader = new XMLHttpRequest();
	
	if(_debug.remoteLoading) {
		console.log("LoadState: loading remotely");
		var loadURL = "";
		var clientData = "map="+_saveState.map;
		
	} else {	// load locally
		console.log("LoadState: loading locally");
		var loadURL = "jsfdata/" + _saveState.map.split(".")[0] + ".jsf";
		
	}
	

	var transferComplete = function(evt) {
		console.log("LoadState: download complete");
		var loadData = JSON.parse(mainLoader.responseText);
		
		console.log("LoadState: creating sprites");
		for(var key in loadData) {
			if(!_assets[key]) {
				_assets[key] = loadData[key];
				if(_assets[key].nFrames) { // if asset is FRM - build images
					var nDir = _assets[key].frameInfo.length;
					for(var d = 0; d < nDir; d++) {
						for(var f = 0; f < _assets[key].nFrames; f++) {
							_assets[key].frameInfo[d][f].img = document.createElement('img');
							_assets[key].frameInfo[d][f].img.src = _assets[key].frameInfo[d][f].imgdata;
						}
					}
				}	// end FRM				
			}	
		}			
		
		console.log("LoadState: load complete");
		LoadStatePtr.gameInit(_saveState);		
	};

	var transferFailed = function(evt) {};
	
	var updateProgress = function(evt) {
		if(evt.lengthComputable) {
			LoadStatePtr.loadPercentage = evt.loaded / evt.total;
		} else console.log("LoadState: cannot process load progress");
	};
	
	mainLoader.addEventListener("progress", updateProgress, false);
	mainLoader.addEventListener("load", transferComplete, false);
	mainLoader.addEventListener("error", transferFailed, false);		
	
	mainLoader.open("POST", loadURL, true);
	
	mainLoader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//mainLoader.setRequestHeader('accept-encoding','gzip');
	mainLoader.overrideMimeType("application/gzip");	
	mainLoader.send(clientData);
	
	console.log("LoadState: request sent");
}

LoadState.prototype.gameInit = function(_saveState) {
	mainState.init(_saveState);
	stateQ.splice(stateQ.indexOf(loadState),1);
	stateQ.push(mainState);	
};


LoadState.prototype.input = function(e) { }

LoadState.prototype.update = function() { }


LoadState.prototype.render = function() {
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
}