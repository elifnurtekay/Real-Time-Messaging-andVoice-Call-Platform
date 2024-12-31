const profileOverallContainer = document.getElementsByClassName("profile-summary-overall-container")[0];
const groupOverallContainer = document.getElementsByClassName("groups-summary-overall-container")[0];
const userListContainer = document.querySelector(".group-users");

export function renderReceiverProfile(datas){
    datas.forEach(data => {
        profileOverallContainer.innerHTML = `
        <div class="profile-header-info">
            <img src="images/no-person.jpg" alt="${data.name_}" onclick="handleImageClick(this)">
            <div class="name-surname">
                <span class="name">${data.name_}</span>
                <span class="surname">${data.surname}</span>
            </div>
            <div class="username">~${data.username}</div>
        </div>

        <div class="connection">
            <button class="call-voice"> <i class="fa-solid fa-phone"></i> <br> Sesli </button>
            <button class="call-video"> <i class="fa-solid fa-video"></i> <br> Görüntülü </button>
        </div>

        <div class="profile-body-informations">
            <p>Son Görülme</p>
            Çevrimiçi
            <br>
            <p>Hakkımda</p>
            ${data.about}
            <br>
            <p>E-posta</p>
            ${data.email}
            <br>
        </div>
        <hr>
        <div class="block-report">
        <button class="block"></i>Engelle </button>
        <button class="report"></i>Kişiyi Şikayet Et </button>
        </div>
        `
    });
};

export function renderGroupDetail(chatName, createdAt){
    const createdDate = new Date(createdAt).toLocaleString('tr-TR', { 
        timeZone: 'Europe/Istanbul' 
    });
    groupOverallContainer.innerHTML = `
    <div class="profile-header-info">
        <img src="./images/no-person.jpg" alt="${chatName}">
        <div class="name-surname">
            <span class="name">${chatName}</span>
        </div>
    </div>
    <div class="connection">
        <button class="call-voice"> <i class="fa-solid fa-phone"></i> <br> Sesli </button>
        <button class="call-video"> <i class="fa-solid fa-video"></i> <br> Görüntülü </button>
    </div>
    <h3>Oluşturulma Zamanı</h3>
    <p>${createdDate}</p>

    <h3>Grup Açıklaması</h3>
    <p>Lorem ipsum dolor sit amet.</p>

    <button class="mute_notifications">Bildirimleri Sessize Al</button>
    <button class="leave_group">Gruptan Çık</button>
    `
};

export function renderGroupMembers(members){
    userListContainer.innerHTML = '';
    members.forEach(member => {
        const userItem = document.createElement("li");
        userItem.className = "user-item";
    
        const userInfo = document.createElement("div");
        userInfo.className = "user-info";
    
        const userImage = document.createElement("img");
        userImage.src = "images/no-person.jpg";
        userImage.alt = member.fullName;
    
        const userName = document.createElement("span");
        userName.className = "name";
        userName.textContent = member.fullName;
    
        userInfo.appendChild(userImage);
        userInfo.appendChild(userName);
    
        if (member.isAdmin) {
            const adminBadge = document.createElement("span");
            adminBadge.className = "admin-badge";
            adminBadge.textContent = "Yönetici";
            userInfo.appendChild(adminBadge);
        }
        userItem.appendChild(userInfo);
        userListContainer.appendChild(userItem);
    });
}
