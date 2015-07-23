function jsonRpcServer(api, targetWindow, targetOrigin) {
    // add own listener listening for all methods from API
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
            targetWindow.postMessage(err(-32601), "*"); //method not found
        } else {
            method.apply(null, request.params.concat(function(e, r) {
                e //
                    && targetWindow.postMessage(err(-32603), "*") //
                    || targetWindow.postMessage(result(r), "*")
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

        function result(result) {
            return JSON.stringify({
                result: result,
                // RPC payload   
                "jsonrpc": "2.0",
                "id": request.id // echo original id 
            });
        }
    }
}
