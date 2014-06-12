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
        yAngle -= 0.5;
    }
    else if(key == 100 || key ==68)//KEY: "d" or "right arrow"
    {
        yAngle += 0.5;
    }
    else if(key == 115 || key ==83)//KEY: "s" or "arrow down"
    {
        xAngle -= 0.5;
    }
    else if(key == 119 || key ==87)//KEY: "w" or "arrow up"
    {
        xAngle += 0.5;
    }
    else if(key == 43)//KEY: "+"
    {
        zPos += 0.1;
    }
    else if(key == 45)//KEY: "-"
    {
        // "-" key
        zPos -= 0.1;
    }
    else if(key == 73)//KEY: "i"
    {
      winkel = (winkel+5<90)?winkel+5:winkel;
      console.log(winkel);
    }
    else if(key == 75)//KEY: "k"
    {
      winkel = (winkel-5>0)?winkel-5:winkel;
      console.log(winkel);
    }
    else if(key == 32)//KEY: "space"
    {
      setBeschleunigung = [-(energy*Math.cos(gunAngle/360*2*3.1415926536)),energy*Math.sin((gunAngle/360)*2*3.1415926536),0];
      console.log(setBeschleunigung);
      //particleSystem = createParticleSystem();
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
	   toggleSubstance('water',1);
	   energy = 5.65685;
   }
   else if (key == 50)//KEY: "2"
   {
	   toggleSubstance('oil',2);
	   energy = 1.65685;
   }
   else if (key == 51)//KEY: "3"
   {
	   toggleSubstance('lava',3);
	   energy = 8.65685;
   }
};