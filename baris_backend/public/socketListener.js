const socket = io("http://localhost:3000",{
    withCredentials: true,
    reconnection: false
});

// Socket olaylarını burada tanımlayın
const chatMessages = document.getElementById('chat-messages');

socket.on('message_received', async (senderUsername, message, date) => {

    const listItems = document.querySelectorAll("li");
    const matchedItem = Array.from(listItems).find(
        li => li.getAttribute("data-receiver-username") === senderUsername
    );

    if(matchedItem.classList.contains("selected")){
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'received');
        messageDiv.innerHTML = `${message} 
        <div>
            <div class="message-info">
                <div class="history"><small>${date}</small></div>
            </div>
        </div>`;
        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }else{
        // Örneğin, seçilen öğeyi vurgulamak için başka bir stil uygulayın
        matchedItem.style.backgroundColor = "#d1e7dd"; // Açık yeşil ton
    }

    
});

socket.on('send_message', (message) => {
    console.log("Mesaj gönderildi:", message);
});

socket.on('broadcast_message', (message) => {
    console.log("Yeni yayın mesajı:", message);
});

socket.on('typing_status', (message) => {
    console.log("Yazıyor durumu:", message);
});

socket.on('logged_out', (data) => {
    alert(data.message);
    window.location.href = "/login";
});

socket.on("disconnect", () => {
    console.log("Socket bağlantısı kesildi.");
});

export { socket };
