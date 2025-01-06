const Api_Url = "AIzaSyBnmhYzfEQ3uFh9a7H9ct2lFC4kJ4OTV2Y";

let user = {
  message: null,
  file: { mime_type: null, data: null },
};

async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");
  let payload = {
    contents: [
      {
        parts: [
          { text: user.message },
          ...(user.file.data ? [{ inline_data: user.file }] : []),
        ],
      },
    ],
  };

  try {
    let response = await fetch(Api_Url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = await response.json();
    let apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (apiResponse) {
      text.innerHTML = apiResponse.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    } else {
      text.innerHTML = "No response from the server.";
    }
  } catch (error) {
    console.error(error);
    text.innerHTML = "An error occurred while processing your request.";
  } finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    image.src = `img.svg`;
    image.classList.remove("choose");
    user.file = {};
  }
}

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function handleChatResponse() {
  if (!prompt.value.trim()) {
    alert("Please enter a message.");
    return;
  }

  user.message = sanitizeHTML(prompt.value);
  let html = `
    <img src="images (2).jpeg" alt="" id="userimage" width="8%">
    <div class="user-chat-area">
      ${user.message}
      ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
    </div>`;
  prompt.value = "";

  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    let aiHtml = `
      <img src="images (1).jpeg" alt="" id="ai-image" width="13%">
      <div class="ai-chat-area">
        <img src="lg.gif" alt="" class="load" width="13%">
      </div>`;
    let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleChatResponse();
  }
});

submitbtn.addEventListener("click", () => {
  handleChatResponse();
});

imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert("File size exceeds 2MB. Please upload a smaller file.");
    return;
  }

  let reader = new FileReader();
  reader.onload = (e) => {
    let base64string = e.target.result.split(",")[1];
    user.file = { mime_type: file.type, data: base64string };
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    image.classList.add("choose");
  };

  reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
  imagebtn.querySelector("input").click();
});

function sanitizeHTML(str) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}
//"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDxpRL-qoXIowc_rKuxzRKL69IHIoYGpCw"