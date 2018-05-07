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


function Settings(options){

    this.osiris_settings = path.join(__dirname, '../settings.json');

    this.rawSettingsData = fs.readFileSync(this.osiris_settings);
    this.SettingsData = JSON.parse(this.rawSettingsData);

    //Initiate All Settings from JSON
    this.initSettings = initiateSettings;

    //Methods
	this.startUp = startupSettings;


    $('#startup-radio-select-1').on('click', function () {
        console.log('clicked!');
    });
}

function initiateSettings(){

    // Startup Initiation Settings
    switch(this.SettingsData.osirisStartUp[0]['selected']){
        case "1": {
            $('#startup-radio-select-1').prop('checked', true);
            break;
        }
        case "2": {
            $('#startup-radio-select-2').prop('checked', true);
            break;
        }
        case "3": {
            $('#startup-radio-select-3').prop('checked', true);
            break;
        }
        default: {
            break;
        }
    }
    return true;
}

function startupSettings() {

    var rValue = "";

    switch(this.SettingsData.osirisStartUp[0]['selected']){
        case "1": {
            rValue = 'default';
            break;
        }
        case "2": {
            rValue = this.SettingsData.osirisStartUp[0]['lastBrowseURL'];
            break;
        }
        case "3": {
            rValue = this.SettingsData.osirisStartUp[0]['specificPagesSelected'];
            break;
        }
        default: {
            rValue = 'default';
            break;
        }
    }

    return rValue;
}

module.exports = Settings;