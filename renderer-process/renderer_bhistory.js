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
              var url_data = JSON.stringify(urlCounter.url_cache).toString('utf8');
              var url_parse = JSON.parse(url_data);
                  $('.browser-history-wrapper').append('<h5 class="date">'+urlCounter.url_date+'</h5>');
                  for (var countCache=0; countCache<url_parse.length; countCache++){
                        var urlData = url_parse[countCache];

                        // console.log(urlData.url_id);
                        // console.log(urlData.url_date);
                        // console.log(urlData.url_icon);
                        // console.log(urlData.url_title);
                        // console.log(urlData.url_linked);

                  }
          }


    });
}
readUrlHistory();
