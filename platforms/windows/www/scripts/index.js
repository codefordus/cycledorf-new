// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
var geoLoc = null;
var fireBase = null;
var error = null;
var current_track = [];
var current_track_watch = null;
var current_track_distance = 0;
var currently_tracking = false;

function fireLogin() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    fireBase.authWithPassword({
        "email": user,
        "password": pass
    }, function (e, authData) {
        if (e)
            console.warn(e.code);
        else {
            console.warn("Auth successfull!");
        }
    });
}

function getDistance(lat1, lon1, lat2, lon2) {
    //Quelle: http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371000; // metres
    var lat1_ = lat1 * (Math.PI / 180);
    var lat2_ = lat2 * (Math.PI / 180);
    var d_lat = (lat2 - lat1) * (Math.PI / 180);
    var d_lon = (lon2 - lon1) * (Math.PI / 180);

    var a = Math.sin(d_lat / 2) * Math.sin(d_lat / 2) +
            Math.cos(lat1_) * Math.cos(lat2_) *
            Math.sin(d_lon / 2) * Math.sin(d_lon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function geoSuccess(pos) {
    console.log("New Data!");
    current_track.push({ acc: pos.coords.accuracy, lat: pos.coords.latitude, lon: pos.coords.longitude, timestamp: pos.timestamp.toJSON() });
    var len = current_track.length;
    if (len > 1) {
        current_track_distance += getDistance(current_track[len - 1].lat, current_track[len - 1].lon, current_track[len - 2].lat, current_track[len - 2].lon);
    }
}

function geoError(e) {
    currently_tracking = false;
    console.error(e);
}

function geo() {
    if (currently_tracking) {
        navigator.geolocation.clearWatch(current_track_watch);
        console.log("[GPS]Tracking stopped");
        currently_tracking = false;
        if (current_track.length > 2) {
            var dur = new Date((new Date(current_track[current_track.length - 1].timestamp).getTime()) - (new Date(current_track[0].timestamp).getTime())).getSeconds();
            fireBase.push({ data: current_track, distance: current_track_distance, start_time: current_track[0].timestamp, end_time: current_track[current_track.length - 1].timestamp, duration: dur });
        }
        current_track = [];
        current_track_distance = 0;
        return false;
    } else {
        current_track_watch = navigator.geolocation.watchPosition(geoSuccess, geoError, { frequency: 1000, enableHighAccuracy: true });
        console.log("[GPS]Tracking enabled");
        currently_tracking = true;

        return true;
    }
}


(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        //var geoInt = setInterval(geo, 10000);
        Firebase.INTERNAL.forceWebSockets();
        fireBase = new Firebase("https://cycledorf-phonegap.firebaseio.com/tracks");
        fireBase.authAnonymously(function (e, authData) {
            if (e)
                console.warn(e.code);
            else {
                console.warn("Auth successfull!");
            }
        });
        //$(".start")

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();