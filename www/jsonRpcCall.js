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
     window.addEventListener("message", jsonListener(function(evt, response) {

         if (request.id === response.id) {
             // remove listener for this result
             window.removeEventListener("message", arguments.callee, false);
             //  
             callback(response.error, response.result);
         }
     }));
     otherWindow.postMessage(JSON.stringify(request), "*");
 }
 /* exported jsonListener */
 function jsonListener(fnc) {
     // use this to simplify code in window.addMessageLsteren
     return function(evt) {
         try {
             fnc(evt, JSON.parse(evt.data));
         } catch (ex) {
             // if no JSON payload, silently return this is probably other message
             // not for my listener, allow iframe to provide JSON RPC along with other messages 
             return;
         }
     }
 }
