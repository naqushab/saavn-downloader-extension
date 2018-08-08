/**
 * Add Player Download Button to Download Current Song
 * NOTE : Doesn't Work when used in Extension
 */
var playerDownloadButton = function () {

	$('.download-btn').remove();

	var btn = $('<a class="download-btn btn x-small" target="_blank" download>Download</a>');

	btn.css({
		float: 'right',
		background: '#E91E63',
		marginRight: '-30px',
		marginTop: '-3px',
	});

	$('.meta-wrap').append(btn);

	btn.on('click', function (e) {

		btn.text('Downloading...');

		var song = Player.getCurrentSong();

		getDownloadURL(song, false, function (result, status) {

			if(status === 'success') {
				var el = $('<a download></a>');
				el.attr('href', result.auth_url).attr('target', '_blank').attr('download', slugify(song.title));
				el[0].click();

				btn.text('Download');
			}

			if(status === 'error') {
				btn.text('Error in Download');
				console.log('Download error', result);
			}
		});

	});

};

/**
 * Add Download Button To Single Songs on the Screen
 */
var addDownloadButtonToAllSongs = function () {

	$('.single-download-button').remove();

	$('.song-json').each(function() {
		var $this = $(this);
		var btn = $('<a class="single-download-button btn x-small"></a>');
		try{
			var song = JSON.parse($this.text());
		}
		catch(e){}


		btn.text('Download').css({
			marginLeft: '7px',
			fontSize: '8px',
			padding: '1px 11px',
			background: '#E91E63'
		});

		btn.on('click', function (e) {
			e.preventDefault();
			var $btn = $(this);
			$btn.text('Downloading....');

			getDownloadURL(song, false, function (result, status) {


				if(status === 'success') {
					downloadWithData(song, result.auth_url, function () {
						$btn.text('Download');
					});
				}
				if(status === 'error') {
					$btn.text('Error in Download');

				}

			});
		});


		$this.parent().find('.main .title').first().append(btn);
	});
};

/**
 * Add Album Download Button on Albums
 */
var addAlbumDownloadButton = function () {
	$('.album-download').remove();

	var albumBtn = $('<li><a class="album-download btn white outline">Download</a></li>');

	albumBtn.on('click', function () {

		var songs = [];
		$('.song-json').each(function () {
			songs.push(JSON.parse($(this).text()))
		});

		downloadSetOfSongsAsZip(songs, songs[0].album + bitrateString);

	});

	$('.album-view section .page-header .actions').prepend(albumBtn);
};

/**
 * Add Download Button on Playlist
 */
var addPlaylistDownloadButton = function () {

	$('.playlist-download').remove();

	var playlistBtn = $('<li><a class="playlist-download btn">Download</a></li>');

	playlistBtn.on('click', function () {

		var songs = [];
		$('.song-json').each(function () {
			songs.push(JSON.parse($(this).text()))
		});

		downloadSetOfSongsAsZip(songs, $('.page-title').text() + bitrateString);

	});

	$('.playlist .page-header .actions').prepend(playlistBtn);
};

/**
 * Add Download Quality selector on the Menu..
 */
var createDownloadQuality = function () {
	var self = this;
	var menuItem = $('<div id="language"><span class="curr-down-rate"></span><strong>Download Quality</strong></div>').addClass('menu text right');
	var dropDown = $('<div class="drop"></div>');
	var dropDownList = $('<ol></ol>');

	var bitrates = ['320', '192', '128', '64','32','16'];

	menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + " kbps");
	bitrates = bitrates.map(function (rate) {


		var el = $('<li><a>' + rate + ' kbps</a></li>');

		if(rate === localStorage.download_bitrate) {
			el.addClass('current');
			el.find('a').first().append('<em class="current">current</em>');
		}

		el.on('click', function () {
			localStorage.download_bitrate = rate;
			$(this).parent().find('.current').each(function () {
				$(this).removeClass('current');
				$(this).find('a em').remove();
			});

			$(this).addClass('current');
			$(this).find('a').first().append('<em class="current">current</em>');

			menuItem.removeClass('active');
			menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + ' kbps');

		});
		return el;
	});

	menuItem.hover(function () {
		menuItem.addClass('active');
	},
	function () {
		menuItem.removeClass('active');
	});

	dropDownList.append(bitrates);
	dropDown.append(dropDownList);
	menuItem.append(dropDown);

	$("#header").find('.wrap').first().append(menuItem);
};

/**
 * Run on Plugin Initialization
 */
var initPlugin = function () {
	addDownloadButtonToAllSongs();
	addAlbumDownloadButton();
	addPlaylistDownloadButton();

	downloadStatus.create();
};

$(document).ready(function () {
	initPlugin();


	createDownloadQuality();

	// check if classes of the .page-wrap changes then add the buttons again
	var OldLen = 0;
	var inter = setInterval(function () {
		var len = $('.page-wrap')[0].classList.length;

		if(len !== OldLen) {
			initPlugin();
		}
		OldLen = len;
	}, 500);

});

$(document).on("click", ".load-more", function(){
	initPlugin();
	console.log("Load more content fired");
});