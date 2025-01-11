import { socket } from "./socketListener.js";

document.querySelector(".responsive").addEventListener("click", function(event) {
    event.preventDefault(); // Linkin varsayılan davranışını durdur
    event.stopPropagation(); // Olayın yayılmasını durdur
    const barcontainer = document.querySelector('.bar-container'); // Bar container
    // Öğenin gerçek 'display' stilini almak için getComputedStyle kullanıyoruz
    const displayStyle = window.getComputedStyle(barcontainer).display;
    
    if (displayStyle === "block") {
        barcontainer.style.display = "none"; // Ekrandan gizle
        adjustWidth();
    } else {
        barcontainer.style.display = "block"; // Görünür yap
        adjustWidth();
    }
});

function adjustWidth() {
    const element = document.querySelector('.container-text'); // Genişliğini ayarlamak istediğiniz elemanın sınıfı
    const element2 = document.querySelector('.emoji-container'); // Genişliğini ayarlamak istediğiniz elemanın sınıfı
    const element3 = document.querySelector('.chat-header'); // Genişliğini ayarlamak istediğiniz elemanın sınıfı
    const element4 = document.querySelector('.chat-messages'); // Genişliğini ayarlamak istediğiniz elemanın sınıfı
    const element5 = document.querySelector(".call-information");
    const navbar = document.querySelector("nav"); // Navbar genişliği
    const barcontainer = document.querySelector('.bar-container'); // Bar container genişliği
    const newWidth = window.innerWidth - navbar.offsetWidth - barcontainer.offsetWidth; // Uygun genişliği hesapla

    // Genişlik 0'dan küçük olamaz
    const finalWidth = Math.max(newWidth, 0);

    // Elemanların genişliğini ayarla
    element.style.width = finalWidth + "px";
    element2.style.width = finalWidth + "px";
    element3.style.width = finalWidth + "px";
    element4.style.width = finalWidth + "px";
    element4.style.paddingLeft = 5 + "px";
    element5.style.width = finalWidth + "px";
}   

// Sayfa yüklendiğinde ve pencere boyutu değiştiğinde fonksiyonu çağır
window.addEventListener('DOMContentLoaded', adjustWidth);
window.addEventListener('resize', adjustWidth);

function adjustBarContainerPadding() {
    const nav = document.querySelector('.nav');
    const barContainer = document.querySelector('.bar-container');

    // Eğer nav varsa ve bar-container varsa
    if (nav && barContainer) {
        const navWidth = nav.offsetWidth; // Nav genişliğini al
        barContainer.style.left = `${navWidth}px`; // Bar-container'ın padding-left'ini ayarla
       
    }
}

window.addEventListener('load', adjustBarContainerPadding);
window.addEventListener('resize', adjustBarContainerPadding);

document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('click', function(event) {
        
        if (event.target && event.target.matches('.logout-button')) {
            socket.emit('logout', { socketId: socket.id });
        }
    });

});
