//this is your timer, does nothing right now
Timer = function() {
}

//draw the moon surface
moonsurface = function(){
	this.pts = new Array();
}

moonsurface.prototype = {
	draw: function() {
		rect = ctx.canvas.getBoundingClientRect();
		var x = rect.left-150;
		var y = rect.bottom;
		ctx.moveTo(x, y);
		y = y-130;
		ctx.lineTo(x, y);
		var count = 0;
		while(x<=rect.right) {
			if(randfunc()>0)
				y += ((randfunc()+randfunc())*1);
			ctx.lineTo(x,y);
        	this.pts[x]=y;
        	x++;
        	count++;
		}
		ctx.lineTo(rect.right+50, rect.bottom);
		ctx.closePath();
		ctx.fillStyle = "#DBE6E0"
   		ctx.fill();
	},
};

Lander = function()
{
	this.landerelement = document.getElementById("lander");
	this.posx = 400;
	this.posy = 200;
	this.rect;
	this.crashed = false;
	this.landed = false;
}

increment = 5;

Lander.prototype = {
	checkLanding: function(){
		if(gmoonsurface.pts[this.posx] <= this.posy+55) {
			this.landed = true;
			if(((gmoonsurface.pts[this.posx] - gmoonsurface.pts[this.posx+69]) > 3))
				this.crashed = true;
		}
	},

	movedown: function() {
		filldirtyrect();
		this.posy+=increment;
	},

	moveup: function() {
		filldirtyrect();
		this.posy-=increment;
	},

	moveright: function() {
		filldirtyrect();
		this.posx+=increment;
	},

	moveleft: function() {
		filldirtyrect();
		this.posx-=increment;
	},

	draw: function() {
		ctx.drawImage(this.landerelement,this.posx,this.posy);
	},

};

var glander;
var gmoonsurface;

//randomly returns a +1 or -1
randfunc = function(){
	if(Math.random()<0.5) 
		return 1; 
	else 
		return -1;
}

//when the page loads init your vars and get the canvas and context
window.onload = function() {
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

	glander = new Lander();

	gmoonsurface = new moonsurface();
	gmoonsurface.draw();

	Timer._intervalId = setInterval(Timer.run, 10);
}

filldirtyrect = function(x,y,w,h){
	ctx.fillStyle="#000000";	
	ctx.fillRect(x, y, w, h);
}

window.onkeypress = function(e){
	var evtobj=window.event? event : e;
	var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
	var actualkey=String.fromCharCode(unicode);
	
	switch(actualkey) {
		case "w":
			glander.movedown();
			break;
		case "s":
			glander.moveup();
			break;
		case "a":
			glander.overight();
			break;
		case "d":
			glander.moveleft();
			break;
		default:
			return;
	}
}

//function to run on the timer!!
Timer.run = function() {
	if(!glander)
		return;

	if(glander.landed) 
	{
		if(glander.crashed) {
			ctx.fillStyle="#000000";
			ctx.beginPath();
			ctx.arc(glander.posx+30, glander.posy+30, 45, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
			expelement = document.getElementById("explode");
			ctx.drawImage(expelement,glander.posx,glander.posy);
			glander.landed = glander.crashed = false;
			alert('you crashed!')
		} else {
			glander.landed=false;
			alert('perfect landing!')
		}
		//HACK! need a true constructor at page start
		glander = undefined;
		location.reload(true);
	}
	if(!glander.landed) {
		glander.draw();
		glander.posy++;
		glander.checkLanding();
	}
};