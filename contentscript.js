const body = document.querySelector('body')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.sentBy === 'background') {
   renderMessages(request.data)
  } else if (request.sentBy === 'popup') {
    const { url, text } = request.data
    document.addEventListener('click', function handler(e) {
      e.currentTarget.removeEventListener(e.type, handler)

      const dataObj = {
        x: e.pageX,
        y: e.pageY,
        width: 200,
        message: text
      }
      // if (chrome.storage.sync.get(url)){
        chrome.storage.sync.get(url, (data)=>{
        
        if (Object.keys(data).length!==0){
          chrome.storage.sync.set({[url]: [...data[url], dataObj]});
        }
        else {
          chrome.storage.sync.set({[url]: [dataObj]})
        };
        renderMessages([dataObj])
        });
    })
  }
});

function renderMessages(messages) {
  body.style.zIndex = -1
  messages.forEach((message) => {
    const span = document.createElement('span')
    span.innerText = message.message
    span.style.cssText = `
      font-size: 18px;
      word-wrap: break-word;
      color: black;
      position: absolute;
      background-color: #f2c600;
      width: ${message.width}px;
      min-height: 200px;
      top: ${message.y}px;
      left: ${message.x}px;
      text-align: center;
      box-shadow: 13px 8px 5px rgba(0,0,0,.8);
      z-index: 10
    `
    body.insertBefore(span, body.firstChild)
  })
}