console.log("CTRL+Z for YouTube is running on this page");

const threshold = 10;
let vid;
let previousTime;
let backupTime;


function initVid() {
    vid = document.getElementsByTagName("video")[0]; //we only have one video
    if (typeof vid === "undefined") {
        console.log("No videos found on the page.");
        return;
    }
    previousTime = vid.currentTime;
    backupTime = 0;
    console.log('backupTime is set to ' + backupTime);
    vid.addEventListener("timeupdate", updateTimes);

    if (!document.contains(document.getElementById('cancel'))) {
        insertControls();
    }
}


function updateTimes() {
    if (Math.abs(previousTime - vid.currentTime) > threshold) {
        backupTime = previousTime;
        console.log('backupTime is set to ' + backupTime);
    }
    previousTime = vid.currentTime;
}


function rewind(vid, time) {
    console.log('Jumping from ', vid.currentTime, ' to ', time);
    vid.currentTime = time;
}


function insertControls() {
    controlPanel = document.getElementsByClassName('ytp-left-controls')[0];
    let cancelButton = document.createElement('button');
    cancelButton.id = 'cancel';
    cancelButton.classList.add('ytp-button');
    cancelButton.setAttribute('aria-label', 'Rewind to backup (Ctrl+Z)');
    cancelButton.setAttribute('title', 'Rewind to backup (Ctrl+Z)');
    cancelButton.innerHTML = `
    <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%" align="center">
    <path class="ytp-svg-fill" d="M 6 14 v 8 h 8 l -2 -2 q 9 -8 18 2 q -11 -17 -22 -6 Z"></path>
    </svg>
    `;
    cancelButton.onclick = function() {
        rewind(vid, backupTime);
    };
    controlPanel.append(cancelButton);
}


chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    console.log("Got message from background page: ", msg.message);
    if (msg.message === "update") {
        initVid();
    }
});


document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.code === 'KeyZ') {
        rewind(vid, backupTime);
    }
});
