const voiceCallButton = document.querySelector('.voice-call');
const endVoiceCallButton = document.getElementById('call_closeVoiceCall');
const voiceContainer = document.getElementById('voiceCallContainer');
const localVoice = document.getElementById('localimg');
const voicewaitingMessage = document.getElementById('voiceCallWaitingMessage');
const voiceCallStatus = document.getElementById('voiceCallStatus');

let voicelocalStream = null;
let voiceunansweredTimeout = null;
let voice_callAudio = null;
let timerInterval = null;  // Timer için interval
let seconds = 0;  // Sayaçta geçen saniye
let minutes = 0;  // Sayaçta geçen dakika

// Kamera ve mikrofon izni al
async function getMediaStreamVoice() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        voicelocalStream = stream;
        return stream;
    } catch (err) {
        console.error('Mikrofon izni alınamadı:', err);
        alert('Lütfen mikrofon izinlerini verin!');
        return null;
    }
}

// Medya ve ses akışını durdur
function stopMediaVoice() {
    if (voicelocalStream) {
        voicelocalStream.getTracks().forEach((track) => track.stop());
        voicelocalStream = null;
    }

    if (voice_callAudio) {
        voice_callAudio.pause();
        voice_callAudio.currentTime = 0;
        voice_callAudio = null;
    }

    // Timer'ı temizle
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Arama başlatma
async function voicestartCall() {
    if (!voiceContainer || !voicewaitingMessage) {
        console.error('Gerekli HTML öğelerinden biri bulunamadı!');
        return;
    }

    document.querySelector("nav").style.display = "none";
    voiceContainer.style.display = 'flex';

    const stream = await getMediaStreamVoice();
    if (!stream) {
        voiceContainer.style.display = 'none';
        document.querySelector("nav").style.display = "flex";
        return;
    }

    try {
        voice_callAudio = new Audio('./voice/ring-tone-68676.mp3');
        await voice_callAudio.play();
    } catch (err) {
        console.error('Ses dosyası oynatılamadı:', err);
    }

    voicewaitingMessage.style.display = 'block';

    voiceunansweredTimeout = setTimeout(() => {
        voicewaitingMessage.style.display = 'none';
        if (voiceCallStatus) {
            voiceCallStatus.style.display = 'block';
            voiceCallStatus.textContent = 'Cevapsız Arama';
        }

        stopMediaVoice();

        setTimeout(() => {
            voiceContainer.style.display = 'none';
            document.querySelector("nav").style.display = "flex";
        }, 2000);
    }, 20000);

    // Sayaç başlatma
    startTimer();
}

// Sayaç başlatma ve güncelleme
function startTimer() {
    // Eğer zamanlayıcı zaten çalışıyorsa, yeni bir tane başlatma
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        seconds++;

        // Dakikayı 60 saniyede bir artır
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        // Sayacı güncelle
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timeCounter').textContent = formattedTime;
    }, 1000); // Her saniye bir kez çalışacak
}

// Aramayı sonlandırma
function voiceendCall(event) {
    event.preventDefault();
    event.stopPropagation();

    stopMediaVoice();

    if (voicewaitingMessage) voicewaitingMessage.style.display = 'none';
    if (voiceCallStatus) voiceCallStatus.style.display = 'none';

    voiceContainer.style.display = 'none';
    document.querySelector("nav").style.display = "flex";

    if (voiceunansweredTimeout) {
        clearTimeout(voiceunansweredTimeout);
        voiceunansweredTimeout = null;
    }

    // Timer'ı temizle
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Mikrofon kontrolü
const closeVoiceMicrophone = document.getElementById("call_closeCallMicrophone");
closeVoiceMicrophone.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Toggle the 'selected' class on the button
    const isSelected = this.classList.toggle("selected");

    if (isSelected) {
        // Mikrofon akışını devre dışı bırak
        if (voicelocalStream) {
            voicelocalStream.getTracks().forEach((track) => {
                if (track.kind === "audio") {
                    track.enabled = false; // Mikrofonu devre dışı bırak
                }
            });
            console.log("Mikrofon devre dışı bırakıldı.");
        } else {
            console.error("Ses akışı bulunamadı.");
        }
    } else {
        // Mikrofon akışını yeniden etkinleştir
        if (voicelocalStream) {
            voicelocalStream.getTracks().forEach((track) => {
                if (track.kind === "audio") {
                    track.enabled = true; // Mikrofonu etkinleştir
                }
            });
            console.log("Mikrofon yeniden etkinleştirildi.");
        } else {
            console.error("Ses akışı bulunamadı.");
        }
    }
});

// Olay dinleyicileri
voiceCallButton?.addEventListener('click', voicestartCall);
endVoiceCallButton?.addEventListener('click', voiceendCall);
