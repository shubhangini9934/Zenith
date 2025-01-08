// DOM Elements
const prompt = document.querySelector("#prompt");
const submitbtn = document.querySelector("#submit");
const chatContainer = document.querySelector(".chat-container");
const imagebtn = document.querySelector("#image");
const image = document.querySelector("#image img");
const imageinput = document.querySelector("#image input");

// API Endpoint and Key
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCuRxfI6UKtm-vyM2Ujru7XY_I5hLfrkpY";

// User Data
let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

// Function to Generate Response
async function generateResponse(aiChatBox) {
  const text = aiChatBox.querySelector(".ai-chat-area");

  // Request Body
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: user.message || "No message provided",
          },
        ],
      },
    ],
  };

  // Request Options
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(Api_Url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      text.innerHTML = `Error: ${errorData.message || "Unable to generate a response. Please try again."}`;
      return;
    }

    const data = await response.json();
    const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
    text.innerHTML = apiResponse;
  } catch (error) {
    console.error("Network Error:", error);
    text.innerHTML = "Error: Unable to process the request.";
  } finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    image.src = `img.svg`;
    image.classList.remove("choose");
    user.file = {};
  }
}

// Function to Create Chat Box
function createChatBox(html, classes) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Function to Handle Chat Response
function handleChatResponse(userMessage) {
  if (!userMessage.trim() && !user.file.data) {
    alert("Please enter a message or select an image.");
    return;
  }
  user.message = userMessage.trim();

  // User Chat Box
  const userHtml = `
    <img src="images (2).jpeg" alt="" id="userimage" width="8%">
    <div class="user-chat-area">
      ${user.message}
      ${
        user.file.data
          ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`
          : ""
      }
    </div>
  `;
  const userChatBox = createChatBox(userHtml, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  // AI Chat Box
  setTimeout(() => {
    // <img src="images (1).jpeg" alt="" id="ai-image" width="13%"></img>
    const aiHtml = `
    <div class="ai-chat-area">
        <img src="lg.gif" alt="" class="load" width="10%">
      </div>
    `;
    const aiChatBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 200);
}

// Event Listeners
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleChatResponse(prompt.value);
    prompt.value = "";
  }
});
submitbtn.addEventListener("click", () => {
  handleChatResponse(prompt.value);
  prompt.value = "";
});
imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64string = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64string,
    };
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    image.classList.add("choose");
    console.log("File uploaded:", e);
  };
  reader.readAsDataURL(file);
});
imagebtn.addEventListener("click", () => {
  imagebtn.querySelector("input").click();
});
