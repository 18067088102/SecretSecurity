self.addEventListener('message', function (e) {
	let data = e.data;
	let xhr = new XMLHttpRequest();
	xhr.open(data.type, data.url, data.async === undefined ? true : data.async);
	xhr.send(data.data || {});
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			data.xmlText = this.responseText
			postMessage(data);
		}
	}
});