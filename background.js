  let url = 'TEST_URL'

 chrome.tabs.onActivated.addListener((tabId) => {
  chrome.storage.sync.get(url, (data) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      url = tabs[0].url.split('?')[0]
      chrome.tabs.sendMessage(tabs[0].id, {
        sentBy: 'background',
        data: data[url]
      });
    });
  })
}) 
 
 chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    url = tab.url.split('?')[0]
    chrome.storage.sync.get(url, (data) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          sentBy: 'background',
          data: data[url]
        });
      });
    })
  }
}) 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.sentBy === 'getUrl') {
    chrome.runtime.sendMessage(url)
  } else if (request.sentBy === 'clearPage') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  } else if (request.sentBy === 'clearAll') {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.reload(tab.id)
      })
    });
  }
});
