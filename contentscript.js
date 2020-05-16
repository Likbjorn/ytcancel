console.log("contentscript.js started");

let vid = document.getElementsByTagName("video")[0]; //we only have one video

const threshold = 10;
let previousTime = 0;

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

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  console.log("Got message from background page: ", msg);
  if (msg === "cancel") {
      chrome.storage.local.get(['backupTime'], function(result) {
          console.log('Jumping from ', vid.currentTime, ' to ', result.backupTime);
          vid.currentTime = result.backupTime;
      });
  }
});
