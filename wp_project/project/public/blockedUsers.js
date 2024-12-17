document.addEventListener("DOMContentLoaded", function() {
    const data = [
        {name: "Umut Çağatay", surname: "Tapur", username: "umutcty", email: "tapur601@gmail.com", image:"https://via.placeholder.com/50"},
        {name: "Ali", surname: "Tapur", username: "umutcty", email: "tapur601@gmail.com", image:"https://via.placeholder.com/50"},
        {name: "Veli", surname: "Tapur", username: "umutcty", email: "tapur601@gmail.com", image:"https://via.placeholder.com/50"}
    ]
    
    const blockedUsers = document.getElementById("blocked-users");
    
    data.forEach(person => {
        const personInfo = `<img src="${person.image}" class="blocked-image">
        <div class="person-info">
        <strong class = "blocked-name">${person.name} ${person.surname}</strong>
         <p class = "blocked-username">Username: ${person.username}</p>
         <p class = "blocked-email">Email: ${person.email}</p>
         <input type="button" value="Engeli Kaldır" class="remove-block-button">
         </div>
         `
         ;
        blockedUsers.innerHTML += personInfo;
    })
    
});
