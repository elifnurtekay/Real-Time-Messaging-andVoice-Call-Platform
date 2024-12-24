const video = document.getElementById('cameraStream');
const canvas = document.getElementById('canvas');
const captureFotoBtn = document.getElementById('captureFoto');
const captureVideoBtn = document.getElementById('captureVideo');
const capturedPhoto = document.getElementById('capturedPhoto');
const capturedVideo = document.getElementById('capturedVideo');
const timerDisplay = document.getElementById('timerDisplay'); // Sayaç göstermek için
let mediaRecorder2;
let recordedChunks2 = [];
let timerInterval2; // Sayaç için interval ID
let seconds2 = 0; // Sayaç başlangıç değeri

document.querySelector(".dropcontent-2 .camera").addEventListener("click",(e)=>{

// Kameraya erişim izni al ve videoyu başlat
document.querySelector(".camera-container").style.display="block";
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        
        mediaRecorder2 = new MediaRecorder(stream);
        
        mediaRecorder2.ondataavailable = event => {
            if (event.data.size > 0) recordedChunks2.push(event.data);
        };

        mediaRecorder2.onstop = () => {
            const blob = new Blob(recordedChunks2, { type: 'video/webm' });
            recordedChunks2 = [];
            const videoURL = URL.createObjectURL(blob);
            capturedVideo.src = videoURL;
        };
    })
    .catch(err => {
        console.error('Kamera erişim hatası:', err);
    });


});

// Fotoğraf çekme işlemi
captureFotoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    video.style.display = "none";
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/png');
    capturedPhoto.src = imageDataUrl;
    capturedPhoto.style.display = 'block';

    document.querySelector(".btn .first").style.display = "none";
    document.querySelector(".btn .foto-end").style.display = "flex";
});

// Fotoğrafa geri dönme işlemi
document.querySelector(".comeback-foto").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector(".btn .first").style.display = "flex";
    document.querySelector(".btn .foto-end").style.display = "none";
    capturedPhoto.style.display = 'none';
    video.style.display = "block";
});

// Sayaç başlatma fonksiyonu
function startTimer() {
    seconds2 = 0;
    timerDisplay.style.display = 'block';
    timerInterval2 = setInterval(() => {
        seconds2++;
        const minute = Math.floor(seconds2 / 60); // Dakika kıs

        timerDisplay.textContent = ` ${minute < 10 ? '0' : ''}${minute}:${seconds2 < 10 ? '0': '' }${seconds2} `;
    }, 1000);
}

// Sayaç durdurma fonksiyonu
function stopTimer() {
    clearInterval(timerInterval2);
    timerDisplay.style.display = 'none';
}

// Video kaydını başlatma
captureVideoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector(".btn .first").style.display = "none";
    document.querySelector(".btn .video-first").style.display = "flex";
    timerDisplay.textContent="00:00";

    if (mediaRecorder2 && mediaRecorder2.state === "inactive") {
        mediaRecorder2.start();
        startTimer(); // Sayaç başlatılıyor
        console.log("Video kaydı başladı");
    }
});

// Video kaydını durdurma
document.querySelector(".btn .video-stop").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector(".btn .video-first").style.display = "none";
    document.querySelector(".btn .video-end").style.display = "flex";
    video.style.display = "none";

    if (mediaRecorder2 && mediaRecorder2.state === "recording") {
        mediaRecorder2.stop();
        stopTimer(); // Sayaç durduruluyor
        console.log("Video kaydı durduruldu");
    }
    capturedVideo.style.display = 'block';
});

// Videoya geri dönme işlemi
document.querySelector(".btn .comeback-video").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector(".btn .first").style.display = "flex";
    document.querySelector(".btn .video-end").style.display = "none";
    capturedVideo.style.display = 'none';
    video.style.display = "block";
});



document.querySelector("#video-send").addEventListener("click",(e)=>{
    e.preventDefault();
    e.stopPropagation();

    console.log("video gönderme başlatıldı.");

    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const videoElement = capturedVideo; // Görsel element

    if (selectedContact && videoElement.src) {
        const newMessage = {
            type: "sent",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            video: videoElement.src || null
        };  

        // Yeni mesajı chatData'ya ekle
        if (!chatData[selectedContact]) {
            chatData[selectedContact] = { messages: [] }; // Kontak yoksa yeni bir dizi oluştur
        }
        chatData[selectedContact].messages.push(newMessage);

        // Mesajı chatMessages'a ekle
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', newMessage.type);

        // Mesaj divini oluştur
        messageDiv.innerHTML = `
            <div class="mediaContent">
                <video src="${newMessage.video}" controls class="message-video"></video>
            </div>
            <div>
                <div class="message-info">
                    <div class="history"><small>${newMessage.time}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>
        `;
        
        // chatMessages elemana ekle
        chatMessages.appendChild(messageDiv);

        // Mesajlar alanını en son mesaja kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;

        document.querySelector(".camera-container").style.display="none";
        capturedVideo.style.display="none";
        capturedVideo.src="";
        document.querySelector(".btn .video-end").style.display="none";
        document.querySelector(".btn .first").style.display="flex";
        video.style.display = "block";
        console.log("video gönderildi.");
        stopCamera();
    }

});


document.querySelector("#foto-send").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Fotoğraf gönderme başlatıldı.");

    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const imageElement = capturedPhoto; // Görsel element

    if (selectedContact && imageElement.src) {
        const newMessage = {
            type: "sent",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            image: imageElement.src || null // Görsel varsa ekle
        };

        // Yeni mesajı chatData'ya ekle
        if (!chatData[selectedContact]) {
            chatData[selectedContact] = { messages: [] }; // Kontak yoksa yeni bir dizi oluştur
        }
        chatData[selectedContact].messages.push(newMessage);

        // Mesajı chatMessages'a ekle
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', newMessage.type);

        // Mesaj divini oluştur
        messageDiv.innerHTML = `
            <div class="mediaContent">
                <img src="${newMessage.image}" alt="Image" class="message-image">
            </div>
            <div>
                <div class="message-info">
                    <div class="history"><small>${newMessage.time}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>
        `;
        
        // chatMessages elemana ekle
        chatMessages.appendChild(messageDiv);

        // Mesajlar alanını en son mesaja kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;
        stopCamera();
        document.querySelector(".camera-container").style.display="none";
        capturedPhoto.style.display="none";
        capturedPhoto.src="";
        document.querySelector(".btn .foto-end").style.display="none";
        document.querySelector(".btn .first").style.display="flex";
        video.style.display = "block";

        console.log("Fotoğraf gönderildi.");
    }
});

function stopCamera() {
    const stream = video.srcObject; // Kameradan gelen akışı al
    if (stream) {
        const tracks = stream.getTracks(); // Akıştaki tüm izleri al
        tracks.forEach(track => track.stop()); // Her bir izi durdur
        video.srcObject = null; // Video nesnesini sıfırla
    }
}

document.querySelector(".camera-container .exit").addEventListener("click",(e)=>{

    e.preventDefault();
    e.stopPropagation();

    document.querySelector(".camera-container").style.display="none";
    capturedPhoto.style.display="none";
    capturedPhoto.src="";
    capturedVideo.style.display="none";
    capturedVideo.src="";
    document.querySelector(".btn .video-end").style.display="none";
    document.querySelector(".btn .foto-end").style.display="none";
    document.querySelector(".btn .video-first").style.display="none";
    document.querySelector(".btn .first").style.display="flex";
    video.style.display = "block";
    stopTimer();
    stopCamera();

});
