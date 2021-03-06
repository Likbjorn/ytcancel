console.log("CTRL+Z for YouTube is running on this page");

const threshold = 10;
let vid;
let previousTime;
let backupTime;
let undoTimes;
let redoTimes;
let undoInProgress = false;

let undoButton;
let redoButton;

// svg code is present here because it is simple and it must be inline,
// otherwise styles will not be inherited
const undoSVG = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%" align="center">
<path class="ytp-svg-fill" d="M 6 14 v 8 h 8 l -2 -2 q 9 -8 18 2 q -11 -17 -22 -6 Z"></path>
</svg>`;

const redoSVG = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%" align="center">
<path class="ytp-svg-fill" d="M 30 14 v 8 h -8 l 2 -2 q -9 -8 -18 2 q 11 -17 22 -6 Z"></path>
</svg>`;


function initVid() {
    vid = document.getElementsByTagName("video")[0]; //we only have one video
    if (typeof vid === "undefined") {
        console.log("No videos found on the page.");
        return;
    }
    console.log("New video found");
    previousTime = vid.currentTime;
    undoTimes = [];
    redoTimes = [];
    vid.addEventListener("timeupdate", updateTimes);

    // insert UI buttons on YouTube player control panel
    if (!document.contains(document.getElementById('ytz-undo'))) {
        insertControls();
    }
}


function updateTimes() {
    if (undoInProgress) {
        console.log('Undo in progress, new backup times are not remembered');
        console.log('undoTimes are:  ' + undoTimes);
        console.log('redoTimes are:  ' + redoTimes);
        undoInProgress = false;
    } else if (Math.abs(previousTime - vid.currentTime) > threshold) {
        undoTimes.push(previousTime);
        redoTimes = [];
        console.log('undoTimes are:  ' + undoTimes);
        console.log('redoTimes are:  ' + redoTimes);

        setButtonsVisibility();
    }
    previousTime = vid.currentTime;
}


function setButtonsVisibility() {
    if (redoTimes.length === 0) {
        redoButton.style.display = 'none';
    } else {
        redoButton.style.display = 'inline';
    }
    if (undoTimes.length === 0) {
        undoButton.style.display = 'none';
    } else {
        undoButton.style.display = 'inline';
    }
}


function rewind(vid, time) {
    console.log('Jumping from ', vid.currentTime, ' to ', time);
    vid.currentTime = time;
}


function undo() {
    if (undoTimes.length > 0) {
        backupTime = undoTimes.pop();
    }
    else return; // do nothing if no undo times left
    redoTimes.push(vid.currentTime);
    undoInProgress = true; // do not trigger updateTimes function
    rewind(vid, backupTime);
    setButtonsVisibility();
}


function redo() {
    if (redoTimes.length > 0) {
        backupTime = redoTimes.pop();
    }
    else return;
    undoTimes.push(vid.currentTime);
    undoInProgress = true;
    rewind(vid, backupTime);
    setButtonsVisibility();
}


function insertControls() {
    controlPanel = document.getElementsByClassName('ytp-left-controls')[0];
    let referenceNode = controlPanel.getElementsByClassName('ytp-volume-area')[0];

    undoButton = document.createElement('button');
    undoButton.id = 'ytz-undo';
    undoButton.classList.add('ytp-button');
    undoButton.setAttribute('aria-label', 'Rewind to backup (Ctrl+Z)');
    undoButton.setAttribute('title', 'Rewind to backup (Ctrl+Z)');
    undoButton.innerHTML = undoSVG;
    undoButton.onclick = function() {
        undo();
    };
    undoButton.style.display = 'none';
    controlPanel.insertBefore(undoButton, referenceNode);

    redoButton = document.createElement('button');
    redoButton.id = 'ytz-redo';
    redoButton.classList.add('ytp-button');
    redoButton.setAttribute('aria-label', 'Redo (Ctrl+Y)');
    redoButton.setAttribute('title', 'Redo (Ctrl+Y)');
    redoButton.innerHTML = redoSVG;
    redoButton.onclick = function() {
        redo();
    };
    redoButton.style.display = 'none';
    controlPanel.insertBefore(redoButton, referenceNode);
}


chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    console.log("Got message from background page: ", msg.message);
    if (msg.message === "update") {
        initVid();
        setButtonsVisibility();
    }
});


document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.code === 'KeyZ') {
        undo();
    } else if (event.ctrlKey && event.code === 'KeyY') {
        redo();
    }
});
