const videoCallButton = document.querySelector('.video-call');
const endCallButton = document.getElementById('call_closeVideoCall'); // Kapatma tuşu
const videoContainer = document.getElementById('videoContainer');
const localVideo = document.getElementById('localVideo');
const waitingMessage = document.getElementById('waitingMessage');
const callStatus = document.getElementById('callStatus');

let localStream = null;
let unansweredTimeout = null;
let video_callAudio = null; // Ses dosyasını kontrol eden değişken

// Kamera ve mikrofon izni al
async function getMediaStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        localVideo.srcObject = stream;
        localStream = stream;
        return stream;
    } catch (err) {
        console.error('Kamera veya mikrofon izni alınamadı:', err);
        alert('Lütfen kamera ve mikrofon izinlerini verin!');
        return null;
    }
}

// Medya ve ses akışını durdur
function stopMedia() {
    if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        localStream = null;
    }

    if (video_callAudio) {
        video_callAudio.pause();
        video_callAudio.currentTime = 0;
        video_callAudio= null;
    }
}

// Arama başlatma
async function startCall() {
    // Gerekli elementlerin varlığını kontrol et
    if (!videoContainer || !localVideo || !waitingMessage || !callStatus) {
        console.error('Gerekli HTML öğelerinden biri bulunamadı!');
        return;
    }
    document.querySelector("nav").style.display="none";
    // Video container'ı göster
    videoContainer.style.display = 'flex';

    // Kamera ve mikrofon izni al
    const stream = await getMediaStream();
    if (!stream) {
        videoContainer.style.display = 'none';
        document.querySelector("nav").style.display="flex";
        return;
    }

    // Arama sesi çalma
    try {
        video_callAudio  = new Audio('./voice/ring-tone-68676.mp3');
        await video_callAudio.play();
    } catch (err) {
        console.error('Ses dosyası oynatılamadı:', err);
    }

    // Bekleme mesajı göster
    waitingMessage.style.display = 'block';

    // Arama cevapsız kalırsa
    unansweredTimeout = setTimeout(() => {
        waitingMessage.style.display = 'none';
        callStatus.style.display = 'block';
        callStatus.textContent = 'Cevapsız Arama';

        // Ses ve video kaydını durdur
        stopMedia();

        // Video container'ı gizle
        setTimeout(() => {
            videoContainer.style.display = 'none';
        }, 2000);
    }, 20000); // 20 saniye sonra cevapsız mesajı
}

// Aramayı sonlandırma
function endCall() {

    stopMedia();

    // Bekleme mesajını ve cevapsız mesajı gizle
    waitingMessage.style.display = 'none';
    callStatus.style.display = 'none';

    // Video container'ı gizle
    videoContainer.style.display = 'none';
    document.querySelector("nav").style.display="flex";

    // Cevapsız zamanlayıcıyı temizle
    if (unansweredTimeout) {
        clearTimeout(unansweredTimeout);
        unansweredTimeout = null;
    }
}

// Olay dinleyicileri
videoCallButton?.addEventListener('click', startCall);
endCallButton?.addEventListener('click', endCall);

const closeVideoButton = document.getElementById("call_closeVideo");

closeVideoButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Toggle the 'selected' class on the button
    const isSelected = this.classList.toggle("selected");

    if (isSelected) {
        // Video akışını devre dışı bırak
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                if (track.kind === "video") {
                    track.enabled = false; // Sadece video iznini devre dışı bırak
                }
            });
            console.log("Video yayını devre dışı bırakıldı.");
        }
    } else {
        // Video akışını yeniden etkinleştir
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                if (track.kind === "video") {
                    track.enabled = true; // Sadece video iznini etkinleştir
                }
            });
            localVideo.srcObject = localStream; // Video kaynağını yeniden bağla
            console.log("Video yayını yeniden etkinleştirildi.");
        } else {
            console.error("Video akışı bulunamadı. Lütfen kamerayı tekrar başlatın.");
        }
    }
});

const closeVideoMicrophone=document.getElementById("call_closeVideoMicrophone");

closeVideoMicrophone.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Toggle the 'selected' class on the button
    const isSelected = this.classList.toggle("selected");

    if (isSelected) {
        // Mikrofon akışını devre dışı bırak
        if (localStream) {
            localStream.getTracks().forEach((track) => {
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
        if (localStream) {
            localStream.getTracks().forEach((track) => {
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
