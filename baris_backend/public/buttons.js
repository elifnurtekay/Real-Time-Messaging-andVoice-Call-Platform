import { socket } from "./socketListener.js";

const settingCategories = document.querySelectorAll('.category');
const profileCategories = document.querySelectorAll('.profile-category');

const header = document.getElementById('settings-header');

// Profil özeti kategori buton değişken atamaları
const profileOverallBtn = document.getElementById('btn-profile-summary-overall');
const profileMediaBtn = document.getElementById('btn-profile-summary-media');
const profileFilesBtn = document.getElementById('btn-profile-summary-files');
const profileLinksBtn = document.getElementById('btn-profile-summary-links');
const profileGroupsBtn = document.getElementById('btn-profile-summary-groups');

const GroupsOverallBtn = document.getElementById('btn-groups-summary-overall');
const GroupsMediaBtn = document.getElementById('btn-groups-summary-media');
const GroupsFilesBtn = document.getElementById('btn-groups--summary-files');
const GroupsLinksBtn = document.getElementById('btn-groups-summary-links');
const GroupsUsersBtn = document.getElementById('btn-groups-summary-users');
const GroupsAddUsersBtn = document.getElementById('btn-groups-summary-addUsers');

// Profil kategori butonlarının açtığı konteynırlar
const profileOverallContainer = document.querySelector('.profile-summary-overall-container');
const profileMediaContainer = document.querySelector('.profile-summary-media-container');
const profileFilesContainer = document.querySelector('.profile-summary-files-container');
const profileLinksContainer = document.querySelector('.profile-summary-links-container');
const profileGroupsContainer = document.querySelector('.profile-summary-groups-container');

const GroupsOverallContainer = document.querySelector('.groups-summary-overall-container');
const GroupsMediaContainer = document.querySelector('.groups-summary-media-container');
const GroupsFilesContainer = document.querySelector('.groups-summary-files-container');
const GroupsLinksContainer = document.querySelector('.groups-summary-links-container');
const GroupsUsersContainer = document.querySelector('.groups-summary-users-container');
const GroupsAddUsersContainer = document.querySelector('.groups-summary-addUsers-container');

// Ayarlar kategori buton değişken atamaları
const settingsButton = document.getElementById('btn-setting')
const settingsGeneral = document.getElementById('settings-general')
const settingsAccount = document.getElementById('settings-account')
const settingsChats = document.getElementById('settings-chats')
const settingsAudio = document.getElementById('settings-audio')
const settingsNotifications = document.getElementById('settings-notifications')
const settingsCustomize = document.getElementById('settings-customize')
const settingsMemory = document.getElementById('settings-memory')
const settingsShortcuts = document.getElementById('settings-shortcuts')
const settingsHelp = document.getElementById('settings-help')
const settingsProfile = document.getElementById('settings-profile')

// Nav buton değişken atamaları
const callsBtn = document.getElementById("btn-calls");
const chatsBtn = document.getElementById("btn-chats");
const friendsButton = document.getElementById('btn-friends');
const addFriendsButton = document.getElementById('btn-addFriends');
const groupsButton = document.getElementById('btn-group');
const addGroupsButton = document.getElementById("btn-addgroup");

// Header kısmının değişken atamaları
const headerText = document.getElementById("right-btn")
const searchBar = document.getElementById("search-bar");

// Nav butonlarının açtığı konteynırlar
const contactsContainer = document.querySelector('.contacts');
const callsContainer = document.getElementById("calls-ctr");
const friendsContainer = document.querySelector('.friends-container');
const addFriendsContainer = document.querySelector('.addfriends-container');
const groupsContainer = document.querySelector('.groups-container');
const addGroupsContainer = document.querySelector(".add-groups-container");

const containers = [contactsContainer, friendsContainer, callsContainer, groupsContainer, addFriendsContainer, addGroupsContainer];

const profileCategoryContainers = [profileOverallContainer, profileMediaContainer, profileFilesContainer, profileLinksContainer, profileGroupsContainer];
const GroupsCategoryContainers = [GroupsOverallContainer, GroupsLinksContainer, GroupsFilesContainer, GroupsMediaContainer, GroupsUsersContainer, GroupsAddUsersContainer];
const settings = document.querySelectorAll('.setting')

