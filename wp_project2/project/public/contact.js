const barContainer = document.querySelector('.bar-container');

// İçerik değiştikçe yüksekliği güncelle
function updateBarContainerHeight() {
    // chatsContainer'ın gerçek yüksekliğini alarak barContainer'a ata
    barContainer.style.height = "100%";
}

async function getUserIdFromToken() {
    try {
        const response = await fetch('/auth/get-user-id', {
            method: 'GET',
            credentials: 'include', // Eğer cookie kullanıyorsanız bu önemli
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            console.error('Kullanıcı bilgisi alınamadı.');
            return null;
        }

        const userData = await response.json();
        return userData.userId; // Backend'den dönen user_id
    } catch (error) {
        console.error('API çağrısı hatası:', error);
        return null;
    }
}
   
const contactList = document.getElementById('contact-list');
const groupsList = document.getElementById('groups-list');

export async function fetchChats() {
    try {
        const response = await fetch('/chats/my-chats', {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json'
        },
        credentials: 'include'
        });
      
        const data = await response.json();
        console.log(data.chats)
        if (response.ok) {
            renderChats(data.chats);
            
        } else {
            console.error('Chat verisi alınamadı:', data.message);
            alert('Chat verisi alınırken bir hata oluştu!');
        }
    } catch (error) {
        console.error('Sunucu bağlantı hatası:', error);
        alert('Sunucuyla bağlantı kurulamadı.');
    }
}

function renderChats(chats) {
    contactList.innerHTML = '';
    groupsList.innerHTML = '';
    chats.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
    chats.forEach(chat => {
        const li = document.createElement('li');
        if(chat.is_group === 1){
            li.classList.add('group-item');
        }else{
            li.classList.add('contact-item');
        }
        li.setAttribute('data-chat-id', chat.chat_id);
        li.setAttribute('data-chat-name', chat.chat_name);

        // Tarihi formatlamak için yardımcı fonksiyon
        const messageDate = new Date(chat.last_message_time);
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);

        // Bugün mü, dün mü, yoksa daha eski bir tarih mi kontrolü
        let formattedDate;
        if (messageDate.toDateString() === currentDate.toDateString()) {
            // Bugünse saat ve dakikayı göster
            formattedDate = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            // Dünse 'Dün' yaz
            formattedDate = 'Dün';
        } else {
            // Daha eski tarihlerde 'gg-aa' formatı
            formattedDate = messageDate.toLocaleDateString('tr-TR');
        }

        // Okunma durumuna göre ikonları belirle
        let readStatus;
        if (chat.seen === "Gönderildi") {
            // Gönderildi (tek tik, gri)
            readStatus = '<i class="fa-regular fa-circle" style="color: red;"></i>';
        } else if (chat.seen === "İletildi") {
            // İletildi (iki tik, yeşil)
            readStatus = '<i class="fa-regular fa-check-circle" style="color: green;"></i>';
        } else if (chat.seen === "Görüldü") {
            // Görüldü (iki tik, mavi)
            readStatus = '<i class="fa-regular fa-check-circle" style="color: blue;"></i>';
        }

        // IMAGE EKLENECEK
        li.innerHTML = `
            <img src="images/deneme.jpg" alt="${chat.chat_name}" class="contact-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
            <div class="contact-text" style="overflow: hidden;">
                <strong>${chat.chat_name}</strong>
                <p><i class="fa-regular fa-message"></i> ${chat.last_message}</p>
                <small>${formattedDate}</small>
            <p>${readStatus}</p>
        </div>
        `;

        if(chat.is_group === 1){
            groupsList.appendChild(li);
        }else{
            contactList.appendChild(li);
        }
        
    });
    updateBarContainerHeight();
}

