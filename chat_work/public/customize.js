const themeColor = document.getElementById('theme');

themeColor.addEventListener('change', () => {

    const barContainer = document.querySelector('.bar-container');
    const chatHeader = document.querySelector('.chat-header');
    const containerText = document.querySelector('.container-text');
    const contactItem = document.querySelectorAll('.contact-item');
    const selectedValue = themeColor.value;

    switch (selectedValue) {
        case '1':
            barContainer.style.backgroundColor = "#fff";
            chatHeader.style.backgroundColor = "#fff";
            containerText.style.backgroundColor = "#fff";
            contactItem[0].style.backgroundColor = "#fff";
            break;
        case '2':
            barContainer.style.backgroundColor = "#2F445C";
            chatHeader.style.backgroundColor = "#2F445C";
            containerText.style.backgroundColor = "#2F445C";
            contactItem[0].style.backgroundColor = "red";
            break;
    }
});
