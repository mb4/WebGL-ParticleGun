/*
* controls the emitter output via toggle navigation
* @param substance the name of the substance
* @param the substance ID
*/
function toggleSubstance(material, materialID){
	if (document.getElementById(material).classList == "active"){
		document.getElementById(material).classList.remove("active");

		currentlyEmittingMaterial = -1;
	} else {
		document.getElementById("water").classList.remove("active");
		document.getElementById("oil").classList.remove("active");
		document.getElementById("lava").classList.remove("active");
		document.getElementById(material).classList.add("active");

		currentlyEmittingMaterial = materialID;
	}
}

/*
 * simply function to show the credits alert
 * */
function showCredits() {
	alert('ParticleGun '+unescape("%A9")+' 2014 \nby Marvin Botens, Kevin Greim & Marcel Hoppe');
}
