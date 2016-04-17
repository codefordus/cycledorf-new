// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
var geoLoc = null;
var fireBase = null;
var error = null;
var current_track = [];
var current_track_watch = null;

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

function geoSuccess(pos) {
    current_track.push(pos);
}

function geoError(e) {
    console.error(e);
}

function geo() {
    current_track_watch = navigator.geolocation.watchPosition(geoSuccess, geoError, { frequency: 3000, enableHighAccuracy: true });
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
        fireBase = new Firebase("https://glowing-torch-6628.firebaseio.com/users");
        //$(".start")

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();