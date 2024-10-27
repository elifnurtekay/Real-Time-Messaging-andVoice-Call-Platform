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









//sess alma






// Global değişkenler
let mediaRecorder;
let audioChunks = [];
let audioContext, analyser, dataArray;
let recordingTimeInterval, recordingTime = 0;
let audio;
let isRecording = false;

// Ses kayıt arayüzüne tıklama işlemi
document.querySelectorAll(".voice").forEach(input => {
    input.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const voiceDropContent = this.querySelector(".dropcontent-3");

        if (isRecording) {
            stopRecording(); // Mevcut kaydı durdur
            resetRecordingUI();
            voiceDropContent.style.display = "none";
            this.style.backgroundColor = "#fff";
            this.style.color = "#333";
        } else {
            startRecording(); // Yeni kayıt başlat
            voiceDropContent.style.display = "block";
            this.style.backgroundColor = "#333";
            this.style.color = "#fff";
        }
    });
});

// Mikrofon izni isteme
async function requestMicrophoneAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    } catch (err) {
        console.error('Mikrofon izni hatası:', err);
        alert("Mikrofon izni gereklidir. Lütfen izin verin.");
        return null;
    }
}

// Kayıt başlatma
async function startRecording() {
    if (isRecording) {
        console.log("Zaten kayıt yapılıyor.");
        return;
    }

    const stream = await requestMicrophoneAccess();
    if (!stream) return;

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    isRecording = true;

    setupAudioContext(stream);
    initializeRecordingUI();

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = handleRecordingStop;
}

// Kayıt durdurma
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("Ses kaydı durduruldu.");
    }
}

// Ses dalgasını ve diğer görselleri ayarla
function setupAudioContext(stream) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    drawWaveform();
}

// Kayıt durduğunda yapılacak işlemler
function handleRecordingStop() {
    clearInterval(recordingTimeInterval);
    document.querySelector('.signal').style.display = 'none';

    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    audio = new Audio(audioUrl); // Kayıtlı sesi sakla
    document.querySelector('.voice-mp4').innerText = audioUrl;

    document.querySelector('.voice-start').style.display = 'none';
    document.querySelector('.voice-stop').style.display = 'flex';

    isRecording = false;
}

// Kayıt süresini güncelle
function updateRecordingTime() {
    recordingTime++;
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    document.getElementById('recording-time').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Ses dalgasını çizen fonksiyon
function drawWaveform() {
    const canvas = document.getElementById('waveform');
    const ctx = canvas.getContext('2d');

    function draw() {
        if (analyser) {
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = '#f9f9f9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.beginPath();

            const sliceWidth = canvas.width / dataArray.length;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
    }

    draw();
}

// Kaydı sıfırlama ve UI güncelleme
function resetRecordingUI() {
    audioChunks = [];
    audio = null;
    recordingTime = 0;

    document.querySelector('.voice-start').style.display = 'flex';
    document.querySelector('.voice-stop').style.display = 'none';
    document.getElementById('recording-time').innerText = '0:00';
    document.querySelector('.voice-mp4').innerText = '';
}

// UI ayarları
function initializeRecordingUI() {
    document.querySelector('.signal').style.display = 'block';
    recordingTime = 0;
    recordingTimeInterval = setInterval(updateRecordingTime, 1000);
}

// Ses kaydını silme
document.querySelector(".gabrage").addEventListener("click", function (e) {
    e.preventDefault();
    stopRecording();
    resetRecordingUI();
    console.log("Ses kaydı silindi.");
});
// Kayıt durdurma
document.querySelector(".stop-recording").addEventListener("click", function (e) {
    e.preventDefault(); // Linkin varsayılan davranışını durdur
    e.stopPropagation(); // Olayın yayılmasını durdur
    stopRecording(); // Kayıt durdurma fonksiyonunu çağır
    console.log("Kayıt durduruldu.");
});

// Kayıt devam ettirme
// Kayıt devam ettirme
document.querySelector(".continue-registration").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!isRecording) {
        // Mevcut ses parçalarını kontrol et
        if (audioChunks.length > 0) {
            // Kayıt devam etsin
            
            startRecording(); // Kayıt başlatma fonksiyonunu çağır
            console.log("Kayıt devam ettirildi.");
            document.querySelector('.voice-start').style.display = 'flex';
            document.querySelector('.voice-stop').style.display = 'none';
        } else {
            console.log("Öncelikle ses kaydı yapılmalı.");
        }
    } else {
        console.log("Zaten kayıt yapılıyor.");
    }
});


// Ses kaydını çalma
document.querySelector('.play-voice').addEventListener('click', function (e) {
    e.preventDefault();
    if (audio) audio.play();
});

// Ses kaydını gönderme
document.querySelector(".voice-submit").addEventListener("click", function (e) {
    e.preventDefault();

    const contactNameHeader = document.getElementById('contact-name');
    if (!contactNameHeader) {
        alert("Alıcı seçilmedi.");
        return;
    }

    const selectedContact = contactNameHeader.textContent.trim();

    if (isRecording) stopRecording();

    if (audio) {
        const newMessage = {
            type: "sent",
            text: 'Ses kaydı gönderildi',
            audioSrc: audio.src,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Mesajları güncelle
        chatData[selectedContact].messages = chatData[selectedContact].messages || [];
        chatData[selectedContact].messages.push(newMessage);

        // Yeni mesajı UI'ye ekle
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', newMessage.type);
        messageDiv.innerHTML = `
            <div>
                <audio controls>
                    <source src="${newMessage.audioSrc}" type="audio/mpeg">
                    Tarayıcınız audio elementini desteklemiyor.
                </audio>
                <div class="message-info">
                    <div class="history"><small>${newMessage.time}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        resetRecordingUI();
        document.querySelector(".dropcontent-3").style.display = "none";
    } else {
        alert("Gönderilecek ses kaydı yok.");
    }
});
