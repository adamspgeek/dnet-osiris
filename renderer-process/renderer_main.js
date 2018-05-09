var $ = require('jquery');
var Color = require('color.js');
var urlRegex = require('url-regex');
const contextMenu = require('electron-context-menu')
var globalCloseableTabsOverride;

/**
 * OBJECT
 */
function Navigation(options) {
    /**
     * OPTIONS
     */
    var defaults = {
        showBackButton: true,
        showForwardButton: true,
        showReloadButton: true,
				showStartupButton:true,
        showDownload:true,
        showUrlBar: true,
        showAddTabButton: true,
        closableTabs: true,
        verticalTabs: false,
        defaultFavicons: false
    };
    if (options === 'undefined' || options === 'null' || options !== Object(options)) {
        options = {};
    }
    for (var key in defaults) {
        if (!(key in options)) {
            options[key] = defaults[key];
        }
    }
    /**
     * GLOBALS & ICONS
     */
    globalCloseableTabsOverride = options.closableTabs;
    const NAV = this;
    this.SESSION_ID = 1;
    if (options.defaultFavicons) {
        this.TAB_ICON = "default";
    } else {
        this.TAB_ICON = "clean";
    }
    this.SVG_LOADING ='<svg viewBox="0 0 512 512"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"/></svg>';
    this.SVG_BACK = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
    this.SVG_FORWARD = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
    this.SVG_RELOAD = '<svg height="100%" viewBox="0 0 24 24" id="nav-ready"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
		this.SVG_STARTUP ='<svg viewBox="0 0 512 512"><path d="M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"/></svg>';
		this.SVG_FAVICON = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
    this.SVG_ADD = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>';
    this.SVG_CLEAR = '<svg height="100%" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    this.SVG_DOWNLOAD = '<svg viewBox="0 0 512 512"><path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"/></svg>';
    /**
     * ADD ELEMENTS
     */
    if (options.showBackButton) {
        $('#nav-body-ctrls').append('<i id="nav-ctrls-back" class="nav-icons disabled" title="Go back">' + this.SVG_BACK + '</i>');
    }
    if (options.showForwardButton) {
        $('#nav-body-ctrls').append('<i id="nav-ctrls-forward" class="nav-icons disabled" title="Go forward">' + this.SVG_FORWARD+ '</i>');
    }
    if (options.showReloadButton) {
        $('#nav-body-ctrls').append('<i id="nav-ctrls-reload" class="nav-icons disabled" title="Reload page">' + this.SVG_RELOAD+ '</i>');
    }
		if(options.showStartupButton){
				$('#nav-body-ctrls').append('<i id="nav-ctrls-startup" class="nav-icons disabled" title="Start Page">'+this.SVG_STARTUP+'</i>');
		}
    if (options.showUrlBar) {
        $('#nav-body-ctrls').append('<input id="nav-ctrls-url" type="text" title="Enter an address or search term"/>');
    }
    if (options.showDownload) {
        $('#nav-body-ctrls').append('<i id="nav-ctrls-download" class="nav-icons" title="Download">'+this.SVG_DOWNLOAD+'</i>');
    }
    if (options.showAddTabButton) {
        $('#nav-body-tabs').append('<i id="nav-tabs-add" class="nav-icons" title="Add new tab">' + this.SVG_ADD + '</i>');
    }
    /**
     * ADD CORE STYLE
     */
    if (options.verticalTabs) {
        $('head').append('<style id="nav-core-styles">#nav-body-ctrls,#nav-body-tabs,#nav-body-views,.nav-tabs-tab{display:flex;align-items:center;}#nav-body-tabs{overflow:auto;min-height:32px;flex-direction:column;}#nav-ctrls-url{box-sizing:border-box;}.nav-tabs-tab{min-width:60px;width:100%;min-height:20px;}.nav-icons{fill:#000;width:24px;height:24px}.nav-icons.disabled{pointer-events:none;opacity:.5}#nav-ctrls-url{flex:1;height:24px}.nav-views-view{flex:0 1;width:0;height:0}.nav-views-view.active{flex:1;width:100%;height:100%}.nav-tabs-favicon{align-content:flex-start}.nav-tabs-title{flex:1;cursor:default;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav-tabs-close{align-content:flex-end}@keyframes nav-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>');
    } else {
        $('head').append('<style id="nav-core-styles">#nav-body-ctrls,#nav-body-tabs,#nav-body-views,.nav-tabs-tab{display:flex;align-items:center}#nav-body-tabs{overflow:auto;min-height:32px;}#nav-ctrls-url{box-sizing:border-box;}.nav-tabs-tab{min-width:60px;width:180px;min-height:20px;}.nav-icons{fill:#000;width:24px;height:24px}.nav-icons.disabled{pointer-events:none;opacity:.5}#nav-ctrls-url{flex:1;height:24px}.nav-views-view{flex:0 1;width:0;height:0}.nav-views-view.active{flex:1;width:100%;height:100%}.nav-tabs-favicon{align-content:flex-start}.nav-tabs-title{flex:1;cursor:default;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav-tabs-close{align-content:flex-end}@keyframes nav-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>');
    }
    /**
     * EVENTS
     */
    //
    // switch active view and tab on click
    //
		// Go to startup page

    $('#nav-body-tabs').on('click', '.nav-tabs-tab', function () {
        $('.nav-tabs-tab, .nav-views-view').removeClass('active');

        var sessionID = $(this).data('session');
        $('.nav-tabs-tab, .nav-views-view')
            .filter('[data-session="' + sessionID + '"]')
            .addClass('active');

        var session = $('.nav-views-view[data-session="' + sessionID + '"]')[0];
        NAV._updateUrl(session.getURL());
        NAV._updateCtrls();

        //
        // close tab and view
        //
    }).on('click', '.nav-tabs-close', function () {
        var sessionID = $(this).parent('.nav-tabs-tab').data('session');
        var session = $('.nav-tabs-tab, .nav-views-view').filter('[data-session="' + sessionID + '"]');

        if (session.hasClass('active')) {
            if (session.next('.nav-tabs-tab').length) {
                session.next().addClass('active');
            } else {
                session.prev().addClass('active');
            }
        }
        session.remove();
        NAV._updateUrl();
        NAV._updateCtrls();
        return false;
    });
    //
    // add a tab, default to google.com
    //
    $('#nav-body-tabs').on('click', '#nav-tabs-add', function () {
        NAV.newTab('http://www.google.com/', {
            close: options.closableTabs,
            icon: NAV.TAB_ICON
        });
    });
    //
    // go back
    //
    $('#nav-body-ctrls').on('click', '#nav-ctrls-back', function () {
        NAV.back();
    });
    //
    // go forward
    //
    $('#nav-body-ctrls').on('click', '#nav-ctrls-forward', function () {
        NAV.forward();
    });
    //
    // reload page
    //
    $('#nav-body-ctrls').on('click', '#nav-ctrls-reload', function () {
        if ($(this).find('#nav-ready').length) {
            NAV.reload();
        } else {
            NAV.stop();
        }
    });
    //
    // Speed dial functions
    //
    function _startupRedirection(){
      $('.nav-views-view.active').attr('src','default.html');
      // var speedDialTitle = $('.active .nav-tabs-title');
      // $(this).addClass('disabled');
      // speedDialTitle.attr("title", 'Osiris Browser');
      // var text = speedDialTitle.text();
      // speedDialTitle.text(text.replace(text, 'Osiris Browser'));
    }
    //
    // header speed dial
    //
		$('#nav-body-ctrls').on('click', '#nav-ctrls-startup', function () {
		    _startupRedirection();
    });
    //
    // Widget Startup speed dial
    //
    $('.widget-startup a').on('click',function () {
		    _startupRedirection();
    });
    //
    // highlight address input text on first select
    //
    $('#nav-ctrls-url').on('focus', function (e) {
        $(this)
            .one('mouseup', function () {
                $(this).select();
                return false;
            })
            .select();
    });
    //
    // donwload page
    //
    $('#nav-body-ctrls').on('click', '#nav-ctrls-download', function () {
		   $('.nav-views-view.active').attr('src','download-history.html');
    });
    //
    // load or search address on enter / shift+enter
    //
    $('#nav-ctrls-url').keyup(function (e) {
        if (e.keyCode == 13) {
            if (e.shiftKey) {
                NAV.newTab(this.value, {
                    close: options.closableTabs,
                    icon: NAV.TAB_ICON
                });
            } else {
                if ($('.nav-tabs-tab').length) {
                    NAV.changeTab(this.value);
                } else {
                    NAV.newTab(this.value, {
                        close: options.closableTabs,
                        icon: NAV.TAB_ICON
                    });
                }
            }
        }
    });
		//
    //
    /**
     * FUNCTIONS
     */
    //
    // update controls like back, forward, etc...
    //
    this._updateCtrls = function () {
        webview = $('.nav-views-view.active')[0];
        if (!webview) {
            $('#nav-ctrls-back').addClass('disabled');
            $('#nav-ctrls-forward').addClass('disabled');
            $('#nav-ctrls-reload').html(this.SVG_RELOAD).addClass('disabled');
            return;
        }
        if (webview.canGoBack()) {
            $('#nav-ctrls-back').removeClass('disabled');
        } else {
            $('#nav-ctrls-back').addClass('disabled');
        }
        if (webview.canGoForward()) {
            $('#nav-ctrls-forward').removeClass('disabled');
        } else {
            $('#nav-ctrls-forward').addClass('disabled');
        }
        if (webview.isLoading()) {
            this._loading();
        } else {
            this._stopLoading();
        }
        if (webview.getAttribute('data-readonly') == 'true') {
            $('#nav-ctrls-url').attr('readonly', 'readonly');
        } else {
            $('#nav-ctrls-url').removeAttr('readonly');
        }

    } //:_updateCtrls()
    //
    // start loading animations
    //
    this._loading = function (tab) {
        tab = tab || null;

        if (tab == null) {
            tab = $('.nav-tabs-tab.active');
        }

        // tab.find('.nav-tabs-favicon').css('animation', 'nav-spin 2s linear infinite');
        $('.nav-tabs-tab.active').prepend('<i class="reloading-icon">'+this.SVG_LOADING+'</i>').parent('reloading-icon').remove();
        $('#nav-ctrls-reload').html(this.SVG_CLEAR);
    } //:_loading()
    //
    // stop loading animations
    //
    this._stopLoading = function (tab) {
        tab = tab || null;

        if (tab == null) {
            tab = $('.nav-tabs-tab.active');
        }
				if($('.nav-tabs-tab.active .nav-tabs-title').attr('title') != 'Osiris Browser'){
					  var startupId = $('.nav-tabs-tab.active').attr('data-session');
						$('#nav-ctrls-startup').removeClass('disabled').addClass('shortcut-startup-button').attr('startup-ID',startupId);
				}else{
						$('.shortcut-startup-button').addClass('disabled');
				}
        // tab.find('.nav-tabs-favicon').css('animation', '');
        $('.reloading-icon').remove();
        $('#nav-ctrls-reload').html(this.SVG_RELOAD);

    } //:_stopLoading()
    //
    // auto add http protocol to url input or do a search
    //
    this._purifyUrl = function (url) {
        if(url == 'default'){
            url = 'default.html';
        }else if(url == 'settings'){
            url = 'settings.html';
        }else{
            if (urlRegex({strict: false, exact: true}).test(url)) {
                url = (url.match(/^https?:\/\/.*/)) ? url : 'http://' + url;
            }else {
                url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'https://www.google.com/search?q=' + url.replace(' ', '+') : url;
            }
        }
        return url;
    } //:_purifyUrl()
    //
    // set the color of the tab based on the favicon
    //
    this._setTabColor = function (url, currtab) {
        const getHexColor = new Color(url, {
            amount: 1,
            format: 'hex'
        });
        getHexColor.mostUsed(result => {
            currtab.find('.nav-tabs-favicon svg').attr('fill', result);
        });
    } //:_setTabColor()
    //
    // add event listeners to current webview
    //
    this._addEvents = function (sessionID, options) {
        let currtab = $('.nav-tabs-tab[data-session="' + sessionID + '"]');
        let webview = $('.nav-views-view[data-session="' + sessionID + '"]');

        webview.on('dom-ready', function () {
            if (options.contextMenu) {
                contextMenu({
                    window: webview[0],
                    labels: {
                        cut: 'Cut',
                        copy: 'Copy',
                        paste: 'Paste',
                        save: 'Save',
                        copyLink: 'Copy Link',
                        inspect: 'Inspect'
                    }
                });
            }
        });
        webview.on('page-title-updated', function () {
            if (options.title == 'default') {
                currtab.find('.nav-tabs-title').text(webview[0].getTitle());
                currtab.find('.nav-tabs-title').attr('title', webview[0].getTitle());
            }
        });
        webview.on('did-start-loading', function () {
            NAV._loading(currtab);
        });
        webview.on('did-stop-loading', function () {
            NAV._stopLoading(currtab);
        });
        webview.on('enter-html-full-screen', function () {
            $('.nav-views-view.active').siblings().not('script').hide();
            $('.nav-views-view.active').parents().not('script').siblings().hide();
        });
        webview.on('leave-html-full-screen', function () {
            $('.nav-views-view.active').siblings().not('script').show();
            $('.nav-views-view.active').parents().siblings().not('script').show();
        });
        webview.on('load-commit', function () {
            NAV._updateCtrls();
        });
        webview[0].addEventListener('did-navigate', (res) => {
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener('did-fail-load', (res) => {
            NAV._updateUrl(res.validatedUrl);
        });
        webview[0].addEventListener('did-navigate-in-page', (res) => {
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener("new-window", (res) => {
            if (!(options.newWindowFrameNameBlacklistExpression instanceof RegExp && options.newWindowFrameNameBlacklistExpression.test(res.frameName))) {
                NAV.newTab(res.url, {
                    icon: NAV.TAB_ICON
                });
            }
        });
        webview[0].addEventListener('page-favicon-updated', (res) => {
            if (options.icon == 'clean') {
                NAV._setTabColor(res.favicons[0], currtab);
            } else if (options.icon == 'default') {
                currtab.find('.nav-tabs-favicon').attr('src', res.favicons[0]);
            }
        });
        webview[0].addEventListener('did-fail-load', (res) => {
            if (res.validatedURL == $('#nav-ctrls-url').val() && res.errorCode != -3) {
                this.executeJavaScript('document.body.innerHTML=' +
                    '<div style="background-color:whitesmoke;padding:40px;margin:20px;font-family:consolas;">' +
                    '<h2 align=center>Oops, this page failed to load correctly.</h2>' +
                    '<p align=center><i>ERROR [ ' + res.errorCode + ', ' + res.errorDescription + ' ]</i></p>' +
                    '<br/><hr/>' +
                    '<h4>Try this</h4>' +
                    '<li type=circle>Check your spelling - <b>"' + res.validatedURL + '".</b></li><br/>' +
                    '<li type=circle><a href="javascript:location.reload();">Refresh</a> the page.</li><br/>' +
                    '<li type=circle>Perform a <a href=javascript:location.href="https://www.google.com/search?q=' + res.validatedURL + '">search</a> instead.</li><br/>' +
                    '</div>'
                );
            }
        });
        return webview[0];
    } //:_addEvents()
    //
    // update #nav-ctrls-url to given url or active tab's url
    //
    this._updateUrl = function (url) {
        url = url || null;
        urlInput = $('#nav-ctrls-url');
        if (url == null) {
            if ($('.nav-views-view').length) {
                url = $('.nav-views-view.active')[0].getURL();
            } else {
                url = '';
            }
        }

        urlInput.off('blur');
        if (!urlInput.is(':focus')) {
            urlInput.prop('value', url);
            urlInput.data('last', url);
        } else {
            urlInput.on('blur', function () {
                // if url not edited
                if (urlInput.val() == urlInput.data('last')) {
                    urlInput.prop('value', url);
                    urlInput.data('last', url);
                }
                urlInput.off('blur');
            });
        }
    } //:_updateUrl()
} //:Navigation()
//
//Widget sidebars features
//
function _widgetSidebar(){

	var _widgetBookmarks = '<svg viewBox="0 0 512 512"><path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"/></svg>',
			_widgetSnapshot	 = '<svg viewBox="0 0 512 512"><path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"/></svg>',
			_widgetStartup	 = '<svg viewBox="0 0 512 512"><path d="M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"/></svg>',
			_widgetPersonal	 ='<svg viewBox="0 0 576 512"><path d="M552 64H112c-20.858 0-38.643 13.377-45.248 32H24c-13.255 0-24 10.745-24 24v272c0 30.928 25.072 56 56 56h496c13.255 0 24-10.745 24-24V88c0-13.255-10.745-24-24-24zM48 392V144h16v248c0 4.411-3.589 8-8 8s-8-3.589-8-8zm480 8H111.422c.374-2.614.578-5.283.578-8V112h416v288zM172 280h136c6.627 0 12-5.373 12-12v-96c0-6.627-5.373-12-12-12H172c-6.627 0-12 5.373-12 12v96c0 6.627 5.373 12 12 12zm28-80h80v40h-80v-40zm-40 140v-24c0-6.627 5.373-12 12-12h136c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H172c-6.627 0-12-5.373-12-12zm192 0v-24c0-6.627 5.373-12 12-12h104c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H364c-6.627 0-12-5.373-12-12zm0-144v-24c0-6.627 5.373-12 12-12h104c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H364c-6.627 0-12-5.373-12-12zm0 72v-24c0-6.627 5.373-12 12-12h104c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H364c-6.627 0-12-5.373-12-12z"/></svg>',
			_widgetHitory		 = '<svg viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>';

	$('.widget-tabs').append('<aside class="bookmarks default"><a title="Bookmarks">'+_widgetBookmarks+'</a></aside>');
  $('.widget-tabs').append('<aside class="snapshot default"><a title="Snapshot">'+_widgetSnapshot+'</a></aside>');
	$('.widget-tabs').append('<aside class="widget-startup default"><a title="Speed Dial">'+_widgetStartup+'</a></aside>');
	$('.widget-tabs').append('<aside class="widget-personal-news default"><a title="Personal News">'+_widgetPersonal+'</a></aside>');
  $('.widget-tabs').append('<aside class="history default"><a title="History">'+_widgetHitory+'</a></aside>');
  $('.widget-tabs').append('<aside class="unpin-widget"><a title="Unpin"><label class="switch"><input type="checkbox" checked="checked"><span class="slider"></span></label></a></aside>');

	$('.history a').on('click', function () {
			$('.nav-views-view.active').attr('src','browser-history.html');
	});

  $('.unpin-widget input').click(function(event) {

      if (!$(this).is(':checked')) {
        $('.widget-tabs').css('background',' rgb(93, 2, 41)');
        $('#nav-body-ctrls, #nav-body-tabs').removeClass('pin-sidebar');
        $('#nav-body-ctrls, #nav-body-tabs').css('z-index','9999')
      }else{
        $('#nav-body-ctrls, #nav-body-tabs').addClass('pin-sidebar');
        $('#nav-body-ctrls, #nav-body-tabs').css('z-index','');
        $('.widget-tabs').css('background','#191d1e');
      }
  });
}_widgetSidebar();
/**
 * PROTOTYPES
 */
//
// create a new tab and view with an url and optional id
//
Navigation.prototype.newTab = function (url, options) {
    var defaults = {
        id: null, // null, 'yourIdHere'
        node: false,
        webviewAttributes: {},
        icon: "clean", // 'default', 'clean', 'c:\location\to\image.png'
        title: "default", // 'default', 'your title here'
        close: true,
        readonlyUrl: false,
        contextMenu: true
    }
    if (options === 'undefined' || options === 'null' || options !== Object(options)) {
        options = {};
    }
    for (var key in defaults) {
        if (!(key in options)) {
            options[key] = defaults[key];
        }
    }
    // validate options.id
    $('.nav-tabs-tab, .nav-views-view').removeClass('active');
    if ($('#' + options.id).length) {
        console.log('ERROR[electron-navigation][func "newTab();"]: The ID "' + options.id + '" already exists. Please use another one.');
        return false;
    }
    if (!(/^[A-Za-z]+[\w\-\:\.]*$/.test(options.id))) {
        console.log('ERROR[electron-navigation][func "newTab();"]: The ID "' + options.id + '" is not valid. Please use another one.');
        return false;
    }
    // build tab
    var tab = '<span class="nav-tabs-tab active" data-session="' + this.SESSION_ID + '">';
    // favicon
    if (options.icon == 'clean') {
        tab += '<i class="nav-tabs-favicon nav-icons">' + this.SVG_FAVICON + '</i>';
    } else if (options.icon === 'default') {
        tab += '<img class="nav-tabs-favicon nav-icons" src=""/>';
    } else {
        tab += '<img class="nav-tabs-favicon nav-icons" src="' + options.icon + '"/>';
    }
    // title
    if (options.title == 'default') {
        tab += '<i class="nav-tabs-title"> . . . </i>';
    } else {
        tab += '<i class="nav-tabs-title">' + options.title + '</i>';
    }
    // close
    if (options.close && globalCloseableTabsOverride) {
        tab += '<i class="nav-tabs-close nav-icons">' + this.SVG_CLEAR + '</i>';
    }
    // finish tab
    tab += '</span>';
    // add tab to correct position
    if ($('#nav-body-tabs').has('#nav-tabs-add').length) {
        $('#nav-tabs-add').before(tab);
    } else {
        $('#nav-body-tabs').append(tab);
    }
    // add webview
    let composedWebviewTag = `<webview class="nav-views-view active" data-session="${this.SESSION_ID}" src="${this._purifyUrl(url)}"`;

    composedWebviewTag += ` data-readonly="${((options.readonlyUrl) ? 'true': 'false')}"`;
    if (options.id) {
        composedWebviewTag += ` id=${options.id}`;
    }
    if (options.node) {
        composedWebviewTag += " nodeintegration";
    }
    if (options.webviewAttributes) {
        Object.keys(options.webviewAttributes).forEach((key) => {
            composedWebviewTag += ` ${key}="${options.webviewAttributes[key]}"`;
        });
    }
    $('#nav-body-views').append(`${composedWebviewTag}></webview>`);
    // enable reload button
    $('#nav-ctrls-reload').removeClass('disabled');

    // update url and add events
    this._updateUrl(this._purifyUrl(url));
    return this._addEvents(this.SESSION_ID++, options);
} //:newTab()
//
// change current or specified tab and view
//
Navigation.prototype.changeTab = function (url, id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active').attr('src', this._purifyUrl(url));
    } else {
        if ($('#' + id).length) {
            $('#' + id).attr('src', this._purifyUrl(url));
        } else {
            console.log('ERROR[electron-navigation][func "changeTab();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:changeTab()
//
// close current or specified tab and view
//
Navigation.prototype.closeTab = function (id) {
    id = id || null;

    var session;
    if (id == null) {
        session = $('.nav-tabs-tab.active, .nav-views-view.active');
    } else {
        if ($('#' + id).length) {
            var sessionID = $('#' + id).data('session');
            session = $('.nav-tabs-tab, .nav-views-view').filter('[data-session="' + sessionID + '"]');
        } else {
            console.log('ERROR[electron-navigation][func "closeTab();"]: Cannot find the ID "' + id + '"');
            return false;
        }
    }

    if (session.next('.nav-tabs-tab').length) {
        session.next().addClass('active');
    } else {
        session.prev().addClass('active');
    }

    session.remove();
    this._updateUrl();
    this._updateCtrls();
} //:closeTab()
//
// go back on current or specified view
//
Navigation.prototype.back = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].goBack();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].goBack();
        } else {
            console.log('ERROR[electron-navigation][func "back();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:back()

//
// go forward on current or specified view
//
Navigation.prototype.forward = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].goForward();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].goForward();
        } else {
            console.log('ERROR[electron-navigation][func "forward();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:forward()
//
// reload current or specified view
//
Navigation.prototype.reload = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].reload();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].reload();
        } else {
            console.log('ERROR[electron-navigation][func "reload();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:reload()
//
// stop loading current or specified view
//
Navigation.prototype.stop = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].stop();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].stop();
        } else {
            console.log('ERROR[electron-navigation][func "stop();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:stop()
//
// listen for a message from webview
//
Navigation.prototype.listen = function (id, callback) {
    let webview = null;

    //check id
    if ($('#' + id).length) {
        webview = document.getElementById(id);
    } else {
        console.log('ERROR[electron-navigation][func "listen();"]: Cannot find the ID "' + id + '"');
    }

    // listen for message
    if (webview != null) {
        try {
            webview.addEventListener('ipc-message', (event) => {
                callback(event.channel, event.args, webview);
            });
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.addEventListener('ipc-message', (event) => {
                    callback(event.channel, event.args, webview);
                });
            });
        }
    }
} //:listen()
//
// send message to webview
//
Navigation.prototype.send = function (id, channel, args) {
    let webview = null;

    // check id
    if ($('#' + id).length) {
        webview = document.getElementById(id);
    } else {
        console.log('ERROR[electron-navigation][func "send();"]: Cannot find the ID "' + id + '"');
    }

    // send a message
    if (webview != null) {
        try {
            webview.send(channel, args);
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.send(channel, args);
            });
        }
    }
} //:send()
//
// open developer tools of current or ID'd webview
//
Navigation.prototype.openDevTools = function (id) {
    id = id || null;
    let webview = null;

    // check id
    if (id == null) {
        webview = $('.nav-views-view.active')[0];
    } else {
        if ($('#' + id).length) {
            webview = document.getElementById(id);
        } else {
            console.log('ERROR[electron-navigation][func "openDevTools();"]: Cannot find the ID "' + id + '"');
        }
    }

    // open dev tools
    if (webview != null) {
        try {
            webview.openDevTools();
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.openDevTools();
            });
        }
    }
} //:openDevTools()
//
// print current or specified tab and view
//
Navigation.prototype.printTab = function (id, opts) {
    id = id || null
    let webview = null

    // check id
    if (id == null) {
        webview = $('.nav-views-view.active')[0]
    } else {
        if ($('#' + id).length) {
            webview = document.getElementById(id)
        } else {
            console.log('ERROR[electron-navigation][func "printTab();"]: Cannot find the ID "' + id + '"')
        }
    }

    // print
    if (webview != null) {
        webview.print(opts || {});
    }
}
//:nextTab()
//
// toggle next available tab
//
Navigation.prototype.nextTab = function () {
    var tabs = $('.nav-tabs-tab').toArray();
    var activeTabIndex = tabs.indexOf($('.nav-tabs-tab.active')[0]);
    var nexti = activeTabIndex + 1;
    if (nexti > tabs.length - 1) nexti = 0;
    $($('.nav-tabs-tab')[nexti]).trigger('click');
    return false
} //:nextTab()
//:prevTab()
//
// toggle previous available tab
//
Navigation.prototype.prevTab = function () {
    var tabs = $('.nav-tabs-tab').toArray();
    var activeTabIndex = tabs.indexOf($('.nav-tabs-tab.active')[0]);
    var nexti = activeTabIndex - 1;
    if (nexti < 0) nexti = tabs.length - 1;
    $($('.nav-tabs-tab')[nexti]).trigger('click');
    return false
} //:prevTab()
// go to a tab by index or keyword
//
Navigation.prototype.goToTab = function (index) {
    $activeTabAndView = $('#nav-body-tabs .nav-tabs-tab.active, #nav-body-views .nav-views-view.active');

    if (index == 'previous') {
        $tabAndViewToActivate = $activeTabAndView.prev('#nav-body-tabs .nav-tabs-tab, #nav-body-views .nav-views-view');
    } else if (index == 'next') {
        $tabAndViewToActivate = $activeTabAndView.next('#nav-body-tabs .nav-tabs-tab, #nav-body-views .nav-views-view');
    } else if (index == 'last') {
        $tabAndViewToActivate = $('#nav-body-tabs .nav-tabs-tab:last-of-type, #nav-body-views .nav-views-view:last-of-type');
    } else {
        $tabAndViewToActivate = $('#nav-body-tabs .nav-tabs-tab:nth-of-type(' + index + '), #nav-body-views .nav-views-view:nth-of-type(' + index + ')');
    }

    if ($tabAndViewToActivate.length) {
        $('#nav-ctrls-url').blur();
        $activeTabAndView.removeClass('active');
        $tabAndViewToActivate.addClass('active');
        this._updateUrl();
        this._updateCtrls();
    }
} //:goToTab()
/**
 * MODULE EXPORTS
 */
module.exports = Navigation;
