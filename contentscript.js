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

    insertControls();
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
    cancelButton.classList.add('ytp-button');
    cancelButton.innerHTML = `
    <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%" align="center">
    <path class="ytp-svg-fill" d="M 8 2.441406 L 8 0.160156 L 3.8125 3.699219 L 8 6.511719 L 8 4.113281 C 10.761719 4.113281 13.023438 6.375 13.023438 9.136719 C 13.023438 11.902344 10.761719 14.164062 8 14.164062 C 5.238281 14.164062 2.976562 11.902344 2.976562 9.136719 L 1.300781 9.136719 C 1.300781 12.824219 4.316406 15.839844 8 15.839844 C 11.683594 15.839844 14.699219 12.824219 14.699219 9.140625 C 14.699219 5.457031 11.683594 2.441406 8 2.441406 Z M 8 2.441406" id="cancel"></path>
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
    if (event.ctrlKey && event.key === 'z') {
        rewind(vid, backupTime);
    }
});
