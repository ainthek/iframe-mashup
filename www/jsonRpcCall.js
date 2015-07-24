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
 function jsonListener(origin, source, fnc) {
     // jsonListener(fn) //any origin, any source
     // jsonListener(frames.myFrame,fn) // source checked (obj)
     // jsonListener("http://",fn) // origich checked (string)
     // jsonListener(frames.myFrame,"http://", fnc); // allchecked   
     if (arguments.length == 1) {
         fnc = origin;
         source = origin = null;
     } else if (arguments.length == 2) {
         fnc = source;
         if (typeof origin == "string") {
             source = null;
         } else {
             source = origin;
             origin = null;
         }
     }

     return function(evt) {
         if (source && source != evt.source || origin && origin != evt.origin) {
             return;
         }
         
         try {
             fnc(evt, JSON.parse(evt.data));
         } catch (ex) {
             // if no JSON payload, silently return this is probably other message
             // not for my listener, allow iframe to provide JSON RPC along with other messages 
             return;
         }
     }
 }