settingCategories.forEach(category => {

    category.addEventListener('click', () => {
     
      // Tüm butonlardan "active" sınıfını kaldır
      settingCategories.forEach(cat => cat.classList.remove('active'));
      
      // Tıklanan butona "active" sınıfını ekle
      category.classList.add('active');
    });
});

const settingsMap = [
  { button: settingsGeneral, panelId: 'setting-general', headerText: "Genel" },
  { button: settingsAccount, panelId: 'setting-account', headerText: "Hesap" },
  { button: settingsChats, panelId: 'setting-chats', headerText: "Sohbetler" },
  { button: settingsAudio, panelId: 'setting-audio', headerText: "Video ve Ses" },
  { button: settingsNotifications, panelId: 'setting-notifications', headerText: "Bildirimler" },
  { button: settingsCustomize, panelId: 'setting-customize', headerText: "Kişiselleştirme" },
  { button: settingsMemory, panelId: 'setting-memory', headerText: "Depolama" },
  { button: settingsShortcuts, panelId: 'setting-shortcuts', headerText: "Kısayollar" },
  { button: settingsHelp, panelId: 'setting-help', headerText: "Yardım" },
  { button: settingsProfile, panelId: 'setting-profile', headerText: "Profil" }
];
  
settingsMap.forEach(({ button, panelId, headerText }) => {
  button.addEventListener('click', () => {
    hideAllSettings();
    header.textContent = headerText;
    document.getElementById(panelId).style.display = 'block';
  });
});
  
function hideAllSettings() {
  settings.forEach(setting => {
    setting.style.display = 'none'; // Tüm panelleri gizle
  });
}
  
// "Ayarlar" butonuna tıklama işlemi
settingsButton.addEventListener('click', (event) => {
  document.getElementsByClassName('settings-container')[0].classList.toggle('show');
  event.stopPropagation();
});

document.addEventListener('click', (event) => {
  const settingsContainer = document.getElementsByClassName('settings-container')[0];
  // Eğer panel açık ve tıklanan yer panel değilse, paneli kapat
  if (settingsContainer.classList.contains('show') && !settingsContainer.contains(event.target)) {
      settingsContainer.classList.remove('show');
  }
});

// Nav butonları
const buttonContainerMap = [
  { button: chatsBtn, container: contactsContainer, header: "Sohbetler", placeholder: "Sohbetler içinde arama yapın." },
  { button: callsBtn, container: callsContainer, header: "Aramalarım", placeholder: "Aramalarım içinde arama yapın." },
  { button: friendsButton, container: friendsContainer, header: "Arkadaşlar", placeholder: "Arkadaşlarım içinde arama yapın." },
  { button: groupsButton, container: groupsContainer, header: "Gruplar", placeholder: "Gruplar içinde arama yapın." },
  { button: addFriendsButton, container: addFriendsContainer, header: "Arkadaş Ekle", placeholder: "Arkadaş Ekle içinde arama yapın." },
  { button: addGroupsButton, container: addGroupsContainer, header: "Grup Oluştur", placeholder: "Arkadaş Ekle içinde arama yapın." }
];

let activeContainer = contactsContainer.className;

import { fetchChats, loadFriends, loadCalls } from "./contact.js"

buttonContainerMap.forEach(({ button, container, header, placeholder }) => {
  button.addEventListener('click', () => {
    containers.forEach(container => {
      container.style.display = 'none';
      
    });
    
    container.style.display = "block";
    headerText.textContent = header;
    searchBar.placeholder = placeholder;

    if (button === friendsButton || button === addGroupsButton || button === addFriendsButton) {
      // Eğer addGroupsButton veya addFriendsButton tıklanmışsa chats-container'ı gizle
      if (button === addGroupsButton || button === addFriendsButton) {
        document.querySelector(".chats-container").style.display = "none";
      }
  
      // friendsButton her durumda aktif olmalı, sadece loadFriends fonksiyonu çağrılır
      if (button === addGroupsButton) {
        loadFriends("new-group");
      } else if (button === friendsButton) {
        document.querySelector(".chats-container").style.display = "block";
        loadFriends("friends");
      } else if (button === addFriendsButton) {
        loadFriendRequests();
      }
    } else {
      // chats-container'ı diğer durumlarda göster
      document.querySelector(".chats-container").style.display = "block";
    
      // Diğer butonlara göre işlemler
      if (button === chatsBtn || button === groupsButton) {
        fetchChats();
      } else if (button === callsBtn) {
        loadCalls();
      }
    }
    activeContainer = container.className;

  });
});

