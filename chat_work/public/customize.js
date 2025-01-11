const themeColor = document.getElementById('theme');

themeColor.addEventListener('change', () => {

    const barContainer = document.querySelector('.bar-container');
    const chatHeader = document.querySelector('.chat-header');
    const containerText = document.querySelector('.container-text');

    const contactItem = document.querySelectorAll('.contact-item');

    const selectedValue = themeColor.value;

    switch (selectedValue) {
        case '1':

            contacts.style.backgroundColor = "#fff";
            barContainer.style.backgroundColor = "#fff";
            chatHeader.style.backgroundColor = "#fff";
            containerText.style.backgroundColor = "#fff";
            break;
        case '2':

            contacts.style.backgroundColor = "#2F445C";
            barContainer.style.backgroundColor = "#2F445C";
            chatHeader.style.backgroundColor = "#2F445C";
            containerText.style.backgroundColor = "#2F445C";

            contactItem.style.backgroundColor = "red";
            break;
    }
});
