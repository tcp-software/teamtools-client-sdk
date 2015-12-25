/**
 * Created by humanity on 8/26/15.
 */

function ajaxWrapper(url, callback){

    //debug ON/OFF -> window.debugTeamtools

    //AJAX object that will do all operations
    var xhr = null;

    //fast debuging function
    this.log = function(text){
        if(window.debugTeamtools && (window.debugTeamtools.all || window.debugTeamtools.xhr))
            console.log(text);
    }

    this.init = function (url) {

        /*
         Supporting old IE verisons with ActiveXObject
         */
        if (window.XMLHttpRequest) {

            xhr = new XMLHttpRequest();

        } else {

            xhr = new ActiveXObject("Microsoft.XMLHTTP");

        }

        /*
            define what will be called and set type of body because we will use JSON
        */
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json');

        //for fast debuging
        xhr.onload = (function (e) {
            this.log('onload');
        }).bind(this);

        //for fast debuging
        xhr.onloadstart = (function (e) {
            this.log('onloadstart');
        }).bind(this);

        //call response function
        xhr.onloadend = (function (e){
            this.log('onloadend');

            var resp = e.target;
            var error = null;
            var data = JSON.parse(resp.response);

            if(resp.status != 200){
                error = data;
            }

            callback(error, data);
        }).bind(this);
    }

    this.send = function(data){

        if(!xhr) {
            this.log('Not inited');
            return;
        }

        xhr.send(JSON.stringify(data));
    }

    this.init(url);
}