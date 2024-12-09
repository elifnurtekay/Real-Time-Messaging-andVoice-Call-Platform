const optionsContainer = document.getElementById('options');

document.querySelector(".dropcontent-2 .question").addEventListener("click", (e) => {

    document.querySelector(".questions-container").style.display = "block";

});

document.querySelector(".questions-container .exit").addEventListener("click",(e) =>{
    e.preventDefault();

    document.querySelectorAll(".questions-container input").forEach(input => {
        input.value = '';
    });

    const allInputs = optionsContainer.querySelectorAll('.inputContent-Options .option-input');

    // Eğer input boşsa ve en az bir tane daha varsa boş olanları sil
    allInputs.forEach((input, index) => {
        if (input.value.trim() === '' && allInputs.length > 1) {
            // Eğer bu, en son kalan input değilse kaldır
            if (allInputs.length - 1 > index) {
                input.parentElement.remove();
            }
        }
    });


    document.querySelector(".question-submit input").checked = false;

    document.getElementById("emoji-box").style.display="none";
    activeInput=null;
    document.querySelector(".questions-container").style.display = "none";
});

let activeInput = null;

function toggleEmojiBox(element) {
    
    const emojiBox = document.getElementById("emoji-box");
    emojiBox.style.display = emojiBox.style.display === "none" ? "flex" : "none";

    // Emoji kutusu açık olduğunda aktif inputu belirleme
    activeInput = element.previousElementSibling;
} 

const emoji4s = document.querySelectorAll(".emoji-box .emoji");
emoji4s.forEach(emoji => {
    emoji.addEventListener('click', (e) => {
        e.preventDefault(); // Linkin varsayılan davranışını engelle
                
        const emojiCharacter = emoji.innerText; // Emoji karakterini al
        activeInput.value += emojiCharacter; // Emoji karakterini textboxa ekle
        console.log("Emoji eklendi:", emojiCharacter);

                
    });
});
    
// Yeni bir seçenek girişi ekleme işlevi
function addOptionInput() {
    const newOption = document.createElement('div');
    newOption.classList.add('inputContent-Options');
    newOption.innerHTML = `
        <input type="text" placeholder="+Seçenekler ekleyin" class="option-input">
        <a href="javascript:void(0);" class="emoji" onclick="toggleEmojiBox(this)">
            <i class="fa-solid fa-face-smile"></i>
        </a>
    `;
    optionsContainer.appendChild(newOption);

    // Yeni giriş alanına olay dinleyici ekleme
    const newInput = newOption.querySelector('input');
    newInput.addEventListener('input', handleInput);
}

// Giriş alanlarına yazı ekleyip silindiğinde boş kontrolü
function handleInput(e) {
    const allInputs = optionsContainer.querySelectorAll('.inputContent-Options .option-input');
    const currentInput = e.target;

    // Eğer geçerli input boşsa ve birden fazla input varsa, sil
    if (currentInput.value.trim() === '' && allInputs.length > 1) {
        currentInput.parentElement.remove();
        return;
    }

    const lastInput = allInputs[allInputs.length - 1];

    // Son giriş alanında içerik varsa yeni bir seçenek alanı ekle
    if (lastInput.value.trim() !== '') {
        addOptionInput(); // Yeni seçenek alanı ekle
    }
}

// İlk giriş alanına başlangıç olay dinleyicisini ekle
const firstInput = optionsContainer.querySelector('.inputContent-Options input');
firstInput.addEventListener('input', handleInput);

document.querySelector(".question-submit .submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    
    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const questionsText = document.querySelector(".questions-container .question-input").value.trim(); // Textbox içeriğini al

    // Option input'lardan değerleri al
    const optionInputs = optionsContainer.querySelectorAll('.inputContent-Options .option-input');
    const optionsArray = Array.from(optionInputs).map(input => input.value.trim()).filter(value => value !== ''); // Boş olmayan değerleri al

    if (selectedContact && questionsText) {
        // Anket mesajı oluştur
        const newMessage = {
            type: "sent",
            text: questionsText, // Anket sorusu
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
        messageDiv.innerHTML = `
            <div class="survey-container">
                <h1 class="survey-title">📊 ${questionsText}</h1>
                <div class="options">
                    ${optionsArray.map((option) => `
                        <label class="option">
                            <input type="checkbox" class="option-checkbox">
                            <span class="checkmark"></span>
                            ${option}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div>
                <div class="message-info">
                    <div class="history"><small>${newMessage.time}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>`;

        chatMessages.appendChild(messageDiv);

        // Mesajlar alanını en son mesaja kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Checkbox durumu için değişiklik dinleyicisi ekle
        const options = messageDiv.querySelectorAll('.options .option-checkbox');
        const isMultipleChoice = document.querySelector(".question-submit input").checked; // Checkbox durumunu kontrol et

        if (!isMultipleChoice) {
            options.forEach(option => {
                option.addEventListener('change', function() {
                    if (this.checked) {
                        options.forEach(opt => {
                            if (opt !== this) opt.checked = false; // Diğerlerini temizle
                        });
                    }
                });
            });
        }
    }

    // Inputları temizle
    document.querySelectorAll(".questions-container input").forEach(input => {
        input.value = '';
    });

    const allInputs = optionsContainer.querySelectorAll('.inputContent-Options .option-input');

    // Eğer input boşsa ve en az bir tane daha varsa boş olanları sil
    allInputs.forEach((input, index) => {
        if (input.value.trim() === '' && allInputs.length > 1) {
            // Eğer bu, en son kalan input değilse kaldır
            if (allInputs.length - 1 > index) {
                input.parentElement.remove();
            }
        }
    });

    // Checkbox'ı işaretsiz hale getir
    document.querySelector(".question-submit input").checked = false;

    // Emoji kutusunu gizle
    document.getElementById("emoji-box").style.display = "none";
    
    // Aktif girişi sıfırla
    activeInput = null;

    // Soru alanını gizle
    document.querySelector(".questions-container").style.display = "none";
});
