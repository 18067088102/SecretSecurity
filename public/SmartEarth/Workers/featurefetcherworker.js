function define(f) {
	JsonGMLParser = f();
}
importScripts('txml.js');
importScripts('JsonGMLParser.js');

self.addEventListener('message', function (e) {
	var gmlParser = new JsonGMLParser(true /*extractAttributes */,
		true  /*xy */,
		undefined /*gmlnsm*/,
		undefined /*wfsnsm*/,
		undefined /*featureName*/,
		e.data.geometryFieldName);
	var data = e.data;
	var json, features;
	if (data.format === 'JSON') {
		json = JSON.parse(data.text);
		features = json.features;
		features.forEach(feature => {
			feature.positions = [];
			feature.geometry.coordinates.forEach(coordinate => {
				if (Array.isArray(coordinate)) {
					let positions = [];
					coordinate.forEach(item => {
						if (Array.isArray(item[0])) {
							let pArr = [];
							item.forEach(p => {
								pArr.push(p[0], p[1], p[2])
							})
							positions.push(pArr);
						} else {
							positions.push(item[0], item[1], item[2])
						}
					});
					feature.positions.push(positions);
				}else{
					feature.positions.push(coordinate)
				}
			})
			feature.attributes = feature.properties;
			feature.fid = feature.id;
			feature.geometryType = feature.geometry.type.toLocaleLowerCase();
			feature.bounds = undefined;
			delete feature.geometry;
			delete feature.id;
			delete feature.properties;
			delete feature.geometry_name;
			delete feature.type;
		})
	} else {
		json = tXml(data.text, { simplify: true });
		features = gmlParser.read(json);
	}
	delete data.text;
	data.features = features;
	postMessage(data);
	/*
	load('data.json', function(xhr) {	
		var result = xhr.responseText;
		var features = gmlParser.read(data.document);
		postMessage({id: data.id, features: features});
	});
	*/
});
/*
//simple XHR request in pure JavaScript
function load(url, callback) {
	var xhr;

	if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
	else {
		var versions = ["MSXML2.XmlHttp.5.0", 
				  "MSXML2.XmlHttp.4.0",
				  "MSXML2.XmlHttp.3.0", 
				  "MSXML2.XmlHttp.2.0",
				  "Microsoft.XmlHttp"]

		for(var i = 0, len = versions.length; i < len; i++) {
		try {
			xhr = new ActiveXObject(versions[i]);
			break;
		}
			catch(e){}
		} // end for
	}
		
	xhr.onreadystatechange = ensureReadiness;
		
	function ensureReadiness() {
		if(xhr.readyState < 4) {
			return;
		}
			
		if(xhr.status !== 200) {
			return;
		}

		// all is well	
		if(xhr.readyState === 4) {
			callback(xhr);
		}			
	}
		
	xhr.open('GET', url, true);
	xhr.send('');
}
*/