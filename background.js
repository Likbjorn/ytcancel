let lastTabId = -1;

function messageToActiveTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, message);
  });
}

chrome.commands.onCommand.addListener(function(command) {
    console.log("Command: ", command);
    if (command === "cancel") {
        messageToActiveTab("cancel");
    }
});
