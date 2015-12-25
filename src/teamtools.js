/**
 * Created by humanity on 8/26/15.
 */

//require('ajaxWrapper.js');

window.debugTeamtools = {};
window.debugTeamtools.all = true;
window.debugTeamtools.xhr = true;
window.debugTeamtools.arguments = true;


/*
    teamtools is using teamtoolsSettings for user info

    -id: unique customer id

        email, customers internal id, or something else
        first time someone can use it without secret and
        we don't care what it is unless it is md5

        when start using it with secret it will be md5 or sha1

    -appid: is customers public id


    -custom_attr: custom attributes, we should see about types
 */


window.teamtools = (function (){

    var teamtools = {};

    var queue = new funcQueue();
    var preInited = false;
    var inited = false;

    var access_token = '';
    var refresh_token = '';
    var endUser = '';
    var key = '';
    

     /*
        When customer is using frontEnd SDK we have to provide him with info if he is using some
        function with wrong number of arguments, types would also be great but if something
        pop on my mind I will add it, or you can do it :P
     */
    var checkArguments = function(arguments, count, callback){

        //Default value for callback should be true!
        callback = typeof(callback) != 'undefined' ? callback : true;


        //Check if some arguments are missing and throw error so  everything should break
        if(arguments.length < count){
            var error = new Error('Missing some arguments, expected '+count+' received '+arguments.length);
            throw error;
        }

        //If last arguments is callback we have to check if it is function
        if(callback && typeof(arguments[count - 1]) != 'function'){
            var error = new Error('Argument on position '+count+' should be function');
            throw error;
        }
    }

    /*
        check if teamtools is initialised before next action
     */
    var checkInited = function(){
        if(inited && access_token != ''){
            return true;
        }

        return false;
    }

    //send some data to the server using settings from teamtoolsSettings
    //lets see if backend dev will look for oauth2 or maybe session
    var send = function (url, data, callback){
        checkArguments(arguments, 3);

        var ajax = new ajaxWrapper(url, function customCallback(error, responseData){
            if(error){
                if(error.error == 'access_denied'){
                    refreshToken(url, data, callback);
                }
                return;
            }

            callback(error, responseData);
        });
        
        data.access_token = access_token;

        ajax.send(data);
    }

    var refreshToken = function refreshToken(url, data, callback){
        var refreshTokenData = {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        };

        var ajax = new ajaxWrapper('http://auth.teamtools.local/access_token', function customCallback(error, responseData){
            if(error){
                console.log('TOKEN: FATAL ERROR');
                return;
            }

            access_token = responseData.access_token;
            refresh_token = responseData.refresh_token;

            send(url, data, callback);
        });

        ajax.send(refreshTokenData);
    };

    //Init user should be called just once
    teamtools.init = function(accessToken, refreshToken, end_user, key_init){

        if(checkInited()){
           console.error('Teamtools is allready initialised');
            return;
        }

        if(preInited){
            console.error('There is no need to call init method more than once')
            return;
        }

        preInited = true;

        access_token = accessToken;
        refresh_token = refreshToken;
        endUser = end_user;
        key = key_init;
        

        inited = true;

        queue.execAll();
    }

    //Track users event, with or without value
    teamtools.track = function (eventName, value){

        if(!checkInited()){
            queue.addFunction(arguments, this);
            return;
        }

        checkArguments(arguments, 1, false);

        var data = {
            name: eventName,
            endUser: endUser,
            key: key
        }

        if(value){
            data.metadata = value;
        }

        send('http://api.teamtools.local/events', data, function (error, response){

            console.log(arguments);
            if(error){
                console.error(error);
                return;
            }

            if(response.returnCode != 1){
                console.log(response.message);
            }

        })
    }

    window.teamtools = teamtools;
    return teamtools;

})()