contactList.addEventListener('click', event => {
    // Tıklanan eleman bir `.contact-item` mi?
    const li = event.target.closest('.contact-item');
    if (!li) return; // Eğer değilse hiçbir şey yapma

    // Chat ID'yi al
    const chatId = li.getAttribute('data-chat-id');
    const chatName = li.getAttribute('data-chat-name');
    if (!chatId) return;

    // Aktif öğeyi vurgulama
    Array.from(contactList.children).forEach(item => {
        item.style.backgroundColor = '';
        document.querySelector(".text-box").value = '';
    });
    li.style.backgroundColor = '#e0e0e0';
    
    // loadMessages fonksiyonunu çağır ve chatId'yi gönder
    loadMessages(chatId, chatName);
});

groupsList.addEventListener('click', event => {
    // Tıklanan eleman bir `.group-item` mi?
    const li = event.target.closest('.group-item');
    if (!li) return; // Eğer değilse hiçbir şey yapma

    // Chat ID'yi al
    const chatId = li.getAttribute('data-chat-id');
    const chatName = li.getAttribute('data-chat-name');
    if (!chatId) return;

    // Aktif öğeyi vurgulama
    Array.from(groupsList.children).forEach(item => {
        item.style.backgroundColor = '';
        document.querySelector(".text-box").value = '';
    });
    li.style.backgroundColor = '#e0e0e0';
    
    // loadMessages fonksiyonunu çağır ve chatId'yi gönder
    loadMessages(chatId, chatName);
});

window.addEventListener('DOMContentLoaded', fetchChats);
    
async function loadMessages(chatId, chatName){
    try {
        
        // Mesajları API'den çek
        const response = await fetch(`/chat/${chatId}/messages`,{
            method: 'GET', // HTTP metodu
            headers:{
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error('Mesajlar yüklenemedi');
        }

        // API'den dönen mesajları JSON olarak al
        const data = await response.json();
        // Mesajları render et
        renderMessages(data.messages, chatName);
    } catch (error) {
        console.error('Mesaj yükleme hatası:', error);
    }
}

const chatMessages = document.getElementById('chat-messages');
const contactNameHeader = document.getElementById('contact-name');
const contactProfileImage = document.getElementById('contact-profile-image'); // Profil resmi için element

// Seçilen kontak sohbetini yükleme fonksiyonu
async function renderMessages(messages, chat_name) {
    while (chatMessages.firstChild) {
        chatMessages.firstChild.remove(); 
    }
    const userId = await getUserIdFromToken();
    
    contactNameHeader.textContent = chat_name;
    chatMessages.innerHTML = ''; // Önceki mesajları temizle

    // PROFİL RESMİ DÜZENLENECEK
    contactProfileImage.src = 'images/deneme.jpg'
    contactProfileImage.style.display = 'flex';
    messages.sort((a,b) => new Date(a.timestamp_) - new Date(b.timestamp_));
    // Mevcut mesajları yükle
    messages.forEach(message => {

        const date = new Date(message.timestamp_); // SQL timestamp'ını bir Date objesine dönüştür
        const hours = date.getHours().toString().padStart(2, '0');  // Saat (iki basamağa tamamla)
        const minutes = date.getMinutes().toString().padStart(2, '0');  // Dakika (iki basamağa tamamla)
        message.timestamp_ = `${hours}.${minutes}`;  // Saat.Dakika formatında

        const messageDiv = document.createElement('div');
        if(userId === message.sender_id){
            messageDiv.classList.add('message', 'sent')
        }else{
            messageDiv.classList.add('message', 'received');
        }
        
        messageDiv.innerHTML = `${message.message_content} 
            <div>
                <div class="message-info">
                    <div class="history"><small>${message.timestamp_}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>`;
        chatMessages.appendChild(messageDiv);

    });

    const chatArea = document.querySelector(".chat-area");
    chatArea.style.opacity = 1; // Opacity'yi 1 yap
    chatMessages.scrollTop = chatMessages.scrollHeight; // Mesajlar aşağı kaydırılsın

}

const friendsList = document.getElementById('friends-list');

export async function loadFriends(userId) {
    try {
        
        // Mesajları API'den çek
        const response = await fetch(`/friends/${userId}`,{
            method: 'GET', // HTTP metodu
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            }
        });
        console.log('Arkadaşlar yükleniyor:', `/friends/${userId}`);
        if (!response.ok) {
            throw new Error(`Arkadaşlar yüklenemedi: ${response.status} - ${errorText}`);
        }

        // API'den dönen arkadaşları JSON olarak al
        const data = await response.json();
        // Arkadaşları render et
        renderFriends(data.friends);
    } catch (error) {
        console.error('Arkadaş yükleme hatası:', error);
    }

}

function renderFriends(friends){
    friendsList.innerHTML = '';
    friends.sort((a, b) => new Date(a.started_at) - new Date(b.started_at));
    friends.forEach(friend=>{
        const li = document.createElement('li');
        li.classList.add('friend-item');

        // IMAGE EKLENECEK
        li.innerHTML = `
            <img src="images/deneme.jpg" alt="${friend.name_} ${friend.surname}" class="friend-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
            <div class="friend-text" style="overflow: hidden;">

                <strong class="friend-name">${friend.name_} ${friend.surname}</strong>
                <p> ${friend.about}</p>
            </div>

        `;
        friendsList.appendChild(li);
    });
}

const callsList = document.getElementById("calls-list");

export async function loadCalls(){
    try {
        // Aramaları API'den çek
        const response = await fetch(`/call/load`,{
            method: 'GET', // HTTP metodu
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error('Aramalar yüklenemedi');
        }
        // API'den dönen aramaları JSON olarak al
        const data = await response.json();
        // Aramaları render et
        renderCalls(data.calls);

    } catch(error){
        console.error('Arama yükleme hatası:', error);
    }
    
}

async function renderCalls(calls){
    callsList.innerHTML = '';
    calls.sort((a, b) => new Date(a.started_at) - new Date(b.started_at));
    const currentUser = await getUserIdFromToken(); 
    calls.forEach(call =>{
        const isCaller = call.caller_id === currentUser;
        // Zaman formatlama
        const startedAt = new Date(call.started_at);
        const now = new Date();
        const isToday = startedAt.toDateString() === now.toDateString();
        const isYesterday = startedAt.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();

        let timestamp = "";
        if (isToday) {
            timestamp = startedAt.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit"
            });
        } else if (isYesterday) {
            timestamp = `Dün ${startedAt.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit"
            })}`;
        } else {
            timestamp = startedAt.toLocaleString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }

        const li = document.createElement('li');
        li.classList.add('call-item');

        // IMAGE EKLENECEK
        li.innerHTML = `
            <img src="images/deneme.jpg" alt="${call.other_user_name}" class="call-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
            <div class="call-text" style="overflow: hidden;">

                <strong class="call-name">${call.other_user_name}</strong>

                <p style="color: ${call.was_successful && !call.is_missed ? 'green' : 'red'};">
                    <i class="${call.was_successful && !call.is_missed 
                    ? (isCaller ? 'fa-solid fa-phone' : 'fa-solid fa-phone-flip') 
                    : 'fa-solid fa-phone-slash'}">
                    </i>
                    ${call.was_successful && !call.is_missed 
                        ? (isCaller ? `Giden ${call.call_type} Arama` : `Gelen ${call.call_type} Arama`) 
                        : (call.is_missed 
                            ? `Cevapsız ${call.call_type} Arama` 
                            : `Başarısız ${call.call_type} Arama`)}
                </p>

                <small class="call-timestamp">
                    ${timestamp}
                </small>
            </div>

        `;
        callsList.appendChild(li);
    })
}

/* 
callsList.addEventListener('click', () => {
    adjustWidth();
    Array.from(callsList.children).forEach(item => {
        item.style.backgroundColor = '';
    });
    li.style.backgroundColor = '#e0e0e0';

});
    

friendList.addEventListener('click', () => {
    adjustWidth();
    Array.from(friendsList.children).forEach(item => {
        item.style.backgroundColor = '';
    });
    li.style.backgroundColor = '#e0e0e0';
    loadChat(friend);

});
*/

