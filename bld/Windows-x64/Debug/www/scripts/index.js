// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
var geoLoc = null;
var fireBase = null;
var fireBaseTracks = null;
var fireBaseStats = null;
var fireBaseStatsDriven = null;
var error = null;
var current_track = [];
var current_track_watch = null;
var current_track_distance = 0;
var currently_tracking = false;
var map = null;


function fireLogin() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    fireBaseTracks.authWithPassword({
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
    //console.log("New Data!");
    if (pos.coords.accuracy > 80) {
        console.warn("[geo]Accuracy too low!");
    } else {
        current_track.push({ acc: pos.coords.accuracy, lat: pos.coords.latitude, lon: pos.coords.longitude, timestamp: Math.floor(pos.timestamp.getTime() / 1000) });
        var len = current_track.length;
        if (len > 1) {
            curDistance = getDistance(current_track[len - 1].lat, current_track[len - 1].lon, current_track[len - 2].lat, current_track[len - 2].lon);
            current_track_distance += curDistance;
            fireBaseStatsDriven.transaction(function (curData) {
                return curData + curDistance;
            });
        }
        console.log("[geo]New Data!");
        // LEAFLET


        //map.setView(L.latLng(pos.coords.longitude, pos.coords.latitude));
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
        if (current_track.length >= 2) {
            var dur = Math.floor(new Date((new Date(current_track[current_track.length - 1].timestamp).getTime()) - (new Date(current_track[0].timestamp).getTime())).getTime());
            fireBaseTracks.push({ data: current_track, distance: current_track_distance, start_time: current_track[0].timestamp, end_time: current_track[current_track.length - 1].timestamp, duration: dur });
        }
        current_track = [];
        current_track_distance = 0;
        return false;
    } else {
        current_track_watch = navigator.geolocation.watchPosition(geoSuccess, geoError, { frequency: 1000, enableHighAccuracy: true });
        console.log("[GPS]Tracking enabled");
        currently_tracking = true;
        
        //map init
        //map = L.map("map");

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
        fireBase = new Firebase("https://cycledorf-phonegap.firebaseio.com");
        fireBase.authAnonymously(function (e, authData) {
            if (e)
                console.warn(e.code);
            else {
                console.info("[FB]Auth successfull!");
                fireBaseTracks = fireBase.child("tracks");
                console.info("[FB]Child 'tracks' added!");
                fireBaseStats = fireBase.child("stats");
                console.info("[FB]Child 'stats' added!");
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