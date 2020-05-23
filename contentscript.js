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
    vid.addEventListener("timeupdate", function () {
        if (Math.abs(previousTime - vid.currentTime) > threshold) {
            backupTime = previousTime;
            console.log('backupTime is set to ' + backupTime);
        }
        previousTime = vid.currentTime;
    });
}


chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    console.log("Got message from background page: ", msg.message);
    if (msg.message === "cancel") {
        console.log('Jumping from ', vid.currentTime, ' to ', backupTime);
        vid.currentTime = backupTime;
    }
    else if (msg.message === "update") {
        initVid();
    }
});
