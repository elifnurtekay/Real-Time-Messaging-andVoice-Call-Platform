const emojiContainer = document.querySelector(".emoji-container");
const emojiInputBtn = document.querySelector(".emoji-active");
const emojis = document.querySelectorAll(".emoji"); // NodeList (tüm emojiler)
const textBox2 = document.querySelector(".text-box");
const containerText=document.querySelector(".container-text");
const chatMessages2=document.querySelector(".chat-messages");

// Emoji panelini açma
emojiInputBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Linkin varsayılan davranışını engelle

    if (window.getComputedStyle(emojiContainer).display == "none") {
        emojiContainer.style.display = "flex"; // Görünür yapmak için 'flex' stili uygulandı
        containerText.style.bottom = emojiContainer.clientHeight + 'px';
        const chatHeaderHeight = document.querySelector('.chat-header').offsetHeight; // Başlık yüksekliğini al
        const containerTextHeight = document.querySelector('.container-text').offsetHeight; // Giriş alanı yüksekliğini al
        const emojiContainerHeight=document.querySelector(".emoji-container").offsetHeight;
        const availableHeight = window.innerHeight - chatHeaderHeight - emojiContainerHeight ; // Uygun yüksekliği hesapla
        chatMessages2.style.height = availableHeight +22+ 'px'; // Yüksekliği ayarla
    } else {
        emojiContainer.style.display = "none"; // Görünmez yapmak için 'none' stili uygulandı
        containerText.style.bottom = '0';

        const chatHeaderHeight = document.querySelector('.chat-header').offsetHeight; // Başlık yüksekliğini al
        const containerTextHeight = document.querySelector('.container-text').offsetHeight; // Giriş alanı yüksekliğini al

        const availableHeight = window.innerHeight - chatHeaderHeight  ; // Uygun yüksekliği hesapla
        chatMessages2.style.height = availableHeight +22 + 'px'; // Yüksekliği ayarla
    }

});

// Her emojiye tıklama olayını ekleme
emojis.forEach(emoji => {
    emoji.addEventListener('click', (event) => {
        event.preventDefault(); // Linkin varsayılan davranışını engelle
        const emojiCharacter = emoji.innerText; // Emoji karakterini al
        textBox2.value += emojiCharacter; // Emoji karakterini textboxa ekle
    });
});

document.querySelector(" .design-container .first-Col .emoji-2").addEventListener("click", function(e){
    e.preventDefault();
    e.stopPropagation();

    if(document.querySelector(" .design-container .emoji-container-2").style.display=="flex"){
        document.querySelector(" .design-container .emoji-container-2").style.display="none";
    }else{
        document.querySelector(" .design-container .emoji-container-2").style.display="flex";
    }

});

// Her emojiye tıklama olayını ekleme
const emoji2s = document.querySelectorAll(".design-container .emoji-container-2 .emoji");
emoji2s.forEach(emoji => {
    emoji.addEventListener('click', (e) => {
        e.preventDefault(); // Linkin varsayılan davranışını engelle
        const emojiCharacter = emoji.innerText; // Emoji karakterini al
        document.querySelector(".design-container .chat-message").value += emojiCharacter; // Emoji karakterini textboxa ekle
        console.log("Emoji eklendi:", emojiCharacter);
    });
});

document.querySelector(" .document-container .first-Col .emoji-2").addEventListener("click", function(e){
    e.preventDefault();
    e.stopPropagation();

    if(document.querySelector(" .document-container .emoji-container-2").style.display=="flex"){
        document.querySelector(" .document-container .emoji-container-2").style.display="none";
    }else{
        document.querySelector(" .document-container .emoji-container-2").style.display="flex";
    }

});

// Her emojiye tıklama olayını ekleme
const emoji3s = document.querySelectorAll(".document-container .emoji-container-2 .emoji");
emoji3s.forEach(emoji => {
    emoji.addEventListener('click', (e) => {
        e.preventDefault(); // Linkin varsayılan davranışını engelle
        const emojiCharacter = emoji.innerText; // Emoji karakterini al
        document.querySelector(".document-container .chat-message").value += emojiCharacter; // Emoji karakterini textboxa ekle
        console.log("Emoji eklendi:", emojiCharacter);
    });
});
