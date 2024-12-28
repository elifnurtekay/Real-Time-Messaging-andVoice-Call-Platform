import { loadFriends } from "./contact.js"
import { renderReceiverProfile, renderGroupDetail, renderGroupMembers } from "./overall.js";

const chatHeader = document.querySelector('.profile-summary-click');
const profileSummary = document.querySelector('.profile-summary');
const GroupSummary = document.querySelector('.groups-summary');

// Profil özetini açmak için
chatHeader.addEventListener('click', async (event) => {
    event.stopPropagation(); // Üst öğelere yayılmayı engeller
    const selectedElement = document.querySelector('.selected');
    if(selectedElement){
        if(selectedElement.classList.contains('group-item')){
            GroupSummary.classList.toggle('show'); // Profil özeti görünürlüğünü toggle eder
            const createdAt = selectedElement.getAttribute('data-group-created-at');
            const chatName = selectedElement.getAttribute('data-chat-name');
            renderGroupDetail(chatName, createdAt);

            try {
                const response = await fetch('/api/users/get-group-members', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({chat_name: chatName, created_at: createdAt})
                });
                const memberData = await response.json();
                renderGroupMembers(memberData.members);   
            } catch (error) {
                console.error('Sunucu hatası:', error);
            }

            // SQL E GRUP AÇIKLAMASI COLUMN EKLE
            loadFriends("add-group-member");
        }
        else {
            profileSummary.classList.toggle('show'); // Profil özeti görünürlüğünü toggle eder
            const receiverUsername = selectedElement.getAttribute('data-receiver-username');
            try {
                const response = await fetch('/api/users/get-receiver-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username: receiverUsername})
                });
                const receiverData = await response.json();
                renderReceiverProfile(receiverData.receiverProfile);   
            } catch (error) {
                console.error('Sunucu hatası:', error);
            }
        }
    }else{
        alert("Lütfen özetini görmek istediğiniz sohbeti seçin.");
    }
});

// Profil özetini sadece profile-summary dışında bir yere tıklayınca kapat
document.addEventListener('click', (event) => {
    // Eğer tıklanan yer profile-summary dışında bir yerse
    if (!profileSummary.contains(event.target) && !chatHeader.contains(event.target)) {
        // Profil özetini kapat
        setTimeout(() => {
            profileSummary.classList.remove('show');
        }, 0);
    }

    // Eğer tıklanan yer profile-summary dışında bir yerse
    if (!GroupSummary.contains(event.target) && !chatHeader.contains(event.target)) {
        // Profil özetini kapat
        setTimeout(() => {
            GroupSummary.classList.remove('show');
        }, 0);
    }
});
