# Jiosaavn Song Downloader Chrome Extension + Saavn Ads Hider

![Song Quality Selector](https://i.imgur.com/wa5OK4O.png)
![Single Song Download](https://i.imgur.com/9TqNSSL.png)

This Extension will allow you to download any song in jiosaavn seamlessly and easily. It also hides ads from Saavn Web.  
:star: if you love the extension. 

## NOTE
This extension requires JioSaavn API in the backend to fetch Download Links in real time.
This is why it needs CORS enaled. **Download this extension** [CORS Origin Chrome Extension](https://chrome.google.com/webstore/detail/moesif-orign-cors-changer/digfbfaphojjndkpccljibejjbppifbc) and Enable it so that this extension can work.

## Features

- Select Any Quality Downloads (Supports HQ 320kbps)
- Download a Single Song
- Download an Album **(in progress)**
- Download a Playlist **(in progress)**
- Saavn Ad Block

## How to use it

- You will have a Download Selector on Top Menu. where you can select your download Quality
- To Download a Single Song. You will see a "Download" button near the song title
- To Download an Album You will see a "Download" button near the album title (not working right now)
- To Download an Playlist You will see a "Download" button near the playlist name (not working right now)

## How to Install it

This extension can not hosted be in chrome webstore (duh!), so you will have to install it manually on chrome. below are the steps:

- download the extension here : [download](https://github.com/naqushab/saavn-downloader-extension/archive/master.zip)
- extract the zip file
- go to chrome extensions page [chrome://extensions/](chrome://extensions/)
- you will see a button called "Load Unpacked Extension.." click that
- select the extracted folder and press "ok"
- Download this extension [*CORS Origin Chrome Extension*](https://chrome.google.com/webstore/detail/moesif-orign-cors-changer/digfbfaphojjndkpccljibejjbppifbc) and Enable it so that this extension can work

Note : the extension will be enabled on development mode. you will have a popup when opening the chrome. press cancel on that popup. you can always enable it again on the chrome extension page.

## Issues

- Album and Playlist downloads are currently not working

Please have a look at other issues before submitting a new one. If you have any issues regarding this extension whih you think is unique, you may submit a issue in here [issue link](https://github.com/naqushab/saavn-downloader-extension/issues/new) 

## Behind the Scenes

### Overview
 There is a [JioSaavn API](https://github.com/cyberboysumanjay/JioSaavnAPI) developed by [cyberboysumanjay](https://github.com/cyberboysumanjay) and I am running that in a free Heroku server (which is why it is so slow) and fetching Songs Data via that API using an AJAX call and then downloading it in Browser and adding perfect metadat in it.

 Make sure you check out JioSaavn API page and :star: it if you like. People donot earn anything from this and spend their precious time developing it and release it for free. I am personally a huge fan of structural appraoch and like the repo a lot. A samll praise, a good mention makes them feel a lot good and it doesn't cost anything. 


### How it works

Song
- When you press a download button on song. it will send a request and generate a download URL from server.
- Then it will download the song asynchronously in background. as the download song will have a gibberish name and no song details.
- Then we will download the album art asynchronously.
- Then we will add ID3 tags (Title, Singer, Cover, Composer and stuff) to the downloaded song.

Album, Playlist **(not yet working. In progress)**
- Will download all Songs asynchronously as mentioned above.
- We will make a virtual zip on memory and create a folder and add the songs there.
- Download the Zip
- Somewhat Buggy

Made with :heart: in India.  
Huge shoutout to people reporting the issues and giving me pointers to look on how to fix issues. :heart:
