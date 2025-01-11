async function getProfileDetails() {
    const response = await fetch('api/users/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        console.error("Profil bilgisi alınamadı.");
        return null;
    }
    
    const data = await response.json();
    return data.profileDetail;
}

const profile = document.getElementById("setting-profile");

const profileSetting = document.getElementById("settings-profile");
profileSetting.addEventListener("click", async () => {
    profile.innerHTML = ''
    const profileDetails = await getProfileDetails();
    
    profileDetails.forEach(profileDetail => {

        const profileInfo = `<img id="account-pp" src="./images/seeds.png" class="account-pp thumbnail" onclick="handleImageClick(this)">
        <div class="account-name">
        <h3> ${profileDetail.name} </h3>
        </div>
         <div class="about-me">
         <p>Hakkımda</p>
         ${profileDetail.about} 
        </div>
        <div class="email">
         <p>Email</p>
         ${profileDetail.email} 
        </div>
        <hr>
        <input type="button" value="Çıkış" class="logout-button"> 
         `; // BU KISIMDA İNPUT DEĞERİNİ SÜREKLİ JAVASCRİPT İLE ÇAĞIRMAK SERVERİ YORABİLİR. BUNUN ÇÖZÜMÜ İÇİN SAYFA İÇİNE YENİ BİR DİV TANIMLAYIP JS İLE DEĞERLERİ ONA ATAMAMIZ GEREKİYOR.
       
        profile.innerHTML += profileInfo;
    });

});

const viewImageContainer = document.querySelector('.view-image');

function handleImageClick (picture) {
    var defaultImage = document.getElementById('default-image');
    
  
    defaultImage.src = `${picture.src}`;

    viewImageContainer.style.display = "flex";

}

function closeHandleImage() {
    const viewImageContainer = document.querySelector('.view-image');
    viewImageContainer.style.display = "none";
}