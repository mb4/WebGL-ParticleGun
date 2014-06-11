/*
* controls the emitter output via toggle navigation
* @param substance the name of the substance
* @param the substance ID
*/
function toggleSubstance(substance, substanceID){
	if (document.getElementById(substance).classList == "active"){
		// deprecated
		//document.getElementById(substance).classList.remove("active");
	} else {
		document.getElementById("water").classList.remove("active");
		document.getElementById("oil").classList.remove("active");
		document.getElementById("lava").classList.remove("active");
		document.getElementById(substance).classList.add("active");

		initTextures(substance);
	}
}

/*
 * simply function to show the credits alert
 * */
function showCredits() {
	alert('ParticleGun '+unescape("%A9")+' 2014 \nby Marvin Botens, Kevin Greim & Marcel Hoppe');
}
