if (!localStorage.download_bitrate) {
    localStorage.download_bitrate = '320';
}

var bitrateString = " [" + localStorage.download_bitrate + " kbps]";

// See inject.js L20
// /**
//  * Get Downlaod URL from Server
//  *
//  * @param song
//  * @param bit
//  * @param callback
//  */
// var getDownloadURL = function(song, callback) {

//     var postData = {
//         "query": song
//     };

//     $.ajax({
//         type: "GET",
//         url: "https://jiosaavn-api.vercel.app/link",
//         crossDomain: true,
//         dataType: "json",
//         data: postData,
//         success: function(result) {
//             callback(result, 'success');
//         },
//         error: function(result) {
//             console.log(result);
//             callback(result, 'error');
//         }
//     })
// };

/* No need for now (Now Using Fetch) (L127) */
/**
//  * Get URL Response as an ArrayBuffer Object
//  *
//  * @param url
//  * @param onload
//  */

// var getURLArrayBuffer = function(url, onload) {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.responseType = 'arraybuffer';

//     xhr.onload = function() {
//         if (xhr.status === 200) {
//             onload(xhr.response);
//         } else {
//             console.error(xhr.statusText + ' (' + xhr.status + ')');
//         }
//     };
//     xhr.onerror = function() {
//         console.error('Network error');
//     };
//     xhr.send();
// };

/**
 * Download a Single song with ID3 Meta Data (Song Album art and Artists)
 * @param song
 * @param songFileUrl
 * @param callback
 */
var downloadWithData = function(songData, callback) {
    getSongBlob(songData, false, function(blob) {
        saveAs(blob, songData.song + bitrateString + '.mp3');
        callback();
    });
};

/**
 * Get Async Downloaded blob of the a Single Song
 * @param song
 * @param songFileUrl
 * @param callback
 */
var getSongBlob = async function(song, bit, callback) {

    if (!bit) {
        bit = localStorage.download_bitrate;
    }
    try {
        var songUrl = song.media_url.replace('aac.saavncdn.com', 'saavn-downloader-extension.musicder.workers.dev/song');
        var lastUnderscoreIndex = songUrl.lastIndexOf('_');
        if (bit === '320') {
            songUrl = songUrl.substr(0, lastUnderscoreIndex) + '_320.mp4';
        } else {
            songUrl = songUrl.substr(0, lastUnderscoreIndex) + '_160.mp4';
        }

        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({
            log: false,
            corePath: chrome.runtime.getURL('js/ffmpeg-core.js')
        });

        await ffmpeg.load();

        console.log(`${song.song} is fetching from server...`)
        notify(`${song.song} is fetching from server...`, 'info')

        ffmpeg.FS('writeFile', `song.mp4`, await fetchFile(songUrl));

        console.log(`${song.song} is converting into mp3...`)
        notify(`${song.song} is converting into mp3...`, 'info')

        await ffmpeg.run('-i', `song.mp4`, '-ab', `${bit}k`, `song.mp3`);

        ffmpeg.setProgress(({ ratio }) => {
            notify((ratio * 100.0).toFixed(2) + "% Converted", 'info')
        });

        const ffData = ffmpeg.FS('readFile', `song.mp3`);

        console.log(`Adding metadata into ${song.song}...`)
        notify(`Adding metadata into ${song.song}...`, 'info')

        const writer = new ID3Writer(ffData.buffer);
        writer.setFrame('TIT2', song.song)
            .setFrame('TPE1', song.primary_artists.split(', '))
            .setFrame('TCOM', [song.singers]) //note this for later
            .setFrame('TALB', song.album)
            .setFrame('TYER', song.year)
            .setFrame('TPUB', song.label)
            .setFrame('TCON', ['Soundtrack'])
            .setFrame('TBPM', 320)
            .setFrame('APIC', {
                type: 3,
                data: await (await fetch(song.image.replace('c.saavncdn.com', 'saavn-downloader-extension.musicder.workers.dev/image'))).arrayBuffer(),
                description: song.song
            });

        writer.addTag();
        const blob = writer.getBlob();
        callback(blob);
        console.log(`${song.song} has been downloaded...`);
        notify(`${song.song} has been downloaded...`, 'success');
    } catch (err) {
        notify(`Sorry, That's an error !`, 'error');
    }
};

