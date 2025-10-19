// blog.js - Kids Read for Fun

const books = [
  {
    title: "Septimus Heap Book One: Magyk",
    date: "July 5, 2022",
    age: "10-14",
    genre: "Fantasy",
    rating: "★★★★",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4b/MagykCover.jpg",
    description:
      "A young boy discovers his magical heritage and embarks on a journey full of mystery, danger, and destiny."
  },
  {
    title: "Percy Jackson: The Lightning Thief",
    date: "June 1, 2022",
    age: "10-14",
    genre: "Adventure",
    rating: "★★★★★",
    image: "https://upload.wikimedia.org/wikipedia/en/6/63/Percy_Jackson_and_the_Olympians_-_The_Lightning_Thief_cover.jpg",
    description:
      "Percy discovers he is a demigod and must prevent a war among the gods by recovering Zeus’s stolen lightning bolt."
  }
];

const articlesContainer = document.querySelector(".articles");

books.forEach(book => {
  const article = document.createElement("article");

  const details = document.createElement("div");
  details.classList.add("details");
  details.innerHTML = `
    <p>${book.date}</p>
    <p>${book.age}</p>
    <p>${book.genre}</p>
    <p class="rating">${book.rating}</p>
  `;

  const content = document.createElement("div");
  content.classList.add("content");
  content.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.image}" alt="Cover of ${book.title}">
    <p>${book.description}</p>
  `;

  article.appendChild(details);
  article.appendChild(content);
  articlesContainer.appendChild(article);
});
