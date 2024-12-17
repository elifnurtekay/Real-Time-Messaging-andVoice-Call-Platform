const dataimage = [
    { image: "./images/island.webp"},
    { image: "./images/golf.webp"},
    { image: "./images/jacob.jpg"},
    { image: "./images/effrey.webp"},
    { image: "./images/view.avif"},
    { image: "./images/mark.webp"},
    { image: "./images/island.webp"},
    { image: "./images/golf.webp"},
    { image: "./images/jacob.jpg"},
    { image: "./images/effrey.webp"},
    { image: "./images/view.avif"},
    { image: "./images/mark.webp"},
    { image: "./images/island.webp"},
    { image: "./images/golf.webp"},
    { image: "./images/jacob.jpg"},
    { image: "./images/effrey.webp"},
    { image: "./images/view.avif"},
    { image: "./images/mark.webp"},
]

const mediasList = document.getElementById('medias-list');

dataimage.forEach(data => {
    const li = document.createElement('li');
    li.classList.add('media-item');
    li.innerHTML = `
    <img class="media-content" src="${data.image}" onclick="handleImageClick(this)" alt="filenotfound">
    `;

    mediasList.appendChild(li);
});
