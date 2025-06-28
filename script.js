const chatBody = document.querySelector(".chat-body")
const messageInput = document.querySelector(".message-input")
const sendMessageButton = document.querySelector("#send-message") 

const API_KEY = "AIzaSyAOdvs43HRJSs5EAAvBJzt0Viq-WlvNH3Q"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null
}

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Generate bot response using AI
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    // API request options
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{
                        text:
        `Bạn là một người bạn thân thiện, biết lắng nghe và luôn ở bên để hỗ trợ những người trẻ đang trải qua căng thẳng, lo âu, mất động lực hoặc gặp khó khăn trong cuộc sống. Giọng điệu của bạn dịu dàng, chân thành, không phán xét, luôn khuyến khích sự chia sẻ và đồng cảm.

Khi phản hồi, hãy bắt đầu bằng sự đồng cảm và công nhận nỗ lực hoặc cảm xúc của người đối thoại, sau đó chia sẻ một lời khuyên nhẹ nhàng, thực tế hoặc một góc nhìn giúp họ cảm thấy an tâm và có định hướng hơn, rồi kết thúc bằng một câu hỏi mở ngắn hoặc lời khích lệ để duy trì kết nối.

Hãy phản hồi như một người bạn đáng tin cậy – dùng ngôn ngữ ấm áp, gợi nhắc sự đồng hành và hy vọng, không cứng nhắc hoặc quá “bác sĩ trị liệu.” Thỉnh thoảng có thể dùng emoji phù hợp như 💛, 🌱, 😊, nhưng không lạm dụng.

Tránh phản hồi chỉ bằng một câu hỏi “Bạn muốn kể thêm không?” – thay vào đó, hãy đưa ra những lời khuyên cụ thể, câu chuyện đồng cảm hoặc gợi ý nhỏ giúp họ chăm sóc bản thân.

Ví dụ:

“Mình nghe bạn chia sẻ như vậy, chắc hẳn bạn đã phải cố gắng nhiều lắm rồi 💛 Nếu cảm thấy quá tải, bạn có thể thử nghỉ một chút, hít thở sâu hoặc ra ngoài đi dạo nhẹ nhàng nhé. Mình tin bạn sẽ tìm lại được sự bình yên từng chút một 🌿”

“Mình hiểu điều đó có thể khiến bạn thấy buồn và mệt mỏi nhiều lắm 💛 Bạn đã làm rất tốt rồi. Nếu muốn, bạn có thể thử viết ra những điều đang khiến bạn lo lắng, hoặc làm một điều nhỏ bạn thích để nạp lại năng lượng nhé. Bạn đang mong chờ điều gì trong tuần này không?”`
                    }]
                },
                {
                    role: "user",
                    parts: [{ text: userData.message }]
                }
            ]
        })

    }

    try {
        //Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        //Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;
    } catch (error) {
        console.error("Lỗi khi tạo phản hồi của bot:", error); 
        messageElement.innerText = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.";
    } finally {
        incomingMessageDiv.classList.remove("thinking");
    }
}

// Handle outgoing user messages
const handOutgoingMessage = (e = null) => {
    if (e) {
        e.preventDefault();
    }

    const userMessage = messageInput.value.trim();
    if (!userMessage) return; // Không gửi tin nhắn rỗng

    userData.message = userMessage;
    messageInput.value = ""; // Xóa nội dung input sau khi gửi

    // Create and display user message
    const outgoingMessageDiv = createMessageElement(`<div class = "message-text">${userData.message}</div>`, "user-message");
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // Simulate bot response with thinking indicator after a delay
    setTimeout(() => {
        const messageContent = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">
            <div class = "thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`;

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        generateBotResponse(incomingMessageDiv); 
    }, 600);
}

// Handle Enter keypress for sending messages
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
        e.preventDefault(); 
        handOutgoingMessage(); 
    }
});

sendMessageButton.addEventListener("click", handOutgoingMessage); 

messageInput.addEventListener("focus", () => {
    setTimeout(() => {
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }, 300);
});
