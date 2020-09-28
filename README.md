# :musical_note: JioSaavn Song Downloader Chrome Extension + JioSaavn Ads Hider

:star: if you love the extension. [![GitHub stars](https://img.shields.io/github/stars/naqushab/saavn-downloader-extension.svg?style=social&label=Star)](https://github.com/naqushab/saavn-downloader-extension) 

Follow me if you want to be updated. :smile: ![GitHub followers](https://img.shields.io/github/followers/naqushab.svg?style=social&label=Follow)

![Song Quality Selector](https://i.imgur.com/wa5OK4O.png)
![Single Song Download](https://i.imgur.com/9TqNSSL.png)

This Extension will allow you to download any song in JioSaavn seamlessly and easily. It also hides ads from JioSaavn Web.  


## NOTE
This extension requires JioSaavn API in the backend to fetch Download Links in real time.

## Features

- Select Any Quality Downloads (Supports HQ 320kbps)
- Download a Single Song
- Download an Album **(in progress)**
- Download a Playlist **(in progress)**
- JioSaavn Ad Block

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

Note : the extension will be enabled on development mode. you will have a popup when opening the chrome. press cancel on that popup. you can always enable it again on the chrome extension page.

## Issues

- Album and Playlist downloads are currently not working

Please have a look at other issues before submitting a new one. If you have any issues regarding this extension whih you think is unique, you may submit a issue in here [issue link](https://github.com/naqushab/saavn-downloader-extension/issues/new)   
Please provide all the issue details in the template that is given for a quicker resolution.

## Behind the Scenes

### Overview
 There is a [JioSaavn API](https://github.com/cachecleanerjeet/JiosaavnAPI) developed by [cachecleanerjeet](https://github.com/cachecleanerjeet) and fetching Songs Data via that API and then downloading it in Browser and adding perfect metadata in it.

 Make sure you check out JioSaavn API page and :star: it if you like. People donot earn anything from this and spend their precious time developing it and release it for free. I am personally a huge fan of structural appraoch and like the repo a lot. A small praise, a good mention makes them feel a lot good and it doesn't cost anything. See right sidebar for the list of contributors to the repo.


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
Special shoutout to @cachecleanerjeet for his work on enabling the extension without the CORS extension and making the download a little faster. Great job!