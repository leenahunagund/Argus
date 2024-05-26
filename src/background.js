chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (message) {
    if (message.action === 'captureScreenshot') {
      try {
        const dataUrl = await captureScreenshot();
        const apiResponse = await runLLMModel(dataUrl);
        
        // Send the response back to the popup
        port.postMessage({ action: 'displayResponse', response: apiResponse });
        
        // Send a message to the content script to highlight the API response on the webpage
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightResponse', response: apiResponse });
        });
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  });
});

function captureScreenshot() {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab(null, { format: 'jpeg' }, function (dataUrl) {
      resolve(dataUrl);
    });
  });
}

async function runLLMModel(dataUrl) {
  const llmApiEndpoint = ' http://localhost:7071/api/http_trigger'; // Replace with your LLM API endpoint
  const screenshotBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');

  try {
    const response = await fetch(llmApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ screenshot: screenshotBase64 }),
    });

    if (!response.ok) {
      throw new Error(`LLM API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log('LLM API Response:', result);

    return result;
  } catch (error) {
    console.error('Error during LLM API call:', error.message);
    throw error;
  }
}
