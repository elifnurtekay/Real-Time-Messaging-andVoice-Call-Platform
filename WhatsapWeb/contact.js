const contacts = [
    { name: "Contact 1", image: "https://via.placeholder.com/50", lastMessage: "Hello!" },
    { name: "Contact 2", image: "https://via.placeholder.com/50", lastMessage: "How are you?" },
    { name: "Contact 3", image: "https://via.placeholder.com/50", lastMessage: "Let's meet." },
    { name: "Contact 1", image: "https://via.placeholder.com/50", lastMessage: "Hello!" },
    { name: "Contact 2", image: "https://via.placeholder.com/50", lastMessage: "How are you?" },
    { name: "Contact 3", image: "https://via.placeholder.com/50", lastMessage: "Let's meet." },
    { name: "Contact 1", image: "https://via.placeholder.com/50", lastMessage: "Hello!" },
    { name: "Contact 2", image: "https://via.placeholder.com/50", lastMessage: "How are you?" },
    { name: "Contact 3", image: "https://via.placeholder.com/50", lastMessage: "Let's meet." },
    { name: "Contact 1", image: "https://via.placeholder.com/50", lastMessage: "Hello!" },
    { name: "Contact 2", image: "https://via.placeholder.com/50", lastMessage: "How are you?" },
    { name: "Contact 3", image: "https://via.placeholder.com/50", lastMessage: "Let's meet." }

];


const chatData = {
    "Contact 1": {
        profileImage: "https://via.placeholder.com/50", // Profil resmi URL'si
        messages: [
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" },
            { type: "received", text: "Hello!", time: "12:14" },
            { type: "sent", text: "Hi there!", time: "12:15" }


        ]
    },
    "Contact 2": {
        profileImage: "https://via.placeholder.com/50", // Profil resmi URL'si
        messages: [
            { type: "received", text: "Hey, what's up?", time: "13:10" },
            { type: "sent", text: "Not much, you?", time: "13:11" }
        ]
    },

    "Contact 3": {
        profileImage: "https://via.placeholder.com/50", // Profil resmi URL'si
        messages: [
            { type: "received", text: "Hey, what's up?", time: "13:10" },
            { type: "sent", text: "Not much, you?", time: "13:11" }
        ]
    }
};



const barContainer = document.querySelector('.bar-container');
const chatsContainer = document.querySelector(".chats-container");

// İçerik değiştikçe yüksekliği güncelle
function updateBarContainerHeight() {


    // chatsContainer'ın gerçek yüksekliğini alarak barContainer'a ata
    barContainer.style.height = "100%";
}


   
    const contactList = document.getElementById('contact-list');

    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.classList.add('contact-item');
        li.innerHTML = `
            <img src="${contact.image}" alt="${contact.name}" class="contact-image" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px; margin-right: 10px; float: left;">
            <div class="contact-text" style="overflow: hidden;">
                <strong>${contact.name}</strong>
                <p><i class="fa-regular fa-circle-check"></i> ${contact.lastMessage}</p>
              
            </div>
        `;


        li.addEventListener('click', () => {
            adjustWidth();
            Array.from(contactList.children).forEach(item => {
                item.style.backgroundColor = '';
                document.querySelector(".text-box").value = '';
            });
            li.style.backgroundColor = '#e0e0e0';
            loadChat(contact.name);
        });
        contactList.appendChild(li);

        updateBarContainerHeight();
    });

 
    const chatMessages = document.getElementById('chat-messages');
    const contactNameHeader = document.getElementById('contact-name');
    const textBox = document.getElementById('text-box');
    const btnSubmit = document.getElementById('btn-submit');
    const contactProfileImage = document.getElementById('contact-profile-image'); // Profil resmi için element

    // Seçilen kontak sohbetini yükleme fonksiyonu
    function loadChat(contact) {
        contactNameHeader.textContent = contact;
        chatMessages.innerHTML = ''; // Önceki mesajları temizle

        // Profil resmini güncelle
        if (chatData[contact].profileImage) {
            contactProfileImage.src = chatData[contact].profileImage;
            contactProfileImage.style.display = 'flex';
        } else {
            contactProfileImage.style.display = 'none';
        }

        // Mevcut mesajları yükle
        chatData[contact]?.messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', message.type);
            messageDiv.innerHTML = `${message.text} 
                <div>
                    <div class="message-info">
                        <div class="history"><small>${message.time}</small></div>
                        <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                    </div>
                </div>`;
            chatMessages.appendChild(messageDiv);

        });

        const chatArea = document.querySelector(".chat-area");
        chatArea.style.opacity = 1; // Opacity'yi 1 yap
        chatMessages.scrollTop = chatMessages.scrollHeight; // Mesajlar aşağı kaydırılsın


    }



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






















