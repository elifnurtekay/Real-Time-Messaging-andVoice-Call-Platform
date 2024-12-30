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
