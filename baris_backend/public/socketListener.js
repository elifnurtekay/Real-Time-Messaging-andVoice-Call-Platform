const socket = io("http://localhost:3000",{
    withCredentials: true,
    reconnection: false
});

// Socket olaylarını burada tanımlayın
const chatMessages = document.getElementById('chat-messages');

socket.on('message_received', async (senderUsername, message, date, senderId, msg_Id, message_id) => {

    const listItems = document.querySelectorAll("li");
    const matchedItem = Array.from(listItems).find(
        li => li.getAttribute("data-receiver-username") === senderUsername
    );

    if(matchedItem && matchedItem.classList.contains("selected")){
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

        socket.emit('message_received', { success: true, action: 'seen' , msg_Id: msg_Id, senderId: senderId, message_id: message_id});
    }else if(matchedItem){
        // Örneğin, seçilen öğeyi vurgulamak için başka bir stil uygulayın
        matchedItem.style.backgroundColor = "#d1e7dd"; // Açık yeşil ton
        socket.emit('message_received', { success: true, action: 'forwarded', msg_Id: msg_Id, senderId: senderId, message_id: message_id});
    }else{
        console.error("Eşleşen bir öğe bulunamadı!");
        socket.emit('message_received', { success: false }); // Hata durumu bildir
        return;
    }
});

socket.on('message_forwarded', async (msg_Id) =>{
    const messageElement = document.querySelector(`[data-id='${msg_Id}']`);
    if (messageElement) {
        const readElement = messageElement.querySelector('.read i');
        if (readElement) {
            // Kırmızı daireyi yeşil tikle değiştirelim
            readElement.classList.remove('fa-circle'); // Kırmızı daireyi kaldır
            readElement.classList.add('fa-circle-check'); // Yeşil tik ekle
            readElement.style.color = 'green'; // Rengi yeşil yapalım
        }
    } else {
        alert("Mesaj bulunamadı");
    };
});

socket.on('message_seen', async (msg_Id) =>{
    const messageElement = document.querySelector(`[data-id='${msg_Id}']`);
    if (messageElement) {
        const readElement = messageElement.querySelector('.read i');
        if (readElement) {
            // Daireyi mavi tikle değiştirelim
            readElement.classList.remove('fa-circle'); // Daireyi kaldır
            readElement.classList.add('fa-circle-check'); // Tik ekle
            readElement.style.color = 'blue'; // Rengi mavi yapalım
        }
    } else {
        alert("Mesaj bulunamadı");
    };
});

const friendRequestList = document.getElementById('friend-request');

socket.on('new_friend_request', (data) => {
    // ARKADAŞ EKLE BEKLEYEN İSTEKLER LİSTESİ
    const {reqUsername, date} = data;

    const li = document.createElement('li');
    li.classList.add('friend-request-item');

    li.innerHTML = `
          <img src="images/no-person.jpg" alt="${reqUsername}" class="friend-image" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
          <div class="friend-details">
              <strong>${reqUsername}</strong><br>
              <span class="request-date">Request Date: ${date}</span><br>
              <button class="approve-btn" style="margin-right: 5px;">Onayla</button>
              <button class="reject-btn">Reddet</button>
          </div>
      `;

    // Append the list item to the friend request list
    friendRequestList.appendChild(li);

    // Handle Approve button click
    const approveButton = li.querySelector('.approve-btn');
    approveButton.addEventListener('click', () => {
        socket.emit('friend_request_accepted', {reqUsername: reqUsername});
        li.remove(); // Remove the friend request after approval
    });

    // Handle Reject button click
    const rejectButton = li.querySelector('.reject-btn');
    rejectButton.addEventListener('click', () => {
        socket.emit('friend_request_rejected', {reqUsername: reqUsername});
        li.remove(); // Remove the friend request after rejection
    });
});

socket.on('logged_out', (data) => {
    alert(data.message);
    window.location.href = "/login";
});

socket.on("disconnect", () => {
    console.log("Bağlantınız koptu.");
});

export { socket };
