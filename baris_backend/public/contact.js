const barContainer = document.querySelector('.bar-container');
const chatsContainer = document.querySelector(".chats-container");

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

async function fetchChats() {
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
    chats.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
    chats.forEach(chat => {
        const li = document.createElement('li');
        li.classList.add('contact-item');
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

        contactList.appendChild(li);
        
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

document.addEventListener('DOMContentLoaded', fetchChats);
    
async function loadMessages(chatId, chatName){
    try {
        
        // Mesajları API'den çek
        const response = await fetch(`/api/chat/${chatId}/messages`,{
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

const textBox = document.getElementById('text-box');
const btnSubmit = document.getElementById('btn-submit');

// Yeni mesaj gönderme
btnSubmit.addEventListener('click', () => {
    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const messageText = textBox.value.trim(); // Textbox içeriğini al
    if (selectedContact && messageText) {
        const newMessage = {
            type: "sent",
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Yeni mesajı chatData'ya ekle
        if (!chatData[selectedContact].messages) {
            chatData[selectedContact].messages = []; // Eğer kontak yoksa yeni bir dizi oluştur
        }
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

// Sayfadaki tüm toggle-btn'lere tıklama olayı ekle
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation(); // Olayın yayılmasını durdur
        const dropContent = this.querySelector('.dropcontent');

        // Diğer dropcontent'leri kapat
        document.querySelectorAll('.dropcontent').forEach(content => {
            if (content !== dropContent) {
                content.style.display = 'none'; // Açık olanları kapat
            }
        });

        // Tıklanan butona ait dropcontent'i aç/kapat
        dropContent.style.display = dropContent.style.display === 'block' ? 'none' : 'block';
    });
});

// Sayfanın başka bir yerine tıklandığında dropdown'u kapat
document.addEventListener('click', function (e) {
    if (!e.target.closest('.toggle-btn')) {
        document.querySelectorAll('.dropcontent').forEach(content => {
            content.style.display = 'none'; // Tüm dropcontent'leri kapat
        });
    }
});

// Input alanına tıklanıldığında dropcontent'in kapanmasını engelle
document.querySelectorAll('.dropcontent ').forEach(input => {
    input.addEventListener('click', function (e) {
        e.stopPropagation(); // Olayın yayılmasını durdur
    });
});

// Diğer listelere tıklanıldığında dropcontent'in kapanmasını sağla
document.querySelectorAll('.dropcontent ul li').forEach(item => {
    item.addEventListener('click', function (e) {
        // Burada dropcontent'i kapat
        const dropContent = this.closest('.dropcontent');
        dropContent.style.display = 'none'; // Tıklanan öğenin ait olduğu dropcontent'i kapat
    });
});
