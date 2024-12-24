const chatHeader = document.querySelector('.profile-summary-click');
const profileSummary = document.querySelector('.profile-summary');
const profileSum = document.getElementById('profile-sum');

// Profil özetini açmak için
chatHeader.addEventListener('click', (event) => {
    profileSum.classList.toggle('show'); // Profil özeti görünürlüğünü toggle eder
    event.stopPropagation(); // Üst öğelere yayılmayı engeller
});

// Profil özetini sadece profile-summary dışında bir yere tıklayınca kapat
document.addEventListener('click', (event) => {
    // Eğer tıklanan yer profile-summary dışında bir yerse
    if (!profileSummary.contains(event.target) && !chatHeader.contains(event.target)) {
        // Profil özetini kapat
        setTimeout(() => {
            profileSum.classList.remove('show');
        }, 0);
    }
});
