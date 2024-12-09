// Global değişkenler
let mediaRecorder;
let audioChunks = [];
let audioContext, analyser, dataArray;
let recordingTimeInterval, recordingTime = 0;
let audio;
let isRecording = false;
const voice = document.querySelector('.voice');
let audioStream = null;
let callAudio = null; // Ses dosyasını kontrol eden değişken

// Ses kayıt arayüzüne tıklama işlemi
document.querySelectorAll(".voice").forEach(input => {
    input.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const voiceDropContent = this.querySelector(".dropcontent-3");
        voiceDropContent.style.display = "block";
        this.style.backgroundColor = "#333";
        this.style.color = "#fff";
    });
});

// Mikrofon izni isteme
function requestMicrophoneAccess() {
    try {
        const stream =  navigator.mediaDevices.getUserMedia({ audio: true });
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
    if (!stream) {
        const voiceDropContent = this.querySelector(".dropcontent-3");
        voiceDropContent.style.display = "none";
        document.querySelector(".voice").style.backgroundColor = "";
        document.querySelector(".voice").style.color = ""; 
        return;
    } 

    audioStream = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    isRecording = true;

    setupAudioContext(stream);
    initializeRecordingUI();

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = ()=>{
        handleRecordingStop();
        if (audioStream) {
            const tracks = stream.getTracks(); // Akıştaki tüm izleri al
            tracks.forEach(track => track.stop()); // Her bir izi durdur
      
        }
    } 
}

// Kayıt durdurma
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        isRecording=false;
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
    audioChunks = [];
    const audioUrl = URL.createObjectURL(audioBlob);
    audio = new Audio(audioUrl); // Kayıtlı sesi sakla
    document.querySelector('.voice-mp4').src = audioUrl;

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
    
    if (isRecording) {
        recordingTime = 0;
        recordingTimeInterval = setInterval(updateRecordingTime, 1000);
    }else{
        recordingTime=setInterval(updateRecordingTime);
    }
}

// Ses kaydını silme
document.querySelector(".gabrage").addEventListener("click", function (e) {

    stopRecording();
    resetRecordingUI();
    console.log("Ses kaydı silindi.");
});

// Kayıt durdurma
document.querySelector(".stop-recording").addEventListener("click", function (e) {
    e.preventDefault(); // Linkin varsayılan davranışını durdur
    e.stopPropagation(); // Olayın yayılmasını durdur
    stopRecording(); // Kayıt durdurma fonksiyonunu çağır
    document.querySelector('.voice-start').style.display = 'none';
    document.querySelector('.voice-stop').style.display = 'flex';
    console.log("Kayıt durduruldu.");
});

// Ses kaydını gönderme
document.querySelector(".voice-submit").addEventListener("click", function (e) {
    e.preventDefault(); // Linkin varsayılan davranışını durdur
    e.stopPropagation(); // Olayın yayılmasını durdur


    const contactNameHeader = document.getElementById('contact-name');
    if (!contactNameHeader) {
        alert("Alıcı seçilmedi.");
        return;
    }

    const selectedContact = contactNameHeader.textContent.trim();

    if (isRecording){ 
        e.preventDefault(); // Linkin varsayılan davranışını durdur
        e.stopPropagation(); // Olayın yayılmasını durdur
        stopRecording(); 
      
    }

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
            <div class="audio-container">
                <audio controls>
                    <source src="${newMessage.audioSrc}" type="audio/mpeg">
                    
                </audio>
                <div class="message-info">
                    <div class="history"><small>${newMessage.time}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        
        e.preventDefault();
        e.stopPropagation();
        resetRecordingUI();
        document.querySelector(".dropcontent-3").style.display = "none";
        document.querySelector(".voice").style.backgroundColor = "";
        document.querySelector(".voice").style.color = "";
        stopRecording(); // Kayıt durdurma fonksiyonunu çağır
        
    } else {
        alert("Gönderilecek ses kaydı yok.");
    }
});

// Olay dinleyicileri
voice?.addEventListener('click', startRecording);
