/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
    document.addEventListener("click", (e) => {

    /**
    * Insert the page-hiding CSS into the active tab,
    * then get the beast URL and
    * send a "beastify" message to the content script in the active tab.
    */
    function filterVideo(tabs) {
        const thresholdSeen = document.getElementById("rangeThresholdView").value;
        browser.tabs.sendMessage(tabs[0].id, {
            command: "filterVideo",
            thresholdSeen: thresholdSeen,
            beginTime: +getSeconds(document.getElementById("beginTime").value),
            endTime: +getSeconds(document.getElementById("endTime").value),
        });
    }
    function filterComment(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            command: "filterComment",
            beginReplies: +document.getElementById("beginReplies").value,
            endReplies: +document.getElementById("endReplies").value,
        });
    }

    /**
     * Just log the error to the console.
     */
     function reportError(error) {
        console.error(`Could not beastify: ${error}`);
    }

    /**
    * Get the active tab,
    * then call "beastify()" or "reset()" as appropriate.
    */
    if (e.target.classList.contains("filterVideo")) {
        browser.tabs.query({active: true, currentWindow: true})
            .then(filterVideo)
            .catch(reportError);
    } else if (e.target.classList.contains("filterComment")){
        browser.tabs.query({active: true, currentWindow: true})
            .then(filterComment)
            .catch(reportError);
    }
});
}

const amountThreshold = document.getElementById('rangeThresholdView')
amountThreshold.oninput = function(e) {
    document.getElementById('amountThresholdView').innerHTML = e.target.value;
}

function reportExecuteScriptError(error) {
    console.error(`lol nope: ${error.message}`);
}

function getSeconds(s) {
    const split_s = s.split(':');
    return (+split_s[0]) * 3600 + (+split_s[1]) * 60 + (+split_s[2]);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({file: "/scripts/apply.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
