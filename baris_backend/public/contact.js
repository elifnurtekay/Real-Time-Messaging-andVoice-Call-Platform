import { socket } from "./socketListener.js";

const barContainer = document.querySelector('.bar-container');
const chatArea = document.querySelector(".chat-area");
const callInformation = document.querySelector(".call-information");

// İçerik değiştikçe yüksekliği güncelle
function updateBarContainerHeight() {
    // chatsContainer'ın gerçek yüksekliğini alarak barContainer'a ata
    barContainer.style.height = "100%";
}

async function getUserIdFromToken() {
    try {
        const response = await fetch('/api/auth/get-user-id', {
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
        const response = await fetch('/api/chat/load', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
      
        const data = await response.json();
      
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
        li.setAttribute('data-chat-name', chat.chat_name);
        li.setAttribute('data-chat-type', chat.is_group);

        let divClass = null;
        if(chat.is_group === 1){
            li.classList.add('group-item');
            li.setAttribute('data-group-created-at', chat.group_created_at);
            divClass = "group-text";
        }else{
            li.classList.add('contact-item');
            li.setAttribute('data-receiver-username', chat.receiver_username);
            divClass = "contact-text";
        }

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
            <div class="${divClass}" style="overflow: hidden;">
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

    const chatName = li.getAttribute('data-chat-name');
    const receiverUsername = li.getAttribute('data-receiver-username');
    const chatType = li.getAttribute('data-chat-type');
    if (!receiverUsername) return;

    const getMessageDataFrom = {
        chatName: chatName,
        variableData: {
            receiverUsername: receiverUsername
        },
        chatType: chatType
    }

    // Aktif öğeyi vurgulama
    Array.from(contactList.children).forEach(item => {
        item.classList.remove('selected');
        item.style.backgroundColor = '';
        document.querySelector(".text-box").value = '';
    });
    li.classList.add('selected');
    li.style.backgroundColor = '#e0e0e0';

    if(callInformation.style.display === "flex"){
        callInformation.style.display = "none";
        chatArea.style.opacity = 1; // Opacity'yi 1 yap
        chatMessages.style.display = "block";
        chatMessages.scrollTop = chatMessages.scrollHeight; // Mesajlar aşağı kaydırılsın
    }

    // loadMessages fonksiyonunu çağır ve chatId'yi gönder
    loadMessages(getMessageDataFrom, chatName);
});

groupsList.addEventListener('click', event => {
    // Tıklanan eleman bir `.group-item` mi?
    const li = event.target.closest('.group-item');
    if (!li) return; // Eğer değilse hiçbir şey yapma

    const chatName = li.getAttribute('data-chat-name');
    if (!chatName) return;

    const createdAt = li.getAttribute('data-group-created-at');    
    const chatType = li.getAttribute('data-chat-type');
    
    const getMessageDataFrom = {
        chatName: chatName,
        variableData: {
            createdAt: createdAt
        },
        chatType: chatType
    }
    // Aktif öğeyi vurgulama
    Array.from(groupsList.children).forEach(item => {
        item.classList.remove('selected');
        item.style.backgroundColor = '';
        document.querySelector(".text-box").value = '';
    });
    li.classList.add('selected');
    li.style.backgroundColor = '#e0e0e0';

    if(callInformation.style.display === "flex"){
        callInformation.style.display = "none";
        chatArea.style.opacity = 1; // Opacity'yi 1 yap
        chatMessages.style.display = "block";
        chatMessages.scrollTop = chatMessages.scrollHeight; // Mesajlar aşağı kaydırılsın
    }
    
    // loadMessages fonksiyonunu çağır ve chatId'yi gönder
    loadMessages(getMessageDataFrom, chatName);
});

window.addEventListener('DOMContentLoaded', fetchChats);
const contactLastSeen = document.getElementById('last-seen');

async function loadMessages(getMessageDataFrom, chatName){
    try {
        
        // Mesajları API'den çek
        const response = await fetch(`/api/messages/fetch`,{
            method: 'POST', // HTTP metodu
            headers:{
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            },
            body: JSON.stringify(getMessageDataFrom),
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Mesajlar yüklenemedi');
        }

        // API'den dönen mesajları JSON olarak al
        const data = await response.json();
        // Son görülmeyi işle
        if (data.lastLogin) {
            const lastLoginDate = new Date(data.lastLogin);
            const currentDate = new Date();
            const yesterday = new Date(currentDate);
            yesterday.setDate(currentDate.getDate() - 1);

            // Bugün mü, dün mü, yoksa daha eski bir tarih mi kontrolü
            let formattedDate;
            if (lastLoginDate.toDateString() === currentDate.toDateString()) {
                // Bugünse saat ve dakikayı göster
                formattedDate = `bugün ${lastLoginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else if (lastLoginDate.toDateString() === yesterday.toDateString()) {
                // Dünse 'Dün' yaz
                formattedDate = `dün ${lastLoginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else {
                // Daha eski tarihlerde 'gg-aa' formatı
                formattedDate = lastLoginDate.toLocaleDateString('tr-TR') + 
                ' ' + 
                lastLoginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            contactLastSeen.textContent = `son görülme ${formattedDate}`;
        } else {
            contactLastSeen.textContent = '';
        }
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
    let lastDate = null;

    // Mevcut mesajları yükle
    messages.forEach(message => {
        const date = new Date(message.timestamp_); // SQL timestamp'ını bir Date objesine dönüştür
        const messageDate = date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });

        if (messageDate !== lastDate) {
            lastDate = messageDate;

            // Tarih etiketi oluştur
            const dateDivider = document.createElement('div');
            dateDivider.classList.add('date-divider');
            dateDivider.textContent = messageDate;

            // Tarih ayracına stil ekle
            dateDivider.style.textAlign = 'center';
            dateDivider.style.margin = '10px 0';
            dateDivider.style.fontWeight = 'bold';
            dateDivider.style.color = '#555';

            chatMessages.appendChild(dateDivider);
        }

        const hours = date.getHours().toString().padStart(2, '0');  // Saat (iki basamağa tamamla)
        const minutes = date.getMinutes().toString().padStart(2, '0');  // Dakika (iki basamağa tamamla)
        message.timestamp_ = `${hours}.${minutes}`;  // Saat.Dakika formatında

        const msg_Id = uuid.v4();
        const messageDiv = document.createElement('div');
        messageDiv.setAttribute('data-id', msg_Id);

        if(userId === message.sender_id){
            messageDiv.classList.add('message', 'sent')
        }else{
            messageDiv.classList.add('message', 'received');
        }

        // Okunma durumuna göre ikonları belirle
        let readStatus;
        if (message.is_read === "Gönderildi") {
            // Gönderildi (tek tik, gri)
            readStatus = '<i class="fa-regular fa-circle" style="color: red;"></i>';
        } else if (message.is_read === "İletildi") {
            // İletildi (iki tik, yeşil)
            readStatus = '<i class="fa-regular fa-check-circle" style="color: green;"></i>';
        } else if (message.is_read === "Görüldü") {
            // Görüldü (iki tik, mavi)
            readStatus = '<i class="fa-regular fa-check-circle" style="color: blue;"></i>';
        }
        
        if(messageDiv.classList.contains('sent')){
            messageDiv.innerHTML = `${message.message_content} 
            <div>
                <div class="message-info">
                    <div class="history"><small>${message.timestamp_}</small></div>
                    <div class="read">${readStatus}</div>
                </div>
            </div>`;
        }else{
            if(message.sender_username){
                messageDiv.innerHTML = `
                <div class="sender-username" style="color: #C0392B; font-weight: bold; font-size: 0.9rem; margin-bottom: 5px;">${message.sender_username}</div>
                ${message.message_content} 
                <div>
                    <div class="message-info">
                        <div class="history"><small>${message.timestamp_}</small></div>
                    </div>
                </div>`;
            }else{
                messageDiv.innerHTML = `${message.message_content} 
                <div>
                    <div class="message-info">
                        <div class="history"><small>${message.timestamp_}</small></div>
                    </div>
                </div>`;
            }
        }
        
        chatMessages.appendChild(messageDiv);

    });

    chatArea.style.opacity = 1; // Opacity'yi 1 yap
    chatMessages.scrollTop = chatMessages.scrollHeight; // Mesajlar aşağı kaydırılsın

}

const friendsList = document.getElementById('friends-list');
const addgroups_ul = document.getElementById('add-groups-list');
const addgroups_users_ul = document.querySelector(".group-addUsers");

export async function loadFriends(listType) {
    try {
        
        // Mesajları API'den çek
        const response = await fetch(`/api/chat/friends`,{
            method: 'GET', // HTTP metodu
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error('Arkadaşlar yüklenemedi');
        }

        // API'den dönen arkadaşları JSON olarak al
        const data = await response.json();
        // Arkadaşları render et
        if(listType === 'friends'){
            renderFriends(data.friends);
        }else{
            renderAddGroups(data.friends, listType);
        }
    } catch (error) {
        console.error('Arkadaş yükleme hatası:', error);
    }

}

function renderFriends(friends){
    friendsList.innerHTML = '';
    friends.sort((a, b) => new Date(a.started_at) - new Date(b.started_at));
    friends.forEach(friend=>{
        const li = document.createElement('li');
        let fullName = friend.name_ + ' ' + friend.surname;
        li.classList.add('friend-item');
        li.setAttribute('data-friend-name', fullName);

        // IMAGE EKLENECEK
        li.innerHTML = `
            <img src="images/deneme.jpg" alt="${fullName}" class="friend-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
            <div class="friend-text" style="overflow: hidden;">

                <strong class="friend-name">${fullName}</strong>
                <p> ${friend.about}</p>
            </div>

        `;
        friendsList.appendChild(li);
    });
}

function renderAddGroups(friends, listType){
    if(listType === 'new-group'){
        addgroups_ul.innerHTML = '';
    }else{
        addgroups_users_ul.innerHTML = '';
    }
    friends.sort((a, b) => new Date(a.started_at) - new Date(b.started_at));
    friends.forEach(friend => {
        const li = document.createElement('li');
        let fullName = friend.name_ + ' ' + friend.surname;
        li.classList.add('friend-item');
        li.setAttribute('data-friend-name', fullName);
        li.innerHTML = `
            <img src="images/deneme.jpg" alt="${fullName}" class="friend-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
            <div class="friend-text" style="overflow: hidden;">
                <strong class="friend-name">${fullName}</strong>
            </div>
            <input type="checkbox" class="friend-checkbox" style="margin-left: 10px;"/>
        `;
        
        // Hover effect - change background color on hover
        li.addEventListener('mouseenter', () => {
            li.style.backgroundColor = '#e0e0e0'; // Background color when hovered
        });
        
        li.addEventListener('mouseleave', () => {
            li.style.backgroundColor = ''; // Remove background color when hover ends
        });
        
        // Click event to toggle checkbox state (checked/unchecked)
        li.addEventListener('click', (event) => {
            const checkbox = li.querySelector('.friend-checkbox');
            if (event.target.tagName !== 'INPUT') {
                checkbox.checked = !checkbox.checked; // Tersine çevir
            }
        });
        
        if(listType === 'new-group'){
            addgroups_ul.appendChild(li);
        }else{
            addgroups_users_ul.appendChild(li);
        }
    });
}



/* 
friendsList.addEventListener('click', async (event) => {

    Array.from(friendsList.children).forEach(item => {
        item.style.backgroundColor = '';
    });
    li.style.backgroundColor = '#e0e0e0';

}); 
*/

// FRIEND TIKLANINCA GEÇİŞ    
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



const callsList = document.getElementById("calls-list");

export async function loadCalls(){
    try {
        // Aramaları API'den çek
        const response = await fetch(`/api/call/load`,{
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
        li.setAttribute('data-call-name', call.other_user_name);
        li.setAttribute('data-duration', call.duration);

        // IMAGE EKLENECEK
        li.innerHTML = `<img src="images/deneme.jpg" alt="${call.other_user_name}" class="call-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
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

callsList.addEventListener('click', (event) => {

    const li = event.target.closest('.call-item');
    if (!li) return; // Eğer değilse hiçbir şey yapma
    
    const callDuration = document.querySelector(".call-duration span");
    const callStatusType = document.querySelector(".call-status-type");
    const callDate = document.querySelector(".call-date span");
    
    const containerText = document.querySelector(".container-text");
    const callName = li.getAttribute('data-call-name');

    // Verileri ata
    contactNameHeader.textContent = callName;
    contactProfileImage.src = "./images/effrey.webp";
    // LAST SEEN İ SİLDİN

    // Durum sınıflarını temizle
    callStatusType.classList.remove("missed", "incoming", "outgoing", "failed");
    
    const callStatus = li.querySelector('div > p').textContent.trim();
    const duration = li.getAttribute('data-duration');
    const callTimestamp = li.querySelector('.call-timestamp').textContent.trim();

    if (callStatus === "Cevapsız Sesli Arama" || callStatus === "Cevapsız Görüntülü Arama") {
        callDuration.textContent = ""; // Süreyi temizle
        document.querySelector(".call-duration").style.display="none";
        callStatusType.classList.add("missed"); // "missed" sınıfını ekle
    } else if (callStatus === "Gelen Sesli Arama" || callStatus === "Gelen Görüntülü Arama") {
        document.querySelector(".call-duration").style.display="";
        callDuration.textContent = duration || "N/A"; // Süreyi ekle
        callStatusType.classList.add("incoming"); // "incoming" sınıfını ekle
    } else if (callStatus === "Giden Sesli Arama" || callStatus === "Giden Görüntülü Arama") {
        document.querySelector(".call-duration").style.display="";
        callDuration.textContent = duration || "N/A"; // Süreyi ekle
        callStatusType.classList.add("outgoing"); // "outgoing" sınıfını ekle
    } else {
        document.querySelector(".call-duration").style.display="none";
        callDuration.textContent = duration || "N/A"; // Süreyi ekle
        callStatusType.classList.add("failed"); // "outgoing" sınıfını ekle
    }

    callStatusType.textContent = callStatus; // Durum metni ekle
    callDate.textContent = callTimestamp; // Tarih ekle

    // Görünürlük ayarları
    callInformation.style.display = "flex"; // Arama bilgisi görünür
    if (chatMessages) chatMessages.style.display = "none"; // Sohbet mesajları gizli
    if (containerText) containerText.style.display = "none"; // Konteyner metni gizli

    Array.from(callsList.children).forEach(item => {
        item.style.backgroundColor = '';
    });
    li.style.backgroundColor = '#e0e0e0';

});

const textBox = document.getElementById('text-box');
const btnSubmit = document.getElementById('btn-submit');

// Yeni mesaj gönderme
btnSubmit.addEventListener('click', async () => {
    const messageText = textBox.value.trim(); // Textbox içeriğini al
    // Seçili öğe yoksa uyarı ver
    const date = new Date().toLocaleString('tr-TR', { 
        timeZone: 'Europe/Istanbul',
        hour: '2-digit', 
        minute: '2-digit'  
    });

    const selectedElement = document.querySelector('.selected');
    if (!selectedElement) {
        alert('Lütfen mesaj göndermek istediğiniz sohbeti seçin!');
        return;
    }

    const msg_Id = uuid.v4();
    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('data-id', msg_Id);

    messageDiv.classList.add('message', 'sent');
    messageDiv.innerHTML = `${messageText} 
        <div>
            <div class="message-info">
                <div class="history"><small>${date}</small></div>
                <div class="read"><i class="fa-regular fa-circle" style="color: red;"></i></div>
            </div>
        </div>`;
    chatMessages.appendChild(messageDiv);

    // Mesajlar alanını en son mesaja kaydır
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Textbox'ı temizle
    textBox.value = '';

    let messageData;
    if (selectedElement.classList.contains('contact-item')) {
        const receiverUsername = selectedElement.getAttribute('data-receiver-username');
        const chatType = selectedElement.getAttribute('data-chat-type');
        messageData = {
            variableData: {
                receiver_username: receiverUsername
            },
            messageContent: messageText,
            chatType: chatType
        }

    } else if (selectedElement.classList.contains('group-item')) {
        const groupName = selectedElement.getAttribute('data-chat-name');
        const createdAt = selectedElement.getAttribute('data-group-created-at');
        const chatType = selectedElement.getAttribute('data-chat-type');
        messageData = {
            variableData: {
                group_name: groupName,
                created_at: createdAt,
            },
            messageContent: messageText,
            chatType: chatType
        }
    }

    const response = await fetch('api/messages/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
        credentials: 'include',
    });

    const allData = await response.json();
    const allMessageData = allData.allMessageData;

    const sendMessageData = {
        content: allMessageData.message_content,
        date: date,
    }

    if(selectedElement.classList.contains('contact-item')) {
        socket.emit('send_message', 
            sendMessageData,
            allMessageData.sender_id,
            allMessageData.receiver_id, 
            msg_Id, 
            allMessageData.message_id
        );
    } else if (selectedElement.classList.contains('group-item')) {
        const groupName = selectedElement.getAttribute('data-chat-name');
        socket.emit('send_group_message', 
            sendMessageData,
            allMessageData.sender_id, 
            groupName,
            msg_Id,
            allMessageData.message_id 
        );
    }
    

    // CONTACT LIST GÜNCELLE SIRALA

});

// Mesaj kutusundaki "enter" tuşu ile mesaj gönderme işlevi
textBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btnSubmit.click(); // Enter'a basıldığında mesajı gönder
    }
});

window.addEventListener('load', () => {
    // İlk yükleme sırasında varsayılan bir sohbeti yükleyebiliriz
    contactProfileImage.src = "images/no-person.jpg";
    chatArea.style.opacity = 1; // Opacity'yi 1 yap
    chatMessages.scrollTop = chatMessages.scrollHeight; // Mesajlar aşağı kaydırılsın
});

// ARKADAŞLIK İSTEĞİ SERVER KAPANIP AÇILINCA YANLIŞ TARAFA DÜŞÜYOR - REQUEST ATANI DB TUT
// ARKADAŞ EKLEMEK İÇİN USER ARA - ARKADAŞLAR VE BENİ BLOKLAYANLARI GÖREMEM
// GRUP EKLE KOMPLE AYARLANACAK 
// ORTAK GRUPLAR - GRUP ÜYELERİ İÇİNDE SEARCH
// FRIEND E TIKLAMA AYARLA
// ÇEVRİM İÇİ - YAZIYOR AYARLA ÜST PANEL - LAST LOGİN DB DE
// Setting de aradaki şeyler silinecek sadece profil ve hesap kalsın
// BLOCKED USERS IMPLEMENTATION

// WebRTC - UMUT - DEVAM EDİYOR

// BU İŞLER İPTAL
// İLETİLDİ DEN GÖRÜLDÜ YE GEÇİŞ - KULLANICI OFFLINE KEN GÖNDERİLİYOSA SIKINTI
// Grupta birini admin yapma? - HÜSEYİN
// Eklenen kişi önce friendList e sonra contactList e anlık
// YEREL DATE MUHABBETİNE BAK (Date diye aratınca 7/32/70. sonuçlar) - fazla ayrıntı
// message_content TÜRÜNÜ DÜZENLE
// SETTINGS - Profil fotoğrafı ekleme, değiştirme - HÜSEYİN
// Document gönderme ve yerelde indirilmesi + içine text yazma - HÜSEYİN
// - Fotoğraf ve medya DB de depolanırsa performansı nasıl etkiler?
// - Bulutta tutulursa güvenlik açığı olur mu? - Hüseyin olur dedi.
// SEARCHING - ALT ÇİZGİ GİBİ BAZI KARAKTERLERDE SIKINTI VAR - MYSQL2 PAKETİ DESTEKLEMİYOR
// SONRADAN GÖRÜLEN MESAJIN DURUMUNU ÇEVİREMİYORUM

// camera.js - fotoğraf çek gönder
// document.js - belge gönder
// groups.js - ortak gruplar
// links.js - chat link listesi
// media.js - chat medya listesi
// overall.js - üst panel bilgiler
// questions.js - anket oluşturma
// shared_contact.js - kişi paylaşma
// imgDesign.js - fotoğraf/video seçme ve gönderme