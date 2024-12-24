document.querySelector(".dropcontent-2 .person").addEventListener("click",(e)=>{
document.querySelector(".shared-contact").style.display="block";
const contactList = document.getElementById('shared-contact-list');

    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.classList.add('shared-contact-item');
        li.innerHTML = `
           
            <div class="shared-contact-li">
            <img src="${contact.image}" alt="${contact.name}" class="shared-contact-image">
            <h1>${contact.name}</h1>
            <input type="checkbox" class="contact-checkbox">
            </div>
            
        `;
        
        li.addEventListener("click", function () {
            const checkbox = li.querySelector('.contact-checkbox');
            checkbox.checked = !checkbox.checked;

            // Butonun görünürlüğünü güncelle
            updateButtonVisibility();
            li.classList.toggle("selected", checkbox.checked);
           
        });

        document.getElementById("shared-contact-list").appendChild(li);
    });

});

// Checkbox durumunu kontrol eden fonksiyon
function updateButtonVisibility() {
    const actionButton = document.querySelector('.shared-contact .shared-btn'); // Butonunuzu seçin
    const listItems = document.querySelectorAll('.shared-contact-item'); // Tüm liste öğelerini seç
    const anyChecked = Array.from(listItems).some(item => {
        const checkbox = item.querySelector('.contact-checkbox');
        return checkbox.checked; // Her bir öğedeki checkbox durumunu kontrol et
    });
    actionButton.style.display = anyChecked ? 'block' : 'none'; // Eğer herhangi bir checkbox seçiliyse butonu göster
}

// İlk yüklemede butonun görünümünü güncelle
updateButtonVisibility();

document.querySelector(".shared-contact .exit").addEventListener("click",(e)=>{

   // Tüm checkbox'ları kapat
   e.preventDefault();
   e.stopPropagation();
   const checkboxes = document.querySelectorAll('.contact-checkbox');
   checkboxes.forEach(checkbox => {
       checkbox.checked = false; // Checkbox'ı kapat
   });

   // Buton görünürlüğünü güncelle
   updateButtonVisibility();

   // Kapatma işlemi yapılacaksa (varsa), öncelikle etkinliğin varsayılan davranışını engelle
   e.preventDefault();
   document.querySelector(".shared-contact").style.display = "none";

   document.querySelector(".search-contact").value='';

});

document.querySelector(".shared-contact .shared-btn").addEventListener("click",(e)=>{

    e.preventDefault();
    e.stopPropagation();
    const selectedContact = contactNameHeader.textContent; // Seçili kontak
    const selectedSharedContacts = document.querySelectorAll('.shared-contact-item');

    // Seçili olanları filtrele
    const selectedPersons = Array.from(selectedSharedContacts).filter(item => {
        const checkbox = item.querySelector('.contact-checkbox'); // Her bir öğe içindeki checkbox'ı seç
        return checkbox.checked; // Eğer checkbox checked durumundaysa true döndür
    });
    
   // Seçilenleri kullan
    console.log(selectedPersons);

    if (selectedContact) {
        const newMessage = {
            type: "sent",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Her bir seçilen kişi için mesajı chatData'ya ekle
        selectedPersons.forEach(contact => {
            const contactName = contact.querySelector('h1').innerText; // İsim bilgisi
            const contactImage = contact.querySelector('img').src; // Resim bilgisi
            const contactId = contact.dataset.id; // Eğer varsa kişi ID'si, data-id ile almak için

            // Yeni mesajı chatData'ya ekle
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
            <div class="mediaContent">
                <div class="sharedContacts shared-contact-li">
                    <img src="${contactImage}" alt="${contactName}" class="shared-contact-image">
                    <h1>${contactName}</h1>
                </div>
            </div>
            <div>
                <div class="message-info">
                    <div class="history"><small>${newMessage.time}</small></div>
                    <div class="read"><i class="fa-regular fa-circle-check"></i></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        });

    // Mesajlar alanını en son mesaja kaydır
    chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Tüm checkbox'ları kapat
    const checkboxes = document.querySelectorAll('.contact-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Checkbox'ı kapat
    });
    
    // Buton görünürlüğünü güncelle
    updateButtonVisibility();
    
    // Kapatma işlemi yapılacaksa (varsa), öncelikle etkinliğin varsayılan davranışını engelle
    e.preventDefault();
    document.querySelector(".shared-contact").style.display = "none";
    
    document.querySelector(".search-contact").value='';
 
});
