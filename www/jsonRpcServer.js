 /* exported jsonRpcServer */
function jsonRpcServer(api, targetWindow, targetOrigin) {
    // add own listener listening for all methods from API
    targetOrigin || (targetOrigin="*"); //REVIEW:
    return function(evt) {
        var request;
        try {
            request = JSON.parse(evt.data);
        } catch (ex) {
            return;
            // if no JSON payload, silently return this is probably other message
            // not for my listener, allow iframe to provide JSON RPC along with other messages 
        }
        var method = api[request.method];
        if (!method) {
            targetWindow.postMessage(err(-32601), targetOrigin); //method not found
        } else {
            method.apply(null, request.params.concat(function(e, r) {
                e //
                    && targetWindow.postMessage(err(-32603), targetOrigin) //
                    || targetWindow.postMessage(result(r), targetOrigin);
            }));
        }

        //-------------------------------------------------------------------------------------------
        function err(code) {
            return JSON.stringify({
                error: {
                    code: code
                },
                // RPC payload   
                "jsonrpc": "2.0",
                "id": request.id // echo original id 
            });
        }

        function result(r) {
            return JSON.stringify({
                result: r,
                // RPC payload   
                "jsonrpc": "2.0",
                "id": request.id // echo original id 
            });
        }
    };
}

jsonRpcServer.bindSync=function(fnc , thisArg ){
    // adds one more parameter to original funcion
    // and converts retval or error to callback values

    return function(/* a,b,c, callback */){
        try{
            var args=Array.prototype.slice.call(arguments);
            var callback=args.pop();
            // assert callback is function
            callback(null,fnc.apply(thisArg,args));
        }
        catch(ex){
            callback(ex,null);
        }
    }
}
