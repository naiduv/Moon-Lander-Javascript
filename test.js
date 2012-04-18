//this is your timer, does nothing right now
Timer = function() {
	this.stability = 10;
}

Lander = function()
{
	this.posx = 400;
	this.posy = 200;
	this.rect;
}

var mlander;

//randomly returns a +1 or -1
randfunc = function(){
	if(Math.random()<0.5) 
		return 1; 
	else 
		return -1;
}

moveby = function(){
	this.xi = 0;
	this.yi = 0;
}

mb = new moveby();

//update x and y coordinate with randfunc value
Timer.update = function() {
	// if(isclicked){
	// 	mlander.posx = mousex;
	// 	mlander.posy = mousey;
	// }

	// mlander.posx += (randfunc()+(mb.xi));
	// mlander.posy += (randfunc()+(mb.yi));
}

function updatemouseloc(e) {
	mousex = e.pageX;
	mousey = e.pageY;
}

var isclicked = false;

function setclicked(e) {
	if(isclicked)
		isclicked = false;
	else
		isclicked = true;
}

InitGui = function(gui){
	newTimer = new Timer();
	var controlstability = gui.add(newTimer,'stability',0,50);

	// newMoveBy = new moveby();
	var controlMoveByX = gui.add(mb,'xi',-5,5);
	var controlMoveByY = gui.add(mb,'yi',-5,5);

	controlstability.onChange(function(value){
	clearInterval(Timer._intervalId);
	Timer._intervalId = setInterval(Timer.run, value);
	});

	controlMoveByX.onChange(function(value){
		mb.xi = value;
	});

	controlMoveByY.onChange(function(value){
		mb.yi = value;
	});

}

//when the page loads init your vars and get the canvas and context
window.onload = function() {
	mousex = 0;
	mousey = 0;

	mlander = new Lander();

	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

	moonsurface.draw();

	gui = new dat.GUI();
	//initialize the gui
	InitGui(gui);

	Timer._intervalId = setInterval(Timer.run, Timer.stability);
}

updateGuiControls = function(gui) {
	for (var i in gui.__controllers) {
 		gui.__controllers[i].updateDisplay();
	}
}

filldirtyrect = function(x,y,w,h){
	ctx.fillStyle="#000000";	
	ctx.fillRect(x, y, w, h);
}

increment = 5;

movedown = function() {
	filldirtyrect();
	mlander.posy+=increment;
	if(mb.yi<5)
	 	mb.yi++;
}

moveup = function() {
	filldirtyrect();
	mlander.posy-=increment;
	if(mb.yi>-5)
	 	mb.yi--;
}

moveright = function() {
	filldirtyrect();
	mlander.posx+=increment;
	// if(mb.xi<5)
	// 	mb.xi++;
}

moveleft = function() {
	filldirtyrect();
	mlander.posx-=increment;
	// if(mb.xi>-5)
	// 	mb.xi--;
}

window.onkeypress = function(e){
	var evtobj=window.event? event : e;
	var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
	var actualkey=String.fromCharCode(unicode);
	
	switch(actualkey) {
		case "w":
			movedown();
			break;
		case "s":
			moveup();
			break;
		case "a":
			moveright();
			break;
		case "d":
			moveleft();
			break;
		default:
			return;
	}
	
	updateGuiControls(gui);
}

var landed = false;
var crashed = false;
//draw the moon surface
moonsurface = function(){
}

CheckLanding = function(){
	if(moonsurface[mlander.posx] <= mlander.posy+55) {
		landed = true;
		if(((moonsurface[mlander.posx] - moonsurface[mlander.posx+69]) > 3)  || (mb.xi>0 || mb.yi>1))
			crashed = true;
	}
}

//function to run on the timer!!
Timer.run = function() {
	if(landed) 
	{
		if(crashed) {
			ctx.fillStyle="#000000";
			ctx.beginPath();
			ctx.arc(mlander.posx+30, mlander.posy+30, 45, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
			expelement = document.getElementById("explode");
			ctx.drawImage(expelement,mlander.posx,mlander.posy);
			landed = crashed = false;
			alert('you crashed!')
		} else {
			landed=false;
			alert('perfect landing!')
		}
		//HACK! need a true constructor at page start
		location.reload(true);
	}
	if(!landed) {
		Timer.update();

		// ctx.fillStyle="#000000";	
		// ctx.fillRect(mlander.posx-10, mlander.posy-10, 80, 70);

		landerelement = document.getElementById("lander");
		ctx.drawImage(landerelement,mlander.posx,mlander.posy);
		mlander.rect = landerelement.getBoundingClientRect();
		mlander.posy++;

		CheckLanding();
	}
};

moonsurface.draw = function() {
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
        moonsurface[x]=y;
        x++;
        count++;
	}
	ctx.lineTo(rect.right+50, rect.bottom);
	ctx.closePath();
	ctx.fillStyle = "#DBE6E0"
    ctx.fill();
}