document.querySelectorAll(".more").forEach(input => {
    input.addEventListener("click", function (e) {
        e.preventDefault(); // Linkin varsayılan davranışını durdur
        e.stopPropagation(); // Olayın yayılmasını durdur

        const moreDropContent = this.querySelector(".more .dropcontent-2");

        // Stil kontrolünü doğru yap
        if (moreDropContent.style.display === "block") {
            moreDropContent.style.display = "none";
            this.style.backgroundColor = ""
            this.style.color = ""
        } else {
            moreDropContent.style.display = "block";
            this.style.backgroundColor = "#333"
            this.style.color = "#fff"

        }
    });
});

document.querySelector(".photograf").addEventListener("click", function (e) {
    document.getElementById("fileInputImgVideo").click(); // Dosya inputunu tetikle
});

// "photograf" butonuna tıklandığında dosya seçme penceresini aç
document.getElementById("fileInputImgVideo").addEventListener("change", function (e) {
    const files = e.target.files; // Seçilen dosyalar
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log("Seçilen dosya:", file.name, file.type);

            // Seçilen fotoğraf veya videoları burada işleyebilirsin
            if (file.type.startsWith("image/")) {
                document.querySelector(".design-container").style.display = "block";
                document.querySelector(".design-img").style.display = "block";

                // Dosya URL'si oluştur
                const fileURL = URL.createObjectURL(file);
                document.querySelector(".design-img").src = fileURL; // Resmi görüntüle
            } else if (file.type.startsWith("video/")) {
                console.log("Bu bir video dosyası.");
                // Video dosyasıyla ilgili işlemler burada yapılabilir
                document.querySelector(".design-container").style.display = "block";
                document.querySelector(".design-video").style.display = "block";

                // Dosya URL'si oluştur
                const fileURL = URL.createObjectURL(file);
                document.querySelector(".design-video").src = fileURL; // Resmi görüntüle
            }
        }
        e.target.value = ""; // Bu, kullanıcı aynı dosyayı yeniden seçmesine olanak tanır
    }
});

const container = document.querySelector(".container-text");
const designContainer = document.querySelector(".design-container");

document.querySelector(".design-container .tool").addEventListener("click", function (e) {

    document.querySelector(".design-container").style.display = "none";
    document.querySelector(".design-video").style.display = "none";
    document.querySelector(".design-img").style.display = "none";
    document.querySelector(".design-container .first-Col .chat-message").value = '';
    document.querySelector(" .design-container .emoji-container-2").style.display="none";

});

document.querySelector(".design-container .first-Col .submit").addEventListener("click", function (e) {

    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const messageText = document.querySelector(".design-container  .first-Col .chat-message").value.trim(); // Textbox içeriğini al
    const imageElement = document.querySelector(".design-img"); // Görsel element
    const videoElement = document.querySelector(".design-video"); // Video element

    if (selectedContact && (messageText || imageElement.src || videoElement.src)) {
        const newMessage = {
            type: "sent",
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            image: imageElement.src || null, // Görsel varsa ekle
            video: videoElement.src || null  // Video varsa ekle
        };

        // Yeni mesajı chatData'ya ekle
        if (!chatData[selectedContact].messages) {
            chatData[selectedContact].messages = []; // Eğer kontak yoksa yeni bir dizi oluştur
        }
        chatData[selectedContact].messages.push(newMessage); // Yeni mesajı ekle

        // Mesajı chatMessages'a ekle
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', newMessage.type);

        // Görsel veya video durumunu kontrol et
        let mediaContent = '';
        if (imageElement.style.display === "block") {
            mediaContent = newMessage.image ? `<img src="${newMessage.image}" alt="Image" class="message-image">` : '';
        } else if (videoElement.style.display === "block") {
            mediaContent = newMessage.video ? `<video src="${newMessage.video}" controls class="message-video"></video>` : '';
        }

        // Mesaj divini oluştur
        messageDiv.innerHTML = `
         <div class="mediaContent">${mediaContent}</div>
         
         ${newMessage.text ? newMessage.text : ''}
         <div>
             <div class="message-info">
                 <div class="history"><small>${newMessage.time}</small></div>
                 <div class="read"><i class="fa-regular fa-circle-check"></i></div>
             </div>
         </div>
        `;
        chatMessages.appendChild(messageDiv);

        // Mesajlar alanını en son mesaja kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Textbox'ı temizle ve görsel/video alanlarını sıfırla
        document.querySelector(".design-container  .first-Col .chat-message").value = '';
        imageElement.src = ''; // Görseli temizle
        imageElement.style.display = "none"; // Görsel alanını gizle
        videoElement.src = ''; // Video alanını temizle
        videoElement.style.display = "none"; // Video alanını gizle
        document.querySelector(".design-container").style.display = "none";
        document.querySelector(" .design-container .emoji-container-2").style.display="none";
   
    }

});
