const fatherBook = document.querySelector(".books");

function createBookFn() {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book");
  bookDiv.setAttribute("data-name", "salomHammaga");

  const innerDiv = document.createElement("div");
  const img = document.createElement("img");
  img.src =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-xGh4mU2fwpcx5tXP_6BnNt2Fzl-dWsSAYQ&s";
  img.alt = "";
  const h3 = document.createElement("h3");
  h3.textContent = "name";
  innerDiv.appendChild(img);
  bookDiv.appendChild(innerDiv);
  bookDiv.appendChild(h3);
  fatherBook.appendChild(bookDiv);
}

document.addEventListener("DOMContentLoaded", () => {


  const books = document.querySelectorAll(".book");
  books.forEach((item) => {
    item.addEventListener("click", () => {
      console.log(item.dataset.name);
    });
  });
});
