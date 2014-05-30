/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icone-rd\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icona-facebook' : '&#xe000;',
			'icona-twitter' : '&#xe001;',
			'icona-google-plus' : '&#xe002;',
			'icona-flickr' : '&#xe003;',
			'icona-instagram' : '&#xe004;',
			'icona-cart' : '&#xe008;',
			'icona-mobile' : '&#xe009;',
			'icona-tablet' : '&#xe00a;',
			'icona-laptop' : '&#xe00b;',
			'icona-screen' : '&#xe00c;',
			'icona-phone' : '&#xe00d;',
			'icona-file' : '&#xe00e;',
			'icona-envelope' : '&#xe00f;',
			'icona-freccia-sx' : '&#xe010;',
			'icona-freccia-dx' : '&#xe011;',
			'icona-freccia-giu' : '&#xe012;',
			'icona-camera' : '&#xe013;',
			'icona-pencil' : '&#xe014;',
			'icona-griglia' : '&#xe015;',
			'icona-rd-tondo' : '&#xe016;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icona-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};