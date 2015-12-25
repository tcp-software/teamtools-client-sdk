/*
    If there is need for function to be executed later after
    something is done and we are not sure when it will be
    add functions to queue and call execAll
 */

function funcQueue (){

    var queue = [];

    /*add function to queue
        arguments - default arguments with callee function
        fScope - will probably be this, or scope on which function will be executed
     */
    this.addFunction = function (arguments, fScope){
        queue.push({
            func: arguments.callee.bind(fScope),
            args: arguments
        });
    }

    //return length of queue
    this.getLength = function (){
        return queue.length;
    }

    //execute first function in queue
    this.execOne = function (index){
        var one = queue.pop();
        one.func.apply(null, one.args);
    }

    //execute all function in queue with some delay if required
    //TODO: add delay
    this.execAll = function (delay){
        for(var i in queue){
            var func = queue[i].func;
            var args = queue[i].args;

            func.apply(null, args);
        }

        queue.splice(0,queue.length);
    }
}