const friendRequestList = document.getElementById('friend-request');

async function loadFriendRequests(){
  friendRequestList.innerHTML = '';
  try {
    const response = await fetch('/api/friends/requests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if(response.ok){
      renderFriendRequests(data.requests);
    }else{
      console.error(data.message);
      alert('Arkadaşlık istekleri alınırken bir hata oluştu!');
    }

  } catch (error) {
    console.error('Sunucu bağlantı hatası:', error);
    alert('Sunucuyla bağlantı kurulamadı.');
  }
};

function renderFriendRequests(requests) {
  requests.forEach(request => {
    const date = new Date(request.started_at).toLocaleString('tr-TR', { 
      timeZone: 'Europe/Istanbul',  
    });
    const li = document.createElement('li');
    li.classList.add('friend-request-item');

    li.innerHTML = `
          <img src="images/no-person.jpg" alt="${request.username}" class="friend-image" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
          <div class="friend-details">
              <strong>${request.username}</strong><br>
              <span class="request-date">Request Date: ${date}</span><br>
              <button class="approve-btn" style="margin-right: 5px;">Onayla</button>
              <button class="reject-btn">Reddet</button>
          </div>
      `;

    // Append the list item to the friend request list
    friendRequestList.appendChild(li);

    // Handle Approve button click
    const approveButton = li.querySelector('.approve-btn');
    approveButton.addEventListener('click', () => {
        socket.emit('friend_request_accepted', {reqUsername: request.username});
        li.remove(); // Remove the friend request after approval
    });

    // Handle Reject button click
    const rejectButton = li.querySelector('.reject-btn');
    rejectButton.addEventListener('click', () => {
        socket.emit('friend_request_rejected', {reqUsername: request.username});
        li.remove(); // Remove the friend request after rejection
    });
  });
};

// Kullanıcı adı arama sekmesi için kodlar

const results = document.querySelector('.results');
const searchValue = document.getElementById("searchFriend")

async function searchUsername() {
  results.innerHTML = '';
  const userSearchValue = searchValue.value.trim();

  // Girdi boşsa işlem durdur
  if (!userSearchValue) {
    alert('Lütfen bir kullanıcı adı girin.');
    return; // İşlemi sonlandır
  }

  try {
    const response = await fetch('/api/users/find', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchQuery: userSearchValue }),
      credentials: 'include'
    });
  
    const data = await response.json();

    if(response.ok){
      renderMatchedUsers(data);
    }else{
      console.error(data.message);
      alert('Kullanıcı verisi alınırken bir hata oluştu!');
    }

  } catch (error) {
    console.error('Sunucu bağlantı hatası:', error);
    alert('Sunucuyla bağlantı kurulamadı.');
  }

}

function renderMatchedUsers(matchedUserList){
  
  if(matchedUserList.exists){
    matchedUserList.users.forEach(user => {
      // IMAGE
      const content = `<div class="result-container">
            <img src="./images/gorkem.jpeg" alt="${user.full_name}" class="person-image" onclick="handleImageClick(this)">
            <div class="person-text">
                <div class="person-name">${user.full_name}</div>
                <div class="person-username">${user.username}</div>
            </div>
          </div>`;
  
      results.innerHTML += content;
    });
    sendFriendRequest();
  }else{
    const content = `<p> Herhangi bir sonuç bulunamadı. </p>`
    results.innerHTML += content;
  }
  
}

// Arkadaş ekle içinde user arayan fonksiyon
searchValue.addEventListener('keydown', function (event){
  if (event.key === 'Enter') { // Enter tuşu algılanır
    event.preventDefault(); // Varsayılan davranışı durdur (form gönderimi gibi)
    
    const userSearchValue = searchValue.value.trim();

    if (!userSearchValue) {
      alert('Lütfen bir kullanıcı adı girin.');
      return; // İşlemi sonlandır
    }

    // Fonksiyonu çağır
    searchUsername();
  }
});

