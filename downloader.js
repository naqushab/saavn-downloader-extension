/**
 * Slug the text
 *
 * @param text
 * @returns {string}
 */
var slugify = function (text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-')// Replace spaces with -
		.replace(/[^\w\-]+/g, '')// Remove all non-word chars
		.replace(/\-\-+/g, '-')// Replace multiple - with single -
		.replace(/^-+/, '')// Trim - from start of text
		.replace(/-+$/, '');
	// Trim - from end of text
};

/**
 * Convert Bytes
 * @param a
 * @param b
 * @returns {*}
 */
var bytesToSize = function (a, b) {
	if (0 === a) return "0 Bytes";
	var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		f = Math.floor(Math.log(a) / Math.log(c));
	return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

if (!localStorage.download_bitrate) {
	localStorage.download_bitrate = '320';
}

var bitrateString = " [" + localStorage.download_bitrate + " kbps]";

/**
 * Get Downlaod URL from Server
 *
 * @param song
 * @param bit
 * @param callback
 */
var getDownloadURL = function (song, bit, callback) {

	if (!bit) {
		bit = localStorage.download_bitrate;
	}

	var postData = {
		url: song.url,
		__call: "song.generateAuthToken",
		_marker: "false",
		_format: "json",
		bitrate: bit
	};

	$.ajax({
		type: "POST",
		url: "https://www.jiosaavn.com/api.php",
		crossDomain: true,
		dataType: "json",
		data: postData,
		xhrFields: {
			withCredentials: true
		},
		success: function (result, status) {
			callback(result, 'success');
		},
		error: function (result, status) {
			console.log(result);
			callback(result, 'error');
		}
	})
};

/**
 * Get URL Response as an ArrayBuffer Object
 *
 * @param url
 * @param onload
 * @param statusObject
 */
var getURLArrayBuffer = function (url, onload, statusObject) {

	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';

	if (statusObject) {
		singleShowSingleSongProgress(xhr, statusObject);
	}

	xhr.onload = function () {
		if (xhr.status === 200) {

			if (statusObject) {
				statusObject.flush();
			}

			onload(xhr.response);
		} else {
			console.error(xhr.statusText + ' (' + xhr.status + ')');
		}
	};

	xhr.onerror = function () {
		console.error('Network error');
	};

	xhr.send();
};

/**
 * Download a Single song with ID3 Meta Data (Song Album art and Artists)
 * @param song
 * @param songFileUrl
 * @param callback
 */
var downloadWithData = function (song, songFileUrl, callback) {
	getSongBlob(song, songFileUrl, function (blob) {
		saveAs(blob, song.title + bitrateString + '.mp3');
		callback();
	}, true);

};

/**
 * Get Async Downloaded blob of the a Single Song
 * @param song
 * @param songFileUrl
 * @param callback
 * @param hideInEnd
 * @param hideStatus
 */
var getSongBlob = function (song, songFileUrl, callback, hideInEnd, hideStatus) {

	var songStatus = downloadStatus.createRow();

	if (hideStatus) {
		songStatus.hide();
	}
	songStatus.status('Downloading Album Artwork');
	// Fetching High-Res Image 
	var songCoverUrl = song.image_url;
	var highDefSongCoverUrl = songCoverUrl.replace("150x150", "500x500");
	getURLArrayBuffer(highDefSongCoverUrl, function (coverArrayBuffer) {

		songStatus.status('Downloading Song : ' + song.title);

		getURLArrayBuffer(songFileUrl, function (arrayBuffer) {

			const writer = new ID3Writer(arrayBuffer);
			writer.setFrame('TIT2', song.title)
				.setFrame('TPE1', song.singers.split(', '))
				.setFrame('TCOM', [song.music])
				.setFrame('TALB', song.album)
				.setFrame('TYER', song.year)
				.setFrame('TPUB', song.label)
				.setFrame('TCON', ['Soundtrack'])
				.setFrame('TBPM', 128)
				.setFrame('APIC', {
					type: 3,
					data: coverArrayBuffer,
					description: song.title
				});

			writer.addTag();

			const blob = writer.getBlob();

			songStatus.status('Downloaded : ' + song.title, hideInEnd);
			callback(blob);

		}, songStatus)

	});
};


/**
 * Download Set of Songs as a Zip
 *
 * @param songs
 * @param name
 */
var downloadSetOfSongsAsZip = function (songs, name) {

	var zip = new JSZip();

	// create a folder in the name of album
	var album = zip.folder(name);
	var zipStat = downloadStatus.createRow();
	var albumStatus = 'Album : ' + name + " : Download in Progress";
	zipStat.status(albumStatus);

	songs.forEach(function (song, index) {


		// get the download url of song
		getDownloadURL(song, false, function (result, status) {

			if (status === 'success') {


				// get a single song blob
				getSongBlob(song, result.auth_url, function (blob) {
					album.file(song.title + '.mp3', blob);

					// check if all files are downloaded
					if (index + 1 === songs.length) {

						zipStat.status("Compressing & Zipping the Downloads");
						downloadZip(zip, name, function () {
							zipStat.status("Download Complete", true);
							zipStat.flushAll();
						});


					}
				}, false, true);

			}
		})


	});


};

/**
 * Update a Status of Download Queue and Stuff
 * @type {{create, createRow, el, hide, show, progress, clear, reset, flush, flushAll, status, statusRight}}
 */
// TODO : Bug when downloading Albums.. or Playlist
var downloadStatus = function () {
	var downStatus, downStatusWrapper;

	return {

		create: function () {
			$('.download-status-wrapper').remove();
			downStatusWrapper = $('<div class="download-status-wrapper"></div>');
			$('#player').prepend(downStatusWrapper);
		},
		createRow: function () {
			downStatus = $('<div class="download-status"> <span class="progress"></span><p class="status-text"></p><p class="status-right"></p></div>');
			downStatus.hide();
			downStatusWrapper.append(downStatus);

			return this;
		},
		el: function () {
			return downStatus;
		},
		hide: function () {
			downStatus.hide();
		},
		show: function () {
			downStatus.show();
		},
		progress: function (value) {
			downStatus.find('.progress').first().width(value + "%")
		},
		clear: function () {
			downStatus.find('p.status-text').first().html("");
			downStatus.find('p.status-right').first().html("");
		},
		reset: function () {
			this.clear();
			this.hide();
			this.progress(0);
		},
		flush: function () {
			downStatus.remove();
		},
		flushAll: function () {
			$('.download-status').remove();
		},
		status: function (message, hide) {
			this.show();

			if (hide) {
				this.reset();
				this.flush();
			}
			else {
				downStatus.find('p.status-text').first().html(message + "<span>.</span><span>.</span><span>.</span>")
			}
		},
		statusRight: function (message, hide) {
			var self = this;

			if (hide) {
				this.progress(100);
				setTimeout(function () {
					self.reset();
				}, 1500);
			}

			downStatus.find('p.status-right').first().html(message)
		}
	}

}();


/**
 * Download a Zip blob as File via FileSaver
 *
 * @param zip
 * @param name
 * @param callback
 */
var downloadZip = function (zip, name, callback) {
	zip.generateAsync({ type: "blob" })
		.then(function (blob) {
			saveAs(blob, name);
			callback();
		});
};

/**
 * Show Song Download Progress
 *
 * @param xhr
 * @param statusObject
 */
var singleShowSingleSongProgress = function (xhr, statusObject) {
	xhr.addEventListener("progress", updateProgress);
	xhr.addEventListener("load", transferComplete);

	function updateProgress(e) {

		var percentComplete = e.loaded / e.total;

		if (statusObject) {
			statusObject.statusRight(bytesToSize(e.loaded, 2) + "/" + bytesToSize(e.total, 2));
			statusObject.progress(percentComplete * 100);
		}

	}

	function transferComplete(e) {
		statusObject.reset();
		statusObject.flush();
	}
};
