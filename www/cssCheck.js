/* exported cssCheck */
/* exported loadCss */
function cssCheck(expectedStyleSheet, realStyleSheet) {
    // function checks if real is 'sublist' of expected
    // usefull to allow or deny application of CSS in your component
    // 'sublist' means:
    // SELECTORS: styleSheet.rules[].selectorText
    // - real cannot have any extra selectors only selectors in expected
    // - order of selectors is significant
    // RULE: if selectors are ok then each individual CSSStyleRule is checked for style
    // - real.rule.style[] must be sublist of  expected.rule.style[] 

    var expectedRules = _Array(expectedStyleSheet.rules);
    var realRules = _Array(realStyleSheet.rules);

    var expectedSelectorTexts = expectedRules.map(selectorText);
    var realSelectorTexts = realRules.map(selectorText);

    // console.log(expectedSelectorTexts, realSelectorTexts)
    // SAMPLE: isSubList(["h1", ".selector1", ".selector2 span"],["h1", ".selector1", ".selector2 span"])
    if (!isSubList(expectedSelectorTexts, realSelectorTexts)) {
        return false;
    }
    var rulesOk = realRules.every(function(realRule) {
        var expectedRule = find(expectedRules, function(expectedRule) {
            return expectedRule.selectorText === realRule.selectorText;
        });
        // asrt(expectedRule!=null,"because:" selectorOk)
        // names and order of rules must match
        return expectedRule && isSubList(_Array(expectedRule.style), _Array(realRule.style));
    });

    return rulesOk;


    function selectorText(r) {
        return r.selectorText;
    }

    function isSubList(full, sequence) {
        for (var f = 0, s = 0, fl = full.length, sl = sequence.length; s < sl && f < fl; full[f++] === sequence[s] && s++){}
        return full && s == sl;
    }

    function _Array(list) {
        return Array.prototype.slice.call(list);
    }

    function find(_this, predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(_this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    }
}

function loadCss(uri, allowedStylesheet) {
    // loads css and checks agains stylesheet
    // FIXME: URI shell be specified from host page uri, not my uri
    // which si a bit problematic, since I may not access parents uri
    // maybe when he sends me a message ? the from the message ?
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", uri);

    link.setAttribute("media", "none"); //!!!
    addEventListener("load", function() {

        // find styleskeet for this element/node
        var requestedStylesheet = [].slice.call(document.styleSheets).filter(function(styleSheet) {
            return styleSheet.ownerNode === link;
        })[0];
        console.assert(requestedStylesheet!=null);
        if (cssCheck(allowedStylesheet, requestedStylesheet)) {
            link.media = "all"; // TODO: enabled disabled ? or media list ?
        } else {
            console.error("cssCheck: rejecting stylesheet", uri);
        }
    });
    document.getElementsByTagName("head")[0].appendChild(link);
}
