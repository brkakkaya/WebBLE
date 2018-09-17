/*jslint
        browser
*/
/*global
        atob, BluetoothUUID, Event, uk, window
*/
eval('var uk = uk || {};');
if (!uk.co) {
    uk.co = {};
}
if (!uk.co.greenparksoftware) {
    uk.co.greenparksoftware = {};
}
uk.co.greenparksoftware.wbutils = {
    btDeviceNameIsOk: function (name) {
        "use strict";
        let nameUTF8len = new StringView(name).buffer.byteLength;
        return nameUTF8len <= 248 && nameUTF8len >= 0;
    },
    canonicaliseFilter: function (filter) {
        "use strict";
        // implemented as far as possible as per
        // https://webbluetoothcg.github.io/web-bluetooth/#bluetoothlescanfilterinit-canonicalizing
        const services = filter.services;
        const name = filter.name;
        const wbutils = uk.co.greenparksoftware.wbutils;
        if (!wbutils.btDeviceNameIsOk(name)) {
            throw new TypeError(`Invalid filter name ${name}`);
        }
        const namePrefix = filter.namePrefix;
        if (
            !wbutils.btDeviceNameIsOk(namePrefix) ||
            (new StringView(namePrefix).buffer.byteLength) === 0
        ) {
            throw new TypeError(`Invalid filter namePrefix ${namePrefix}`);
        }

        let canonicalizedFilter = { name, namePrefix };

        if (services === undefined && name === undefined && namePrefix === undefined) {
            throw new TypeError("Filter has no usable properties");
        }
        if (services !== undefined) {
            if (!services) {
                throw new TypeError('Filter has empty services');
            }
            let cservs = services.map(BluetoothUUID.getService);
            canonicalizedFilter.services = cservs;
        }

        return canonicalizedFilter;
    }
};

(function () {
    function nslog(message) {
        window.webkit.messageHandlers.logger.postMessage(message);
        if (window.copyNSLogToConsole) {
            console.log(message);
        }
    }
    window.nslog = nslog;
})();
nslog('WBUtils imported');