async function sendFriendRequest(){
  const resultElements = document.querySelectorAll('.result-container');
  resultElements.forEach(element => {
    element.addEventListener('click', async function() {
      const usernameElement = element.querySelector('.person-username');
      const username = usernameElement ? usernameElement.textContent : null;
      if (username) {
        this.remove();
        socket.emit('friend_request', {username: username});
      } else {
        alert('Kullanıcı adı bulunamadı.');
      }
    });
  });
}

const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', searchUsername);

// Liste içinde arama yapan arama çubuğu fonksiyonu
searchBar.addEventListener('input', ()=>{
  let items;
  if(activeContainer === "contacts"){
    items = Array.from(document.querySelectorAll('.contact-item'));
  }else if(activeContainer === "friends-container"){
    items = Array.from(document.querySelectorAll('.friend-item'));
  }else if(activeContainer === "calls-container"){
    items = Array.from(document.querySelectorAll('.call-item'));
  }else if(activeContainer === "groups-container"){
    items = Array.from(document.querySelectorAll('.group-item'));
  }else{
    return;
  };

  const query = searchBar.value.toLowerCase();
  items.forEach(item => {
    let name;
    if(activeContainer === "contacts" || activeContainer === "groups-container"){
      name = item.getAttribute('data-chat-name').toLowerCase(); // İsmi al
    }else if(activeContainer === "friends-container"){
      name = item.getAttribute('data-friend-name').toLowerCase();
    }else if(activeContainer === "calls-container"){
      name = item.getAttribute('data-call-name').toLowerCase();
    }else{
      return;
    };

    const isVisible = name.includes(query); // Arama sorgusuyla karşılaştır
    item.style.display = isVisible ? '' : 'none'; // Eşleşenleri göster, diğerlerini gizle
  });
});

// Profil özeti listesi için butonlar
profileCategories.forEach(category => {

  category.addEventListener('click', () => {
     
    // Tüm butonlardan "active" sınıfını kaldır
    profileCategories.forEach(cat => cat.classList.remove('active'));
      
    // Tıklanan butona "active" sınıfını ekle
    category.classList.add('active');
  });
});

const buttonPanelMap = [
  { button: profileOverallBtn, panel: profileOverallContainer },
  { button: profileMediaBtn, panel: profileMediaContainer },
  { button: profileFilesBtn, panel: profileFilesContainer },
  { button: profileLinksBtn, panel: profileLinksContainer },
  { button: profileGroupsBtn, panel: profileGroupsContainer }
];

const buttonPanelMap2 = [
  { button: GroupsOverallBtn, panel: GroupsOverallContainer },
  { button: GroupsMediaBtn, panel: GroupsMediaContainer },
  { button: GroupsFilesBtn, panel: GroupsFilesContainer },
  { button: GroupsLinksBtn, panel: GroupsLinksContainer },
  { button: GroupsAddUsersBtn, panel: GroupsAddUsersContainer },
  { button: GroupsUsersBtn, panel: GroupsUsersContainer }
];

function hideAllProfilePanels() {
  profileCategoryContainers.forEach(container => {
    container.style.display = "none";
  });
}

function hideAllProfilePanels2() {
  GroupsCategoryContainers.forEach(container => {
    container.style.display = "none";
  });
}

buttonPanelMap.forEach(({ button, panel }) => {
  button.addEventListener('click', () => {
    hideAllProfilePanels();
    panel.style.display = "block";
  });
});

buttonPanelMap2.forEach(({ button, panel }) => {
  button.addEventListener('click', () => {
    hideAllProfilePanels2();
    if(button === GroupsOverallBtn){
      panel.style.display = "flex";
    }else{
      panel.style.display = "block";
    }
  });
});

const createGroupButton = document.querySelector('.submit-button');

createGroupButton.addEventListener('click', async function (event) {
  event.preventDefault();
  // Tüm seçili checkbox'ları bul
  const selectedFriends = [];
  document.querySelectorAll('.friend-checkbox:checked').forEach(checkbox => {
      const username = checkbox.closest('.friend-item').dataset.username;
      selectedFriends.push(username);
  });
  const groupName = document.getElementById('group-name').value.trim();
  if(!groupName){
    alert('Grup ismi alanı boş bırakılamaz.')
  }

  socket.emit('create_chat', {
    friendList: selectedFriends,
    group_name: groupName
  });
});
