console.log("CTRL+Z for YouTube is running on this page");

const threshold = 10;
let vid;
let previousTime;

function initVid() {
    vid = document.getElementsByTagName("video")[0]; //we only have one video
    if (typeof vid === "undefined") {
        console.log("No videos found on the page.");
        return;
    }
    previousTime = vid.currentTime;
    chrome.storage.local.set({backupTime: 0}, function() {
      console.log('backupTime is set to ' + previousTime);
    });
    vid.addEventListener("timeupdate", function () {
        if (Math.abs(previousTime - vid.currentTime) > threshold) {
            chrome.storage.local.set({backupTime: previousTime}, function() {
              console.log('backupTime is set to ' + previousTime);
            });
        }
        previousTime = vid.currentTime;
    });
}


chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  console.log("Got message from background page: ", msg.message);
  if (msg.message === "cancel") {
      chrome.storage.local.get(['backupTime'], function(result) {
          console.log('Jumping from ', vid.currentTime, ' to ', result.backupTime);
          vid.currentTime = result.backupTime;
      });
  }
  else if (msg.message === "update") {
      initVid();
  }
});
