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
