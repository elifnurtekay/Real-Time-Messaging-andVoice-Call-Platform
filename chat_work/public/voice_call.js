const muteButton = document.getElementById('mute-button');
const displayContainer = document.querySelector('.call-display');

const callButton = document.getElementById('voice-call-button');

const dataVoiceCall = [
    { name: "Umut Çağatay", surname: "Tapur", image: "images/no-person.jpg" }
]

muteButton.addEventListener("click", function () {
    const icon = this.querySelector("i");
    if (icon.classList.contains("fa-microphone")) {
      icon.classList.remove("fa-microphone");
      icon.classList.add("fa-microphone-slash");
    } else {
      icon.classList.remove("fa-microphone-slash");
      icon.classList.add("fa-microphone");
    }
})

displayContainer.innerHTML = `
   <div class="profile-offer">
    <img src="${dataVoiceCall[0].image}" alt="Profile Image" class="profile-img-offer">
    <div class="profile-info-offer">
        <p class="name-offer">${dataVoiceCall[0].name} ${dataVoiceCall[0].surname}</p>
    </div>
    <div class="stopwatch">
    <p id="timer">00:00</p>
</div>
</div>

`;
