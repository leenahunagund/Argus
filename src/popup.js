document.getElementById("click-me-button").addEventListener('click', async function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      var activeTabId = activeTab.id;

      chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          function: DOMtoString,
      }).then((result) => {
          var user_mail = result[0].result;
          console.log(user_mail);
          console.log("Scraped Content:", user_mail);
          chrome.runtime.sendMessage({ action: "scrapedContent", content: user_mail });
    
      });
  });
});


function changeColor(destinedButton) {
  const button = document.getElementById(destinedButton);
  button.style.backgroundColor = "lightblue";
}

function DOMtoString(selector) {
  var temp_var = document.getElementsByClassName("a3s");
  return temp_var[0].textContent;
}


document.addEventListener('DOMContentLoaded', function () {

  const scrapeButton = document.getElementById('click-me-button');
  const captureButton=document.getElementById('captureBtn');
  const container= document.getElementById('responseContainer');
  const emailButton = document.getElementById('emailButton');
  let newTabId;  // Store the ID of the new tab
  //emailButton.addEventListener('click', function () {
    // Open Gmail in a new tab
    //chrome.tabs.create({ url: 'http://localhost:7071/api/emailScriptAttack' });

    // Trigger the Azure API endpoint (replace 'YOUR_AZURE_API_ENDPOINT' with the actual endpoint)
   
  //});
  

  
 
  // Event listener for login or register button click
  document.getElementById('loginButton').addEventListener('click', function () {
    // Open a new tab with the login or registration website
    chrome.tabs.create({ url: 'http://localhost:3000/#' }, function (tab) {
      newTabId = tab.id;  // Store the ID of the new tab
      
    });
  });

  // Listen for changes in the current tab
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    // Check if the change is in the new tab we opened
    

    if (tabId === newTabId && changeInfo.url) {
      // Once the URL changes, hide the login or register button and show the scrape button
      document.getElementById('loginButton').style.display = 'none';
      scrapeButton.style.display = 'block';
      captureButton.style.display='block';
      
      
      }
      
    
  });

  // Listen for closure of the registration tab
  chrome.tabs.onRemoved.addListener(function (tabId) {
    // Check if the closed tab is the registration tab
    

    if (tabId === newTabId) {
      // Hide the login or register button and show the scrape button when the registration tab is closed
      document.getElementById('loginButton').style.display = 'none';
      scrapeButton.style.display = 'block';
      
      captureButton.style.display='block';
      
      
      
       
      
      }
   
});


 } );

 
  //captureButton.style.display = 'none';
// Listen for messages from background.js
chrome.runtime.onMessage.addListener(function(request) {
  if (request.action === 'apiResponse') {
    // Handle the response from background.js
    if (request.generativeAIResponse) {
      // Update your UI or display the response in the popup
      const responseText = 'Generative AI Response:\n' + request.generativeAIResponse;
      const alertStyle = `
      color: #ffffff;  /* Text color */
      background-color: #007bff;  /* Background color */
      padding: 10px;
      border-radius: 5px;
    `;

    // Display the styled alert
    alert(responseText);
     

      // Highlight keywords on the webpage
      
    const alertContainer = document.querySelector('.alert');
    if (alertContainer) {
      alertContainer.style.cssText = alertStyle;
    }
  } else if (request.error) {
    console.error('Error from background.js:', request.error);
    const errorText = 'Error:\n' + request.error;

    // Styling for the alert
    const alertStyle = `
      color:  #003153;  /* Text color */
      background-color: #FFC0CB;  /* Background color */
      padding: 10px;
      border-radius: 5px;
    `;

    // Display the styled alert
    alert(errorText);
    const alertContainer = document.querySelector('.alert');
    if (alertContainer) {
      alertContainer.style.cssText = alertStyle;
    }
  }
}
});
// Update the UI when the popup is opened
//updateUI();
document.addEventListener('DOMContentLoaded', function () {
  const captureBtn = document.getElementById('captureBtn');});
  //const responseContainer = document.getElementById('responseContainer');

  // Establish a connection with the background script
  const port = chrome.runtime.connect({ name: 'popup' });
  
  captureBtn.addEventListener('click', function () {
  // Check if the button is enabled before sending the message
 
    // Send a message to the background script to capture the screenshot
    port.postMessage({ action: 'captureScreenshot' });
  });
  
  //captureButton.addEventListener('click', function () {
    // Send a message to the backgroound script to capture the screenshot
   // port.postMessage({ action: 'captureScreenshot' });});
  // Listen for messages from the background script
  port.onMessage.addListener(function (message) {
    if (message.action === 'displayResponse') {
      if (request.response) {
        alert('Generative AI Response:\n' + request.response);
      } else if (request.error) {
        alert('Error:\n' + request.error);
      }
        //Display the API response in the popup
       //responseContainer.innerText = JSON.stringify(message.response, null, 2);
       
      //console.log('Received API response:', message.response); // Inspect the response content
      // Call a function to create a popup window with the response
    }
  });
   // Trigger capturing the screenshot when the button is clicked
  //captureBtn.addEventListener('click', function () {
    // Send a message to the background script to capture the screenshot
    //port.postMessage({ action: 'captureScreenshot' });
  //});
//});
document.addEventListener('DOMContentLoaded', function () {
chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === 'apiResponses') {
    if (request.generativeAIResponse) {
      const responseText = 'Generative AI Response:\n' + request.generativeAIResponse;
      
      const alertStyle = `
        color: #ffffff;  /* Text color */
        background-color: #007bff;  /* Background color */
        padding: 10px;
        border-radius: 5px;
      `;

      alert(responseText);
      
      
      const alertContainer = document.querySelector('.alert');
      if (alertContainer) {
        alertContainer.style.cssText = alertStyle;
      }
      const extractedKeywords = extractKeywords(request.generativeAIResponse);
console.log('Extracted Keywords:', extractedKeywords);


        
      
    } else if (request.error) {
      // Handle error as needed
      console.error('Error from background.js:', request.error);
    }
  }
  function extractKeywords(text) {
    // Split the text by new line characters
    const lines = text.split(/\r?\n/); // Handles both LF (\n) and CRLF (\r\n)
  
    // Find the line starting with "**Keywords**" (case-insensitive)
    const keywordsLineIndex = lines.findIndex(line => line.toLowerCase().startsWith("**keywords**"));
  
    // Extract keywords starting from the next line
    const keywords = keywordsLineIndex !== -1 ? lines.slice(keywordsLineIndex + 1) : [];
  
    return keywords.map(line => line.trim());
     // Remove leading/trailing spaces from each keyword
  }
  
  
})});





