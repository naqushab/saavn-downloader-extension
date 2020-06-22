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

			if (status === 'success') {
				var el = $('<a download></a>');
				el.attr('href', result.auth_url).attr('target', '_blank').attr('download', slugify(song.title));
				el[0].click();

				btn.text('Download');
			}

			if (status === 'error') {
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

	$('.song-json').each(function () {
		var $this = $(this);
		var btn = $('<a class="single-download-button btn x-small"></a>');
		try {
			var song = JSON.parse($this.text());
		}
		catch (e) { }


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


				if (status === 'success') {
					downloadWithData(song, result.auth_url, function () {
						$btn.text('Download');
					});
				}
				if (status === 'error') {
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
	var menuItem = $('<aside class="c-dropdown u-margin-right@sm"><div class="c-dropdown__header"><span class="c-dropdown__type"><span class="u-visible-visually@lg">Song </span>Quality</span><span class="c-dropdown__select curr-down-rate"></span></div></aside>');
	var dropDown = $('<div class="c-dropdown__content"><div class="u-padding@sm"><h5 class="u-deci u-margin-bottom-none@sm">What bitrate of song you want to download?</h5></div><div class="o-message o-message--error">You must select a bitrate</div></div>');
	var dropDownList = $('<form><section class="u-scroll u-3/5-max-vh"><ul class="o-list-select"></ul></section></form>');

	var bitrates = ['320', '192', '128', '64', '32', '16'];

	menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + " kbps");
	bitrates = bitrates.map(function (rate) {


		var el = $('<li class="o-list-select__item" ><a>' + rate + ' kbps</a></li>');

		if (rate === localStorage.download_bitrate) {
			el.addClass('selected');
		}

		el.on('click', function () {
			localStorage.download_bitrate = rate;
			$(this).parent().find('.selected').each(function () {
				$(this).removeClass('selected');
				$(this).find('a em').remove();
			});

			$(this).addClass('selected');

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

	$("#language-dropdown").parent().append(menuItem);
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

var hideAds = function () {
	$('.ad').remove();
	$('.c-ad').remove();
	$('.c-banner').remove();
};

$(document).ready(function () {

	hideAds();
	console.log("Ads Hidden Now");

	setTimeout(function () {
		console.log("Initialize the plugin");
		initPlugin();
	}, 2000);

	createDownloadQuality();

	// check if classes of the .page-wrap changes then add the buttons again
	var OldLen = 0;
	var inter = setInterval(function () {
		if ($('.page-wrap').length) {
			if ($('.song-wrap').length) {
				var len = $('.song-wrap').length;

				if (len !== OldLen) {
					console.log("Song List is changed. Initilizing plugin again.")
					initPlugin();
				}
				OldLen = len;
			}
		}
	}, 1000);

});