
document.querySelector(".document-btn").addEventListener("click", function (e) {
    document.getElementById("fileInputDocument").click(); // Dosya inputunu tetikle
});


document.getElementById("fileInputDocument").addEventListener("change", function (e) {
    const files = e.target.files; // Seçilen dosyalar
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log("Seçilen dosya:", file.name, file.type);


            // Seçilen fotoğraf veya videoları burada işleyebilirsin

            document.querySelector(".document-container").style.display = "block";
            document.querySelector(".document-img").style.display = "block";

            // Dosya boyutunu MB cinsinden hesapla ve ilk 3 rakamı al
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(3); // MB cinsinden
            const sizeDisplay = sizeInMB.length > 4 ? sizeInMB.substring(0, 4) : sizeInMB; // İlk 4 karakteri al (3 basamak + 1 ondalık)

            // Dosya bilgilerini göster
            document.querySelector(".document-info-Url").innerText = `${file.name}`;
            document.querySelector(".document-info-size").innerText = `${sizeDisplay} MB, ${file.type}`;
            // Dosya URL'si oluştur
            const fileURL = URL.createObjectURL(file);
            // Dosya türünü kontrol et
            if (file.type.startsWith("image/")) {
                // Resim dosyası ise
                document.querySelector(".document-img").src = fileURL;
            } else if (file.type.startsWith("video/")) {
                // Video dosyası ise
                const video = document.createElement("video");
                video.src = fileURL;

                // Video yüklenince ilk kareyi almak için seeked kullanımı
                video.addEventListener("loadeddata", function () {
                    video.currentTime = 2; // İlk kareye geç
                });

                video.addEventListener("seeked", function () {
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext("2d");

                    // Videonun ilk karesini çiz
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    document.querySelector(".document-img").src = canvas.toDataURL("image/png");

                    // Hafızayı serbest bırak
                    URL.revokeObjectURL(fileURL);
                });
            } else {
                // Diğer dosya türleri için ikon göster
                let iconSrc = "./images/default-icon.png"; // Varsayılan dosya simgesi

                // Dosya türüne göre ikon belirleme
                switch (file.type) {
                    case "application/pdf":
                        iconSrc = "./images/pdf-icon.png"; // PDF dosyası ikonu
                        document.querySelector(".document-info-size").innerText = `${sizeDisplay} MB, pdf`;
                        break;
                    case "application/zip":
                        iconSrc = "./images/zip-icon.png"; // ZIP dosyası ikonu
                        document.querySelector(".document-info-size").innerText = `${sizeDisplay} MB, zip`;

                        break;
                    case "application/msword":
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        iconSrc = "./images/word-icon.png"; // Word dosyası ikonu
                        document.querySelector(".document-info-size").innerText = `${sizeDisplay} MB, word`;
                        break;
                    case "application/vnd.ms-excel":
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        iconSrc = "./images/excel-icon.png"; // Excel dosyası ikonu
                        document.querySelector(".document-info-size").innerText = `${sizeDisplay} MB, excel`;
                        break;
                    case "application/vnd.ms-powerpoint":
                    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                        iconSrc = "./images/powerpoint-icon.png"; // PowerPoint dosyası ikonu
                        document.querySelector(".document-info-size").innerText = `${sizeDisplay} MB, pptx`;
                        break;
                    // Diğer dosya türleri için daha fazla durum ekleyebilirsiniz
                    default:
                        iconSrc = "./images/default-icon.png"; // Diğer dosya türleri için varsayılan simge
                        break;
                }

                // Belirlenen ikonu göster
                document.querySelector(".document-img").src = iconSrc;
                document.querySelector(".document-img").style.width = "80px";
                document.querySelector(".document-img").style.height = "80px";
            }

        }

        e.target.value = ""; // Bu, kullanıcı aynı dosyayı yeniden seçmesine olanak tanır
    }
});



document.querySelector(".document-container .first-Col .submit").addEventListener("click", function (e) {




    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const messageText = document.querySelector(".document-container .first-Col .chat-message").value.trim(); // Textbox içeriğini al
    const imageElement = document.querySelector(".document-img"); // Görsel element
    if (selectedContact && (messageText || imageElement.src )) {
        const newMessage = {
            type: "sent",
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            image: imageElement.src || null
        };

        // Yeni mesajı chatData'ya ekle
        if (!chatData[selectedContact].messages) {
            chatData[selectedContact].messages = []; // Eğer kontak yoksa yeni bir dizi oluştur
        }
        chatData[selectedContact].messages.push(newMessage); // Yeni mesajı ekle

        // Mesajı chatMessages'a ekle
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', newMessage.type);


        // Mesaj divini oluştur
        messageDiv.innerHTML = `
         <div class="mediaContent"><img src="${newMessage.image}" alt="Image" class="message-image"></div>
         
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
        document.querySelector(".document-container .first-Col .chat-message").value = '';
        imageElement.src = ''; // Görseli temizle
        imageElement.style.display = "none"; // Görsel alanını gizle
        document.querySelector(".document-container").style.display = "none";
        document.querySelector(" .document-container .emoji-container-2").style.display="none";
        
    }



});



document.querySelector(".document-container .tool").addEventListener("click", function (e) {

    document.querySelector(".document-container").style.display = "none";
    
    document.querySelector(".document-img").style.display = "none";
    document.querySelector(".document-container .first-Col .chat-message").value = '';
    document.querySelector(" .document-container .emoji-container-2").style.display="none";


});