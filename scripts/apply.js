function time2int(s){
    const split_s = s.split(':');
    return split_s.reverse().reduce(([res, factor], x)=>[factor*x+res, factor*60], [0,1])[0];
}

function divComment2nbReplies(divComment) {
    const replies = divComment.querySelector("#more-replies");
    if (replies){
        const repliesStr = replies.querySelector("yt-formatted-string")
        if (repliesStr.textContent === "Afficher la réponse") {
            return 1;
        } else {
            return + repliesStr.querySelectorAll('span')[1].textContent;
        }
    } else {
        return 0;
    }
}

(function() {
  
    function filterVideo(thresholdSeen, beginTime, endTime) {
        // ytd-rich-item-renderer , ytd-compact-video-renderer
        const existingVideo = document.querySelectorAll("ytd-rich-item-renderer , ytd-compact-video-renderer , ytd-grid-video-renderer");
        for (let video of existingVideo) {
            let renderer = video.querySelector("ytd-thumbnail-overlay-resume-playback-renderer")
            let timer = video.querySelector("ytd-thumbnail-overlay-time-status-renderer");
            if(timer) console.log();
            if (renderer) { 
                if (
                    renderer && 
                    renderer.offsetWidth && 
                    renderer.querySelector("#progress").offsetWidth / renderer.offsetWidth * 100 > thresholdSeen
                ) video.remove();
            } 
            if (video && timer) {
                const strTime = timer.querySelector('span').textContent.replace(' ', '').replace('\n', '');
                const time = time2int(strTime);
                if((beginTime && beginTime>time) || (Boolean(endTime) && time>endTime)) video.remove();
            }
        }
    }

    function filterComment(beginReplies, endReplies) {
        const comments = document.querySelectorAll("ytd-comment-thread-renderer");
        for (let comment of comments) {
            const nbReplies = divComment2nbReplies(comment);
            if ((Boolean(beginReplies) && nbReplies < beginReplies) || (Boolean(endReplies) && nbReplies > endReplies))
                comment.remove();
        }
    }

    /**
     * Listen for messages from the background script.
    */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "filterVideo") {
            filterVideo(message.thresholdSeen, message.beginTime, message.endTime);
        } else if (message.command == "filterComment"){
            filterComment(message.beginReplies, message.endReplies)
        }
    });
  
})();