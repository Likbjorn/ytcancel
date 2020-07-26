let lastTabId = -1;

function messageToActiveTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, message);
  });
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo && changeInfo.status == "complete"){
        chrome.tabs.sendMessage(tabId, {message: "update", data: tab});
    }
});
