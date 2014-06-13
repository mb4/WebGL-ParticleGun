/**
* keyListener
*
* on key down, if the key is pushed down
*/
window.onkeydown = function(e) {
	var key = e.keyCode ? e.keyCode : e.which;
	//console.log("Down:"+key);
};

/**
* on key press, if the key is pressed
*/
window.onkeypress = function(e) {
	var key = e.keyCode ? e.keyCode : e.which;
	//console.log("Press:"+key);

	//NOTE: arrows not working !? (Marcel)

	if(key == 97 || key ==65)//KEY: "a" or "left arrow"
    {
		tilt += 0.5;
    }
    else if(key == 100 || key ==68)//KEY: "d" or "right arrow"
    {
    	tilt -= 0.5;
    }
    else if(key == 115 || key ==40)//KEY: "s" or "arrow down"
    {
    	gunAngle = (gunAngle+1>90)?gunAngle:gunAngle+1;
    }
    else if(key == 119 || key ==38)//KEY: "w" or "arrow up"
    {
    	gunAngle = (gunAngle-1<0)?gunAngle:gunAngle-1;
    }
    else if(key == 43)//KEY: "+"
    {
    	zoom += 0.2;
    }
    else if(key == 45)//KEY: "-"
    {
        // "-" key
    	zoom -= 0.2;
    }
};

/**
* on key up, if the key is released
*/
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   //console.log("Up:"+key);

   if (key == 49)//KEY: "1"
   {
	   toggleSubstance('water',0);
   }
   else if (key == 50)//KEY: "2"
   {
	   toggleSubstance('oil',1);
   }
   else if (key == 51)//KEY: "3"
   {
	   toggleSubstance('lava',2);
   }
};