//this is your timer, does nothing right now
Timer = function() {
}

Rect = function(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

//draw the moon surface
moonsurface = function(){
	this.pts = new Array();
}



moonsurface.prototype = {
	draw: function() {
		rect = ctx.canvas.getBoundingClientRect();
		x = rect.left-150;
		y = rect.bottom;
		ctx.moveTo(x, y);
		y = y-130;
		ctx.lineTo(x, y);
		count = 0;
		while(x<=rect.right) {
			randval = randfuncy();
			y += randval;
			ctx.lineTo(x,y);
        	this.pts[x]=y;
        	x=x+1;
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
	this.wt = 65;
	this.ht = 50;
	this.rect = new Rect(this.posx, this.posy, this.wt, this.ht);
	this.crashed = false;
	this.landed = false;
	this.accelerating = false;
}

var increment = 5;
var increment1 = increment+1;
var imagewidth = 65;
var imageheight = 50;

Lander.prototype = {
	checkLanding: function(){
		if(gmoonsurface.pts[this.posx] <= this.posy+55) {
			this.landed = true;
			val = Math.abs(gmoonsurface.pts[this.posx]-gmoonsurface.pts[this.posx+69]);
			if(val > 3 || this.accelerating)
				this.crashed = true;
		}
	},

	movedown: function() {
		filldirtyrect(this.posx,this.posy,imagewidth,increment1);
		this.posy+=increment;
		this.accelerating = true;
	},

	moveup: function() {
		filldirtyrect(this.posx,this.posy+imageheight,imagewidth,increment1);
		this.posy-=increment;
		this.accelerating = false;
	},

	moveright: function() {
		filldirtyrect(this.posx, this.posy, increment1, imageheight);
		this.posx+=increment;
	},

	moveleft: function() {
		filldirtyrect(this.posx+imagewidth, this.posy, increment1, imageheight);
		this.posx-=increment;
	},

	draw: function() {
		ctx.drawImage(this.landerelement,this.posx,this.posy);
	},

};

var glander;
var gmoonsurface;

//randomly returns a +1 or -1
randfuncy = function(){
	val = Math.random();
	if (val<=0.1)
		return 2;
	else if (val<=0.3)
		return 1;
	else if(val<=0.72)
		return 0;
	else if(val<=0.9)
		return -1;
	else if(val<=1)
		return -2;
	
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
			glander.moveright();
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
		return;
	}
	if(!glander.landed) {
		glander.draw();
		if(glander.accelerating)
			glander.posy++;
		glander.posy++; //gravity hack
		glander.checkLanding();
	}
};