/* Notification */
const notify = function(message, type) {
    const notif = document.createElement('div');
    notif.classList.add('toast');
    notif.classList.add(type);
    notif.innerText = message;
    document.getElementById('toasts').appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 10000);
}

/* TODO Fetch from Album API (See inject.js L46) */
/**
 * Download Set of Songs as a Zip
 *
 * @param songs
 * @param name
 */
var downloadSetOfSongsAsZip = function(songs, name) {

    var zip = new JSZip();

    // create a folder in the name of album
    var album = zip.folder(name);
    var zipStat = downloadStatus.createRow();
    var albumStatus = 'Album : ' + name + " : Download in Progress";
    zipStat.status(albumStatus);

    songs.forEach(function(song, index) {
        // get the download url of song
        getDownloadURL(song, function(result, status) {
            if (status === 'success') {
                // get a single song blob
                getSongBlob(song, false, result.auth_url, function(blob) {
                    album.file(song.title + '.mp3', blob);
                    // check if all files are downloaded
                    if (index + 1 === songs.length) {
                        zipStat.status("Compressing & Zipping the Downloads");
                        downloadZip(zip, name, function() {
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
 * Download a Zip blob as File via FileSaver
 *
 * @param zip
 * @param name
 * @param callback
 */
var downloadZip = function(zip, name, callback) {
    zip.generateAsync({
            type: "blob"
        })
        .then(function(blob) {
            saveAs(blob, name);
            callback();
        });
};


// Using notification
// /**
//  * Update a Status of Download Queue and Stuff
//  * @type {{create, createRow, el, hide, show, progress, clear, reset, flush, flushAll, status, statusRight}}
//  */
// // TODO : Bug when downloading Albums.. or Playlist
// var downloadStatus = function() {
//     var downStatus, downStatusWrapper;

//     return {

//         create: function() {
//             $('.download-status-wrapper').remove();
//             downStatusWrapper = $('<div class="download-status-wrapper"></div>');
//             $('#player').prepend(downStatusWrapper);
//         },
//         createRow: function() {
//             downStatus = $('<div class="download-status"> <span class="progress"></span><p class="status-text"></p><p class="status-right"></p></div>');
//             downStatus.hide();
//             downStatusWrapper.append(downStatus);

//             return this;
//         },
//         el: function() {
//             return downStatus;
//         },
//         hide: function() {
//             downStatus.hide();
//         },
//         show: function() {
//             downStatus.show();
//         },
//         progress: function(value) {
//             downStatus.find('.progress').first().width(value + "%")
//         },
//         clear: function() {
//             downStatus.find('p.status-text').first().html("");
//             downStatus.find('p.status-right').first().html("");
//         },
//         reset: function() {
//             this.clear();
//             this.hide();
//             this.progress(0);
//         },
//         flush: function() {
//             downStatus.remove();
//         },
//         flushAll: function() {
//             $('.download-status').remove();
//         },
//         status: function(message, hide) {
//             this.show();

//             if (hide) {
//                 this.reset();
//                 this.flush();
//             } else {
//                 downStatus.find('p.status-text').first().html(message + "<span>.</span><span>.</span><span>.</span>")
//             }
//         },
//         statusRight: function(message, hide) {
//             var self = this;

//             if (hide) {
//                 this.progress(100);
//                 setTimeout(function() {
//                     self.reset();
//                 }, 1500);
//             }

//             downStatus.find('p.status-right').first().html(message)
//         }
//     }

// }();


// /**
//  * Show Song Download Progress
//  *
//  * @param xhr
//  * @param statusObject
//  */
// var singleShowSingleSongProgress = function(xhr, statusObject) {
//     xhr.addEventListener("progress", updateProgress);
//     xhr.addEventListener("load", transferComplete);

//     function updateProgress(e) {

//         var percentComplete = e.loaded / e.total;

//         if (statusObject) {
//             statusObject.statusRight(bytesToSize(e.loaded, 2) + "/" + bytesToSize(e.total, 2));
//             statusObject.progress(percentComplete * 100);
//         }

//     }

//     function transferComplete(e) {
//         statusObject.reset();
//         statusObject.flush();
//     }
// };

// /**
//  * Convert Bytes
//  * @param a
//  * @param b
//  * @returns {*}
//  */
//  var bytesToSize = function(a, b) {
//     if (0 === a) return "0 Bytes";
//     var c = 1024,
//         d = b || 2,
//         e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
//         f = Math.floor(Math.log(a) / Math.log(c));
//     return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
// }