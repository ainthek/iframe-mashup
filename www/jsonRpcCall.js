 /* exported jsonRpcCall */
 function jsonRpcCall(otherWindow, method, params, callback) {
     //http://www.jsonrpc.org/specification
     var request = {
         // call data
         "method": method,
         "params": params,
         // RPC payload   
         "jsonrpc": "2.0",
         "id": +new Date() + Math.random()
     };
     window.addEventListener("message", function(evt) {

         var response = JSON.parse(evt.data);

         if (request.id === response.id) {
             // remove listener for this result
             window.removeEventListener("message", arguments.callee, false);
             //  
             callback(response.error, response.result);
         }
     });
     otherWindow.postMessage(JSON.stringify(request), "*");
 }
