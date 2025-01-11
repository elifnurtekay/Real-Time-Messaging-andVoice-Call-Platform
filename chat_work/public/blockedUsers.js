async function getBlockedUsers() {
    const response = await fetch('api/users/blocked', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        console.error("Engellenen kullanıcılar alınamadı.");
        return null;
    }
    
    const data = await response.json();
    return data.blockedUsers;
}

document.addEventListener("DOMContentLoaded", async function() {
    
    const blockedUserList = document.getElementById("blocked-users");
    const blockedUsers = await getBlockedUsers();

    blockedUsers.forEach(user => {
        // IMAGE
        const personInfo = `<img src="./images/no-person.jpg" class="blocked-image">
        <div class="person-info">
        <strong class = "blocked-name">${user.name_}</strong>
         <p class = "blocked-username">Username: ${user.username}</p>
         <p class = "blocked-email">Email: ${user.email}</p>
         <input type="button" value="Engeli Kaldır" class="remove-block-button">
         </div>
         `
         ;
        blockedUserList.innerHTML += personInfo;
    });
    
});
