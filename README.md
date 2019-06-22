# Jiosaavn Song Downloader Chrome Extension + Saavn Ads Hider

![Song Quality Selector](https://i.imgur.com/UP8IyU2.png)
![Downloads](https://i.imgur.com/9l0QUJg.png)
![Single Song Download](https://i.imgur.com/PC5LPRJ.png)
![Bulk Song Download](https://i.imgur.com/pHaMw05.png)

This Extension will allow you to download any song, album or playlist in jiosaavn seamlessly and easily. It also hides ads from Saavn Web.

### NOTE
Some songs are not available in a higher quality and there is no way to see it through extension. Please select the next best quality (320kbps to 128 kbps for example) and the songs would download just fine.
Albums/Playlists that are old will also have this issue as some of the songs are not available in the selected download quality.

## Features

- Select Any Quality Downloads (Supports HQ 320kbps)
- Download a Single Song
- Download an Album
- Download a Playlist
- Saavn Ad Block

## How to use it

- You will have a Download Selector on Top Menu. where you can select your download Quality
- To Download a Single Song. You will see a "Download" button near the song title
- To Download an Album You will see a "Download" button near the album title
- To Download an Playlist You will see a "Download" button near the playlist name

## How to Install it

this extension is currently not hosted in chrome webstore, so you will have to install it manually on chrome. below are the steps

- download the extension here : [download](https://github.com/naqushab/saavn-downloader-extension/archive/master.zip)
- extract the zip file
- go to chrome extensions page [chrome://extensions/](chrome://extensions/)
- you will see a button called "Load Unpacked Extension.." click that
- select the extracted folder and press "ok"

Note : the extension will be enabled on development mode. you will have a popup when opening the chrome. press cancel on that popup. you can always enable it again on the chrome extension page.

## Issues

if you have any issues regarding this extension you may submit a issue in here [issue link](https://github.com/naqushab/saavn-downloader-extension/issues/new) 

## Behind the Scenes

### overview

Sorry to write this. but the jiosaavn has a very poor security it is just exposed to everyone.. they haven't even mingled there code where in point a hacker or someone cannot read the code. the code they have minified is readable and easily exploitable because of it.

if you have javascript knowledge you can easily understand whats going behind. on the web application they will generate a single response url for a song playback which will be played via the player on the web. the song url will expire in approx 10s which means you cannot download it most of the time as the url expires. it will give an Forbidden error most of the time when you try to download.

### Flaws

the web is typically exploitable we all know that. atleast this would have been much harder for someone to crack if it has been improved

-The Didn't Mingle the code. anyone can read the code and understand it.

-The Api of the application is exposed to the global anyone can access it from the chrome developer tools. for instance the 'Player' object :D you can play songs Programmatically. are you kidding ?

-Each song object details directly printed on the dom '.song-json' :D any hacker can easily deserialize  the json object and use the data.

if they fix those the extension will be stopped from working :D sorry guys

### How it works

Song
- When you press a download button on song. it will send a request and generate a download URL from server.
- Then it will download the song asynchronously in background. as the download song will have a gibberish name and no song details.
- Then we will download the album art asynchronously.
- Then we will add ID3 tags (Title, Singer, Cover, Composer and stuff) to the downloaded song.

Album, Playlist
- Will download all Songs asynchronously as mentioned above.
- We will make a virtual zip on memory and create a folder and add the songs there.
- Download the Zip
- Somewhat Buggy