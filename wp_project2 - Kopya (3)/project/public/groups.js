const groupsData = [
    {image: "./images/whatsapp-grup.webp", name: "Oda Grubu",  participants: "4"},
    {image: "./images/golf.webp", name: "Golf Grubu",  participants: "21"},
    {image: "./images/GRUPCHAT.png", name: "AÜ YAZILIM 3.SINIF",  participants: "33"}
]

const groupsListProfile = document.getElementById('groups-list-profile');

groupsData.forEach(group => {
    const li = document.createElement('li');
    li.classList.add('group-item');
    li.innerHTML= `<div class="group-image-profile">
    <img src="${group.image}" alt="imagenotfound">
    </div>
    
    <div class="group-informations">
    <strong>${group.name}</strong>
    <br>
    <p>${group.participants} Katılımcı</p>
    </div>
    `;

   groupsListProfile.appendChild(li);
});