/* 
let selectedFriend = friends.find(c => c.name === contact.name);
    
if (selectedFriend) {  // `find` kullanarak öğe bulunmama durumu kontrol edilir

    const contactLi = document.querySelectorAll(".contact-item");
    contactLi.forEach(item => {
        item.style.backgroundColor = '';  // Tüm friend-item öğelerinin arka plan rengini sıfırlar
    });

    if(!contacts[selectedFriend.name]){
        contacts[selectedFriend.name] = {  // `contacts` nesnesi üzerinden işlem yapılıyor
            name: selectedFriend.name,
            image: selectedFriend.image,
            type: "contact"  // Virgül yerine noktalı virgül kullanılmaz
        };
    
        const li = document.createElement('li');
        li.classList.add('contact-item');
        li.setAttribute('data-name', selectedFriend.name);  //
        li.innerHTML = `
            <img src="${selectedFriend.image}" alt="${selectedFriend.name}" class="contact-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
            <div class="contact-text" style="overflow: hidden;">
                <strong>${selectedFriend.name}</strong>
                <p><i class="fa-regular fa-circle-check"></i> ${selectedFriend.lastMessage}</p>
            </div>
        `;
    
        li.addEventListener('click', () => {
            adjustWidth();
            contactList.querySelectorAll('li').forEach(item => {  // Array.from kullanmadan doğrudan .forEach
                item.style.backgroundColor = '';
            });
            li.style.backgroundColor = '#e0e0e0';
            loadChat(selectedFriend);
        });
    
        contactList.appendChild(li);
    
        updateBarContainerHeight();
        const foundLi = contactList.querySelector(`li[data-name="${selectedFriend.name}"]`);
        foundLi.style.backgroundColor = '#e0e0e0';
    }else{
        const foundLi = contactList.querySelector(`li[data-name="${selectedFriend.name}"]`);
        foundLi.style.backgroundColor = '#e0e0e0';
    }
    // friend-item'lar için arka plan rengini sıfırlama
    const friendLi = document.querySelectorAll(".friend-item");
    friendLi.forEach(item => {
        item.style.backgroundColor = '';  // Tüm friend-item öğelerinin arka plan rengini sıfırlar
    });
        
    console.log(`Contact'a yeni bir kişi eklendi: ${selectedFriend.name}`);
    
    friendsContainer.style.display = "none";
    contactList.style.display = "block";
    headerText.textContent = "Sohbetler";
    searchBar.placeholder = "Sohbetler içinde arama yapın.";
} */

const textBox = document.getElementById('text-box');
const btnSubmit = document.getElementById('btn-submit');

// Yeni mesaj gönderme
btnSubmit.addEventListener('click', () => {
    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const messageText = textBox.value.trim(); // Textbox içeriğini al
    if (selectedContact && messageText) {
        // Kontak mevcut mu kontrol et
        if (!chatData[selectedContact]) {
            chatData[selectedContact] = {
                profileImage: "https://via.placeholder.com/50", // Varsayılan profil resmi
                messages: [] // Yeni mesajlar dizisi oluştur
            };
        }

        const newMessage = {
            type: "sent",
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Yeni mesajı chatData'ya ekle
        chatData[selectedContact].messages.push(newMessage); // Yeni mesajı ekle

        // Mesajı chatMessages'a ekle
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', newMessage.type);
        messageDiv.innerHTML = `${newMessage.text} 
            <div>
                <div class="message-info">
                    <div class="history"><small>${newMessage.time}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>`;
        chatMessages.appendChild(messageDiv);

        // Mesajlar alanını en son mesaja kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Textbox'ı temizle
        textBox.value = '';
    }
});

// Mesaj kutusundaki "enter" tuşu ile mesaj gönderme işlevi
textBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btnSubmit.click(); // Enter'a basıldığında mesajı gönder
    }
});

/* // Sayfa yüklendiğinde bazı başlangıç ayarlarını yap
window.addEventListener('load', () => {
    // İlk yükleme sırasında varsayılan bir sohbeti yükleyebiliriz

    let selectedContact = contacts.find(c => c.name === "Contact 1");
    loadChat(selectedContact);

}); */
