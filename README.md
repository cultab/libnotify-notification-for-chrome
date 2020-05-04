# DOES NOT WORK AS EXPECTED UNFORTUNATLY
Some notifications just never show up, keeping the repo incase something changes.

Dependencies
------------

Install these and their devel/dev packages using your package manager.

- libcurl
- json-c
- libnotify (obviously)

Install this [chromium extension](https://chrome.google.com/webstore/detail/libnotify-notifications-i/epckjefillidgmfmclhcbaembhpdeijg).

Install
-------

Edit install.sh to target the correct directory (see line 18)
change the 'chrome': `TARGET_DIR="$HOME/.config/chrome/NativeMessagingHosts"`
to whatever your browser is called the directory probably already exists. Use common sense :).
e.g: for vivaldi-stable it's: `TARGET_DIR="$HOME/.config/vivaldi/NativeMessagingHosts"`

```shell
# make
$ ./install.sh
```

Then as per [this answer on askubuntu](https://askubuntu.com/questions/465727/activate-chrome-native-notifications) navigate to `$HOME/.config/chrome/NativeMessagingHosts` (or to where you set the TARGET_DIR to in install.sh) and add the extension id to the .json file. It should look like this after the edit:

```json
{
  "name": "com.initiated.chrome_libnotify_notifications",
  "description": "Libnotify Notifications in Chrome",
  "path": path to the location of install.sh,
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://gphchdpdmccpjmpiilaabhpdfogeiphf/",
    "chrome-extension://epckjefillidgmfmclhcbaembhpdeijg/"
  ]
}
```

Next navigate to `$HOME/.config/chrome/Default/Extensions/epckjefillidgmfmclhcbaembhpdeijg/1.1_0` (capitalization may vary and again replace 'chrome' if need be) and replace the entire file called notifu_hook.js with the following (you can also find it in the repo as 'notifu_hook.js')

```js
OriginalNotification = Notification

Notification = function(title, properties) {
        if (Notification.permission != "granted") {
                if (this.onError) {
                        this.onError();
                }
                return;
        }
        if (!properties.hasOwnProperty("body")) {
                properties["body"] = "";
        }
        if (!properties.hasOwnProperty("icon")) {
                properties["icon"] = "";
        }
        if (properties["icon"]) {
                properties["icon"] = getBaseURL() + properties["icon"];
        }
        document.getElementById('libnotify-notifications-transfer-dom-area').innerText = JSON.stringify({title:title, body:properties["body"], iconUrl:properties["icon"]});
        var event = document.createEvent("UIEvents");
        event.initUIEvent("change", true, true);
        document.getElementById('libnotify-notifications-transfer-dom-area').dispatchEvent(event);
        if (this.onShow) {
                this.onShow();
        }
};

Object.defineProperty(Notification, "permission", {
        get: function() {
                return OriginalNotification.permission;
        },
        set: undefined
});

Notification.requestPermission = function(callback) {
        OriginalNotification.requestPermission(callback);
}

window.webkitNotifications = {}

window.webkitNotifications.checkPermission = function() {
        return 0;
}

window.webkitNotifications.createNotification = function(image, title, body) {
        if (image) {
                image = getBaseURL() + image;
        }
        document.getElementById('libnotify-notifications-transfer-dom-area').innerText = JSON.stringify({title:title, body:body, iconUrl:image});
        var event = document.createEvent("UIEvents");
        event.initUIEvent("change", true, true);
        document.getElementById('libnotify-notifications-transfer-dom-area').dispatchEvent(event);
}

function getBaseURL() {
           return location.protocol + "//" + location.hostname + 
                   (location.port && ":" + location.port) + "/";
}
```


# That should do it

You can use [this site](https://www.bennish.net/web-notifications.html) to test if it worked.

# License

Some files in this repo have licenses attached (like install.sh), some have not but must be assumed to be some version of the GPL (like invoke_notify.c cause of it's dependency to libnotify).

# Special Thanks to:
Nick Mossie for the [chrome extention](https://chrome.google.com/webstore/detail/libnotify-notifications-i/epckjefillidgmfmclhcbaembhpdeijg)

Saikrishna Arcot (@saiarcot895) for [his answer on askubuntu](https://askubuntu.com/questions/465727/activate-chrome-native-notifications) without which this repo would not exist.


