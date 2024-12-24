const settingCategories = document.querySelectorAll('.category');
const profileCategories = document.querySelectorAll('.profile-category');

const header = document.getElementById('settings-header');

//Profil özeti kategori buton değişken atamaları
const profileOverallBtn = document.getElementById('btn-profile-summary-overall');
const profileMediaBtn = document.getElementById('btn-profile-summary-media');
const profileFilesBtn = document.getElementById('btn-profile-summary-files');
const profileLinksBtn = document.getElementById('btn-profile-summary-links');
const profileGroupsBtn = document.getElementById('btn-profile-summary-groups');

//Profil kategori butonlarının açtığı konteynırlar
const profileOverallContainer = document.querySelector('.profile-summary-overall-container');
const profileMediaContainer = document.querySelector('.profile-summary-media-container');
const profileFilesContainer = document.querySelector('.profile-summary-files-container');
const profileLinksContainer = document.querySelector('.profile-summary-links-container');
const profileGroupsContainer = document.querySelector('.profile-summary-groups-container');


//Ayarlar kategori buton değişken atamaları
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

//Nav buton değişken atamaları
const callsBtn = document.getElementById("btn-calls");
const chatsBtn = document.getElementById("btn-chats");
const friendsButton = document.getElementById('btn-friends');
const addFriendsButton = document.getElementById('btn-addFriends');
const groupsButton = document.getElementById('btn-group');

//Header kısmının değişken atamaları
const headerText = document.getElementById("right-btn")
const searchBar = document.getElementById("search-bar");

//Nav butonlarının açtığı konteynırlar
const contactList = document.getElementById('contact-list');
const callsContainer = document.getElementById("calls-ctr");
const friendsContainer = document.querySelector('.friends-container');
const addFriendsContainer = document.querySelector('.addfriends-container');
const groupsContainer = document.querySelector('.groups-container');

const containers = [contactList, friendsContainer, callsContainer, groupsContainer, addFriendsContainer];

const profileCategoryContainers = [profileOverallContainer, profileMediaContainer, profileFilesContainer, profileLinksContainer, profileGroupsContainer];

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
  { button: chatsBtn, container: contactList, header: "Sohbetler", placeholder: "Sohbetler içinde arama yapın." },
  { button: callsBtn, container: callsContainer, header: "Aramalarım", placeholder: "Aramalarım içinde arama yapın." },
  { button: friendsButton, container: friendsContainer, header: "Arkadaşlar", placeholder: "Arkadaşlarım içinde arama yapın." },
  { button: groupsButton, container: groupsContainer, header: "Gruplar", placeholder: "Gruplar içinde arama yapın." },
  { button: addFriendsButton, container: addFriendsContainer, header: "Arkadaş Ekle", placeholder: "Arkadaş Ekle içinde arama yapın." }
];

import { fetchChats, loadFriends, loadCalls } from "./contact.js"

buttonContainerMap.forEach(({ button, container, header, placeholder }) => {
  button.addEventListener('click', () => {
    containers.forEach(container => {
      container.style.display = 'none';
    });

    if(container!=contactList){
      document.querySelectorAll(".toggle-btn").forEach(button => {
        button.style.display = "none";
      });
    
    }else{
      document.querySelectorAll(".toggle-btn").forEach(button => {
        button.style.display = "block";
      });
    
    }
    container.style.display = "block";
    headerText.textContent = header;
    searchBar.placeholder = placeholder;

    if(button === chatsBtn || button == groupsButton){
      fetchChats();
    }else if (button === friendsButton){
      loadFriends();
    }else if (button === callsBtn){
      loadCalls();
    }
  });
});

// Kullanıcı adı arama sekmesi için kodlar
const dataSearch = [
  {username: "umutcty", name: "Umut Çağatay", surname: "Tapur", image: "./images/seeds.png"},
  {username: "hsaribuga", name: "Hüseyin", surname: "Sarıbuğa", image: "./images/effrey.webp"},
  {username: "barisgungor", name: "Barış", surname: "Güngör", image: "./images/jacob.jpg"},
  {username: "elifntekay", name: "Elif Nur", surname: "Tekay", image: "./images/view.avif"}
]

const results = document.querySelector('.results');

function searchUsername() {
  results.innerHTML = '';
  const searchValue = document.getElementById("searchFriend").value.trim();
  let found = false;

  dataSearch.forEach(person => {
    if (person.username == `${searchValue}`) {
      const content = 
      `<div class="result-container">
          <img src="${person.image}" alt="${person.name}" class="person-image" onclick="handleImageClick(this)">
          <div class="person-text">
              <div class="person-name">${person.name} ${person.surname}</div>
              <div class="person-username">${person.username}</div>
          </div>
        </div>`;

        results.innerHTML += content;
        found = true;
      } 
  });

  if(!found){
    const content = `<p> Herhangi bir sonuç bulunamadı. </p>`
    results.innerHTML += content;
  }
 
}

//Profil özeti listesi için butonlar
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

function hideAllProfilePanels() {
  profileCategoryContainers.forEach(container => {
    container.style.display = "none";
  });
}

buttonPanelMap.forEach(({ button, panel }) => {
  button.addEventListener('click', () => {
    hideAllProfilePanels();
    panel.style.display = "block";
  });
});
