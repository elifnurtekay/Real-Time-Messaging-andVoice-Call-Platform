const linksData = [
    {image: "./images/link.png", name: "SheduleX.pdf", hyperlink: "www.github.com"},
    {image: "./images/link.png", name: "Nonsense.pdf",  hyperlink: "www.github.com"},
    {image: "./images/link.png", name: "Whatsapp.pdf",  hyperlink: "www.github.com"},
    {image: "./images/link.png", name: "Facebook.pdf",  hyperlink: "Microsoft Edge Excel Document"},
    {image: "./images/link.png", name: "GroupProject.pdf",  hyperlink: "Microsoft Edge PDF Document"},
    {image: "./images/link.png", name: "Ekampus.pdf",  hyperlink: "Microsoft Edge PDF Document"},
    {image: "./images/link.png", name: "Metalnomere.pdf",  hyperlink: "Microsoft Edge Word Document"},
    {image: "./images/link.png", name: "Diolddy.pdf",  hyperlink: "Microsoft Edge PDF Document"}
]

const linksList = document.getElementById('links-list');

linksData.forEach(link => {
    const li = document.createElement('li');
    li.classList.add('link-item');
    li.innerHTML= `<div class="link-image">
    <img  src="${link.image}" alt="imagenotfound">
    </div>
    
    <div class="link-informations">
    ${link.name}
    <br>
    <p>${link.hyperlink}</p>
    </div>
    `;

   linksList.appendChild(li);
});
