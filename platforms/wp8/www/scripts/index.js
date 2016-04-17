// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
var geoLoc = null;
var fireBase = null;
var error = null;

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
            console.log("Auth successfull!");
        }
    });
}

function geoSuccess(pos) {
    geoLoc = pos;
}

function geoError(e) {
    console.error(e);
}

function geo() {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { maximumAge: 5000, timeout: 10000 })
}


(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        var geoInt = setInterval(geo, 10000);
        fireBase = new Firebase("https://glowing-torch-6628.firebaseio.com/users");
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();