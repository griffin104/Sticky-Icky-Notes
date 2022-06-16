const addNoteButton = document.querySelector('#addNoteButton')
const inputField = document.querySelector('#inputField')
const clearPage = document.querySelector('#clearPage')
const clearAll = document.querySelector('#clearAll')

let url
chrome.runtime.sendMessage({ sentBy: 'getUrl'})

chrome.runtime.onMessage.addListener( (message) => {
  url = message
});

addNoteButton.addEventListener('click', ()=> {
  let text = inputField.value;

    console.log(text)
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {sentBy: 'popup', data: {
      text,
      url
    }});
  }); 
});

clearPage.addEventListener('click', ()=>{
  chrome.storage.sync.set({[url]: []})
    chrome.runtime.sendMessage({sentBy: 'clearPage', data: {
      url
    }});
});


clearAll.addEventListener('click', ()=>{
  let execute = confirm("Are you SURE you want to delete ALL data?")
  
  if (execute){
  chrome.storage.sync.clear();
    chrome.runtime.sendMessage({sentBy: 'clearAll', data: {
      url
    }});
   }
});


