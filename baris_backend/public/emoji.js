const emojiContainer = document.querySelector(".emoji-container");
const backInputBtn = document.querySelector(".back-input-text");
const emojiInputBtn = document.querySelector(".emoji-active");
const emojis = document.querySelectorAll(".emoji"); // NodeList (tüm emojiler)
const textBox2 = document.querySelector(".text-box");
const containerText=document.querySelector(".container-text");
const chatMessages2=document.querySelector(".chat-messages");

// Emoji panelini açma
emojiInputBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Linkin varsayılan davranışını engelle
    emojiContainer.style.display = "flex"; // Görünür yapmak için 'flex' stili uygulandı
    containerText.style.bottom = emojiContainer.clientHeight + 'px';


    const chatHeaderHeight = document.querySelector('.chat-header').offsetHeight; // Başlık yüksekliğini al
    const containerTextHeight = document.querySelector('.container-text').offsetHeight; // Giriş alanı yüksekliğini al
    const emojiContainerHeight=document.querySelector(".emoji-container").offsetHeight;
    const availableHeight = window.innerHeight - chatHeaderHeight - emojiContainerHeight ; // Uygun yüksekliği hesapla
    chatMessages2.style.height = availableHeight +22+ 'px'; // Yüksekliği ayarla

});

// Emoji panelini kapama
backInputBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Linkin varsayılan davranışını engelle
    emojiContainer.style.display = "none"; // Görünmez yapmak için 'none' stili uygulandı
    containerText.style.bottom = '0';

    const chatHeaderHeight = document.querySelector('.chat-header').offsetHeight; // Başlık yüksekliğini al
    const containerTextHeight = document.querySelector('.container-text').offsetHeight; // Giriş alanı yüksekliğini al

    const availableHeight = window.innerHeight - chatHeaderHeight  ; // Uygun yüksekliği hesapla
    chatMessages2.style.height = availableHeight +22 + 'px'; // Yüksekliği ayarla
});

// Her emojiye tıklama olayını ekleme
emojis.forEach(emoji => {
    emoji.addEventListener('click', () => {
        event.preventDefault(); // Linkin varsayılan davranışını engelle
        const emojiCharacter = emoji.innerText; // Emoji karakterini al
        textBox2.value += emojiCharacter; // Emoji karakterini textboxa ekle
    });
});
