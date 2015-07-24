/* exported loadCss */
function loadCss(uri, media) {
    // FIXME: URI shell be specified from host page uri, not my uri
    // which si a bit problematic, since I may not access parents uri
    // maybe when he sends me a message ? the from the message ?
    var l = document.createElement("link");
    l.setAttribute("rel", "stylesheet");
    l.setAttribute("type", "text/css");
    l.setAttribute("href", uri);
    media &&  l.setAttribute("media", media);
    document.getElementsByTagName("head")[0].appendChild(l);
}
