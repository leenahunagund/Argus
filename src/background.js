// background.js
import { GoogleGenerativeAI } from "@google/generative-ai"
// Event listener for messages from popup.js
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.action === "scrapedContent") {
      var scrapedContent = request.content;
      console.log("Scraped Content received in Background:", scrapedContent);




      // Assuming you have a valid GoogleGenerativeAI class
      const API_KEY = 'AIzaSyCH2x_HvHnQSV0CNVOkgykrlcTwLzmp1Fc';
      const genAI = new GoogleGenerativeAI(API_KEY);

      try {
        
          // Use the generative AI library or API to prompt and get response
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const prompt = `read the entire e-mail content and analyse the sender's email address along with the content. First tell me if the email is a phishing/scam attempt or not. Then  tell it in stages, keep the analysis text short and simple, but yet it has to convey the points well. : 1. analyse the context of the message and understand its purpose. 2.Analyze the intention behind the message clearly. 3. Go through the entire structure and wording of the message. In the end give a score for each stage out of ten and the final score should be the average of all individual scores. Add a section called links, where all the urls mentioned in email is given in a serialized manner, along with a description for each website and analysis if it is an unsafe website or not.Based on the final score and the result from url analysis. ${scrapedContent}`;
          const result = await model.generateContent(prompt);

          const response = await result.response;
        const text = response.text()
        console.log('AI API Response:', text);
       

          // You can send the response back to popup.js if needed
          chrome.runtime.sendMessage({ action: 'apiResponse', generativeAIResponse: text });
    } catch (error) {
      console.error('Error while using Generative AI:', error);

      // Send the error back to popup.js
      chrome.runtime.sendMessage({ action: 'apiResponse', error: error.message });
    }
  }

  // Make sure to return true to indicate that sendResponse will be called asynchronously
  return true;
});

const API_KEY = 'AIzaSyCH2x_HvHnQSV0CNVOkgykrlcTwLzmp1Fc';
      const genAI = new GoogleGenerativeAI(API_KEY);
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (message) {
    sendResponseToPopup(port);
  }
  );
});


      // Capture the screenshot and send a response back to the popup
      
function sendResponseToPopup(port) {
  chrome.tabs.captureVisibleTab(null, { format: 'jpeg' }, function (dataUrl) {
    // Process the screenshot and send response back to the popup
    const response = { dataUrl };
   // port.postMessage({ action: 'displayResponse', response });
    console.log('this is what it looks like:', dataUrl.slice(dataUrl.indexOf(",") + 1, dataUrl.lastIndexOf('"')));
    // Make API call to Gemini AI
    
    run(dataUrl.replace(/^data:image\/\w+;base64,/, ''));
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'displayResponse', response: text });
    });
  
  });
}

async function createGenerativePartFromBase64(base64Data, mimeType) {
  return {
    inlineData: { data: base64Data, mimeType },
  };
}

async function run(dataUrl) {
  
  // For text-and-images input (multimodal), use the gemini-pro-vision model
      const model1 = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      
      const prompt = "Identify the dark patterns in this screenshot of a website, first generate a brief statement on how many dark patterns are there on the website and how severe they are immediately followed by a new heading keywords, mention all the keywords that are there on the provided image that indicate a darkpattern in a serialized form. Do not add numbers in front of the keywords. second give a detailed report and only give the patterns which blatantly try to scam the end consumer,  Also list the other dark patterns that are not that important under other. Make this into 2 lists, one with the serious dark patterns, the other with the milder ones. Have a threshold on the dark patterns displayed. If it is not significant and there aren't many of them, just say There are no major dark patterns here. Stick to the context of the website, Do not deviate from what's there on the image, check for deviations and hallucinations before you give an output. keep the content short, usually in one or 2 lines, informative and convenient to read while not omitting any important details. apply proper spacing and formatting to the output";

      // Get the base64 input (replace with your actual base64 string)
      const base64Image = createGenerativePartFromBase64(dataUrl);
      const imageMimeType = "image/jpeg"; // Adjust if needed

      const imagePart = await createGenerativePartFromBase64(dataUrl, imageMimeType);

      const result1 =  await model1.generateContent([prompt, imagePart]);
      const response = await result1.response;
      const text = response.text()
      
      console.log('AI API Response:', text);
      chrome.runtime.sendMessage({ action: 'apiResponses', generativeAIResponse: text});

  
      
  
  return text;
     
     


}


