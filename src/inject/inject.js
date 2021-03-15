/**
 * Add Download Button To Single Songs on the Screen
 */
var addDownloadButtonToAllSongs = function() {
    $('div[id=root]').prepend('<div class="toasts" id="toasts"></div>') // Notification Container
    $('.single-download-button').remove();
    var songsEle = $('li').find('figcaption').find('a.u-color-js-gray');

    songsEle.each(function() {
        var $this = $(this);
        var btn = $('<div class="o-snippet__item single-download-button"><span class="u-link"><i class="o-icon--large u-pop-in o-icon-download"></i></span></div>');

        try {
            var song = this.href;
        } catch (e) {}

        btn.on('click', async function(e) {
            e.preventDefault();
            var $btn = $(this);

            $btn.find('span').find('i.o-icon--large').removeClass('o-icon-download');
            $btn.find('span').find('i.o-icon--large').addClass('o-icon-download-progress');

            try {
                var result = await (await fetch(`https://jiosaavn-api.vercel.app/link?query=${song}`)).json();
                if (result.result === 'false') {
                    $btn.find('.o-icon--large').removeClass('o-icon-download-progress');
                    $btn.find('.o-icon--large').addClass('o-icon-close');
                    notify(`Sorry, That's an error`, 'error');
                    console.log('Failed to download song' + $this.href)
                } else {
                    downloadWithData(result, function() {
                        $btn.find('span').find('i.o-icon--large').removeClass('o-icon-download-progress');
                        $btn.find('span').find('i.o-icon--large').addClass('o-icon-download');
                    });
                }
            } catch (err) {
                $btn.find('.o-icon--large').removeClass('o-icon-download-progress');
                $btn.find('.o-icon--large').addClass('o-icon-close');
                notify(`Sorry, That's an error`, 'error');
                console.log('Failed to download song')
            }
        });

        $this.parent().parent().parent().parent().parent().last().append(btn);
    });
};

/**
 * Add Album Download Button on Albums
 */
/*
 * TO DO - Bind the button in the body and pass the Album ID
 */
var addAlbumDownloadButton = function() {

    $('.album-download').remove();
    var albumBtn = $('<li><a class="album-download btn white outline">Download</a></li>');

    albumBtn.on('click', function() {
        var songs = [];
        $('.song-json').each(function() {
            songs.push(JSON.parse($(this).text()))
        });

        downloadSetOfSongsAsZip(songs, songs[0].album + bitrateString);
    });

    $('.album-view section .page-header .actions').prepend(albumBtn);
};

/**
 * Add Download Button on Playlist
 */
var addPlaylistDownloadButton = function() {

    $('.playlist-download').remove();
    var playlistBtn = $('<li><a class="playlist-download btn">Download</a></li>');

    playlistBtn.on('click', function() {
        var songs = [];
        $('.song-json').each(function() {
            songs.push(JSON.parse($(this).text()))
        });

        downloadSetOfSongsAsZip(songs, $('.page-title').text() + bitrateString);
    });

    $('.playlist .page-header .actions').prepend(playlistBtn);
};

/**
 * Add Download Quality selector on the Menu..
 */
var createDownloadQuality = function() {
    var self = this;
    var menuItem = $('<aside class="c-dropdown u-margin-right@sm"><div class="c-dropdown__header"><span class="c-dropdown__type"><span class="u-visible-visually@lg">Song </span>Quality</span><span class="c-dropdown__select curr-down-rate"></span></div></aside>');
    var dropDown = $('<div class="c-dropdown__content"><div class="u-padding@sm"><h5 class="u-deci u-margin-bottom-none@sm">What bitrate of song you want to download?</h5></div><div class="o-message o-message--error">You must select a bitrate</div></div>');
    var dropDownList = $('<form><section class="u-scroll u-3/5-max-vh"><ul class="o-list-select"></ul></section></form>');

    var bitrates = ['320', '192', '128', '64', '32'];

    menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + " kbps");
    bitrates = bitrates.map(function(rate) {
        var el = $('<li class="o-list-select__item" ><a>' + rate + ' kbps</a></li>');
        if (rate === localStorage.download_bitrate) {
            el.addClass('selected');
        }
        el.on('click', function() {
            localStorage.download_bitrate = rate;
            $(this).parent().find('.selected').each(function() {
                $(this).removeClass('selected');
                $(this).find('a em').remove();
            });
            $(this).addClass('selected');
            menuItem.removeClass('active');
            menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + ' kbps');
        });
        return el;
    });

    menuItem.hover(function() {
            menuItem.addClass('active');
        },
        function() {
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
var initPlugin = function() {
    console.log("Initialize the Saavn Extension");
    addDownloadButtonToAllSongs();
    addAlbumDownloadButton();
    addPlaylistDownloadButton();
};

var hideAds = function() {
    console.log("Ads Hidden Now");
    $('.ad').remove();
    $('.c-ad').remove();
    $('.c-banner').remove();
};

$(document).ready(function() {

    hideAds();

    setTimeout(function() {
        initPlugin();
    }, 2000);

    createDownloadQuality();

    // check if classes of the .page-wrap changes then add the buttons again
    var oldSongListLen = 0;
    var inter = setInterval(function() {
        if ($('ol.o-list-bare').find('li').length) {
            var songListLen = $('ol.o-list-bare').find('li').length;
            if (songListLen !== oldSongListLen) {
                console.log("Song List is changed. Initilizing plugin again.")
                initPlugin();
            }
            oldSongListLen = songListLen;
        }
    }, 2000);

});