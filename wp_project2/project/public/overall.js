const dataOverall  = [
    {name: "Umut Çağatay", surname: "Tapur", username: "umutcty", image: "./images/seeds.png", lastseen:"Çevrimiçi", about:"black", email: "tapur601@gmail.com" },
]

const profileOverallContainer = document.getElementsByClassName("profile-summary-overall-container");

dataOverall.forEach(data => {
    profileOverallContainer.innerHTML = `
    <div class="profile-header-info">
    <img src="${data.image}" alt="${data.name}" onclick="handleImageClick(this)">
    <div class="name-surname">
        <span class="name">${data.name}</span>
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
    ${data.lastseen}
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
