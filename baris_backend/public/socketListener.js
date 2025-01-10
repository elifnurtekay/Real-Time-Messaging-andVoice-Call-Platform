const socket = io("http://localhost:3000",{
    withCredentials: true,
    reconnection: false
});

const offerContainer = document.querySelector(".offer-container")
const callContainer = document.querySelector('.call-container');
const muteButton = document.getElementById('mute-button');
const endCallButton = document.getElementById('endCall-button');
const acceptCallButton = document.querySelector('.accept-call');
const rejectCallButton = document.querySelector('.decline-call');
const callButton = document.getElementById('voice-call-button');

const backgroundAudio = new Audio('./voice/Incoming-call.mp3');
backgroundAudio.loop = true;
backgroundAudio.currentTime = 0;


let control = false;

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

socket.on('new_group_message', async (senderUsername, groupName, message, date, senderId, msg_Id, message_id) => {

    const listItems = document.querySelectorAll("li");
    const matchedItem = Array.from(listItems).find(
        li => li.getAttribute("data-chat-name") === groupName
    );

    if(matchedItem && matchedItem.classList.contains("selected")){
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'received');
        messageDiv.innerHTML = `
        <div class="sender-username" style="color: #C0392B; font-weight: bold; font-size: 0.9rem; margin-bottom: 5px;">${senderUsername}</div>
        ${message} 
        <div>
            <div class="message-info">
                <div class="history"><small>${date}</small></div>
            </div>
        </div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        socket.emit('group_message_received', { success: true, action: 'seen' , group_name: groupName, msg_Id: msg_Id, senderId: senderId, message_id: message_id});
    }else if(matchedItem){
        // Örneğin, seçilen öğeyi vurgulamak için başka bir stil uygulayın
        matchedItem.style.backgroundColor = "#d1e7dd"; // Açık yeşil ton
        socket.emit('group_message_received', { success: true, action: 'forwarded', group_name: groupName, msg_Id: msg_Id, senderId: senderId, message_id: message_id});
    }else{
        console.error("Eşleşen bir öğe bulunamadı!");
        socket.emit('group_message_received', { success: false }); // Hata durumu bildir
        return;
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

socket.on('group_created',() => {
    alert('Grup oluşturuldu.')
})

socket.on('join_new_group_room', (roomSlug) => {
    socket.emit('joinRoom', roomSlug);
})

socket.on('joined_a_group', () => {
    alert('Yeni bir gruba eklendiniz.');
})

socket.on('logged_out', (data) => {
    alert(data.message);
    window.location.href = "/login";
});

socket.on("disconnect", () => {
    console.log("Bağlantınız koptu.");
});

let mediaStream;
let peerConnectionA = new RTCPeerConnection();

callButton.addEventListener('click', async () =>  {

    const selectedContact = document.querySelector(".selected");
    if(!selectedContact){
        alert("Arama başlatmak için bir sohbet seçin.")
    }
    const selectedUsername = selectedContact.getAttribute("data-receiver-username");
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        stream.getTracks().forEach((track) => peerConnectionA.addTrack(track, stream));
        mediaStream = stream;
        let audioElement = document.querySelector('audio');
        audioElement.srcObject = mediaStream;
        peerConnectionA.createOffer()
        .then((offer) => {
            return peerConnectionA.setLocalDescription(offer)
                .then(() => {
                    socket.emit("offer", { sdp: offer, target: selectedUsername });
                });
        })
        .catch((error) => {
            console.error("Offer oluşturma veya local description ayarlama hatası:", error);
        });
      });

})

let peerConnectionB = new RTCPeerConnection();

socket.on("offer", (data) => {
    backgroundAudio.play();
  
    offerContainer.style.display = 'block';
    document.getElementById("caller").innerText = data.sender_username;
    
    acceptCallButton.addEventListener('click', async () => {
        // Mikrofon akışını al ve bağlantıya ekle
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            stream.getTracks().forEach((track) => peerConnectionB.addTrack(track, stream));

            // Gelen offer SDP'yi ayarla (setRemoteDescription)
            peerConnectionB.setRemoteDescription(new RTCSessionDescription(data.sdp))
            .then(() => {
                // Offer'a yanıt oluştur (createAnswer)
                return peerConnectionB.createAnswer();
            })
            .then((answer) => {
                // Yanıtı yerel tanımlama olarak ayarla (setLocalDescription)
                return peerConnectionB.setLocalDescription(answer);
            })
            .then(() => {
                // Yanıtı signaling server'a gönder
                socket.emit("answer", { sdp: peerConnectionB.localDescription, target: data.sender });
            })
            .catch((error) => {
                console.error("Hata oluştu: ", error);
            });
        });
    });

    rejectCallButton.addEventListener('click', () => {
        document.querySelector('.offer-container').style.display = 'none';
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
    
    });
});

socket.on("answer", (data) => {
    const selectedContact = document.querySelector(".selected");
    const selectedUsername = selectedContact.getAttribute("data-receiver-username");
    document.querySelector(".name-offer").innerText = selectedUsername
    peerConnectionA.setRemoteDescription(new RTCSessionDescription(data.sdp))
    .then(() => {
        console.log("Bağlantı tamamlandı!");
        // Burada bağlantı kurulmuş olur, artık ses ve video akışları ile işlem yapılabilir
    })
    .catch((error) => {
        console.error("Yanıt işlenirken hata oluştu: ", error);
    });

    offerContainer.style.display = 'none';
    
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;

    peerConnectionA.ontrack = (event) => {
        const audio = document.createElement("audio");
        audio.srcObject = event.streams[0]; // Gelen ses akışını al
        audio.autoplay = true; // Otomatik oynatılmasını sağla
        document.body.appendChild(audio); // Sayfada ekle
    };
    
    callContainer.style.display = 'block';
    control = true;

    let minutes = 0;
    let seconds = 0;

    muteButton.addEventListener('click', () => {
        muteButton.classList.toggle('mute-active');
        
    })

    endCallButton.addEventListener('click', () => {
        callContainer.style.display = "none";
        
        socket.emit("endCall", { target: selectedUsername }); 
       
        minutes = 0;
        seconds = 0;
        control = false;
    })

    function updateTimer() {
        if (control) {
            seconds++;
        }


        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        // Sayacın görüntüsünü güncelle
        document.getElementById('timer').innerText =
            `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // 1000ms (1 saniye) aralıkla sayacı güncelle
    let interval;
    interval = setInterval(updateTimer, 1000);

});

socket.on('endCall', () =>{
    peerConnectionA.close();
    peerConnectionB.close();
  
    callContainer.style.display = 'none';
    peerConnectionA = new RTCPeerConnection();
    peerConnectionB = new RTCPeerConnection();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        stream.getTracks().forEach((track) => peerConnectionA.addTrack(track, stream));
    })
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        stream.getTracks().forEach((track) => peerConnectionB.addTrack(track, stream));
    })

})

export { socket };
