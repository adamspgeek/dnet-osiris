const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

var $ = require('jquery');
var Color = require('color.js');
var urlRegex = require('url-regex');
const contextMenu = require('electron-context-menu');

var jsonfile = require('jsonfile');
var path = require('path');

const fs = require('fs');

var url_history = path.join(__dirname, '../url_history.json')
//
//history
//
function readUrlHistory(){
    jsonfile.readFile(url_history, function(err,urlFile) {
      if (err) throw err;
      var i,countCache,
          x = "",
          urlDate=new Date(),
          dateYesterday = (24*60*60*1000) * 1, //1 day
          dateOlder = (24*60*60*1000) * 2, //1 day
          counter=1;
          for (var i=0; i<urlFile.url.length; i++) {
              var urlCounter = urlFile.url[i];
              // console.log(JSON.stringify(urlCounter.url_cache).toString().split("\n"));

                // for (var i=0; i<urlCounter.url.url_cache.length; i++) {
                //     var cacheCounter = urlCounter.url_cache[i];
                //     console.log(cacheCounter.url_date);
                // }

              // }
              // var newUrlTime = new Date(urlCounter.url_date);
              // if(newUrlTime.getTime()>(urlDate.getTime()-dateYesterday)){
              //   // console.log(urlCounter.url_date);
              // }
              // if(( newUrlTime.getTime()>=( urlDate.getTime()-dateOlder)) && ( newUrlTime.getTime()<=( urlDate.getTime()-dateYesterday))){
              //     // console.log(urlCounter.url_date);
              // }
              // if(newUrlTime.getTime() < (urlDate.getTime()-dateOlder)){
              //   // console.log(urlCounter.url_date);
              // }
          }

    });
}
readUrlHistory();
