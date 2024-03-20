// Javascript Ecmascript 6 scrict mode
"use strict";

// DOM ELEMENTS
const elForm = document.querySelector(".js-books-form");
const elBooksList = document.querySelector(".js-books-list");
const elBookmarkBtn = document.querySelector(".js-bookark-btn");
const elBookTemp = document.querySelector(".js-book-temp").content;
const elBookmarkTemp = document.querySelector(".js-bookmarked-data").content;
const elBookmarksCount = document.querySelector(".js-bookmark-count");
const elOverlayBar = document.querySelector(".js-overlay-bar")
const elSidebar = document.querySelector(".js-hero-sidebar")
const elCloseSidebar = document.querySelector(".js-sidebar-close")
const elSidebarList = document.querySelector(".hero__sidebar-list")

// Bookmark array
const bookmarks = window.localStorage.getItem("bookmarks") ? JSON.parse(window.localStorage.getItem("bookmarks")) : [];

// Countries array
let counrties = [];

// To check count bookmarks array length
const handleIncludeCountBookmarks = () => {
    if (!bookmarks.length) {
        elBookmarksCount.classList.add("remove");
    } else {
      elBookmarksCount.classList.remove("remove");
      elBookmarksCount.textContent = bookmarks.length
    }
};

// Render books
function handleRenderBooks(arr, regex = "", searchregex = "") {
  const booksDocFragment = document.createDocumentFragment();
  elBooksList.innerHTML = null;
  arr.forEach((item) => {
    const cloneBooks = elBookTemp.cloneNode(true);

    if(searchregex.source !== "(?:)" && searchregex){
      cloneBooks.querySelector(".js-book-name").innerHTML = item.title.replace(searchregex, math => `<mark>${math}</mark>`  )
    }else{
      cloneBooks.querySelector(".js-book-name").textContent = item.title;
    }

    if(regex.source !== "(?:)" && regex){
      cloneBooks.querySelector(".js-book-avtor").innerHTML = item.author.replace(regex, match => `<mark class="mark">${match}</mark>` )
    }else{
      cloneBooks.querySelector(".js-book-avtor").textContent = item.author;
    }

    cloneBooks.querySelector(".js-book-image").src =
      "../assets/" + item.imageLink;
    cloneBooks.querySelector(".js-book-year").textContent = item.year;
    cloneBooks.querySelector(".js-book-pages").textContent = item.pages;
    cloneBooks.querySelector(".js-book-language").textContent = item.language;
    cloneBooks.querySelector(".js-book-language").textContent = item.language;
    cloneBooks.querySelector(".js-wiki-link").href = item.link;
    cloneBooks.querySelector(".js-bookmark-btn").dataset.id = item.link
    if(bookmarks?.some((book) => book.link == item.link )){
        cloneBooks.querySelector(".js-bookmark-btn").textContent = "Bookmarked"    
    }else{
        cloneBooks.querySelector(".js-bookmark-btn").textContent = "Add Bookmark"
    }
    booksDocFragment.appendChild(cloneBooks);
  });
  elBooksList.appendChild(booksDocFragment);
}

// Render bookmarks
const handleRenderBookmark = (arr) => {
    const bookmarkDocFragment = document.createDocumentFragment();
    elSidebarList.innerHTML = ''
    arr.forEach((item) => {
        const cloneBook = elBookmarkTemp.cloneNode(true)
        cloneBook.querySelector(".js-book-image").src = "../assets/" + item.imageLink
        cloneBook.querySelector(".js-book-name").textContent = item.title.split(" ").slice(0, 2).join(" ").concat("...");
        cloneBook.querySelector(".js-book-avtor").textContent = item.author.split(" ").slice(0, 2).join(" ").concat("...");
        cloneBook.querySelector(".js-book-del").dataset.deleteId = item.link;
        bookmarkDocFragment.appendChild(cloneBook)
    })
    elSidebarList.appendChild(bookmarkDocFragment)
}

// Filter category unique
const handleFilterCountry = (arr) => {
  for (const book of arr) {
    if (!counrties.includes(book.country)) {
      counrties.push(book.country);
    }
  }
  counrties.sort();
};

// Create Option function
const handleCreateOption = () => {
  counrties.forEach((countrie) => {
    const newOption = document.createElement("option");
    newOption.textContent = countrie;
    newOption.value = countrie;
    country.appendChild(newOption);
  });
};


// Search function
const handleSub = (evt) => {
  evt.preventDefault();
  const regex = new RegExp(search.value, "gi");
  const auterRegEx = new RegExp(author.value, "gi");
  console.log(auterRegEx);
  
  const filter = books.filter((item) => {
    return (
      (search.value == "" || item.title.match(regex)) && 
      (year.value == "" || year.value == item.year) &&
      (author.value == "" || item.author.match(auterRegEx)) &&
      (country.value == "all" || item.country == country.value) &&
      (min.value == "" || item.year >= min.value) &&
      (max.value == "" || item.year <= max.value)
      );
      
    });
    if (filter.length) {
        if(sort.value == "a-z"){
            filter.sort((a, b) => {
                if(a.title.toLowerCase().charCodeAt(0) < b.title.toLowerCase().charCodeAt(0)) return -1
                else return 1
            })
            console.log("ishladi")
        }else if(sort.value == "z-a"){
            filter.sort((a, b) => {
                if(a.title.toLowerCase().charCodeAt(0) > b.title.toLowerCase().charCodeAt(0)) return -1
                else return 1
            })
        }
        if(sort.value === "new-old"){
          filter.sort((a, b) => b.year - a.year)
        }
        if(sort.value === "old-new"){
          filter.sort((a, b) => b.year - a.year)
        }
        if(sort.value === "lot-less"){
          filter.sort((a, b) => b.pages - a.pages)
        }
        if(sort.value === "less-lot"){
          filter.sort((a, b) => a.pages - b.pages)
        }
        handleRenderBooks(filter, auterRegEx, regex) 
    }
};
elForm.addEventListener("submit", handleSub);


// Add bookmark and Delete bookmark function
const handleClick = (evt) => {
    if(evt.target.matches(".js-bookmark-btn")){
        const id = evt.target.dataset.id
        if(bookmarks?.some((item) => item.link == id)){
            evt.target.textContent = "Add Bookmark"
            let idx = bookmarks?.findIndex((item) => item.link == id)
            bookmarks.splice(idx, 1);
            window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks, 4, null))
        }else{
            const find = books.find((item) => item.link == id)
            bookmarks.push(find)
            evt.target.textContent = "Bookmarked"
            window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks, 4, null))
        }
        handleRenderBookmark(bookmarks)
        handleIncludeCountBookmarks()
    }
}
elBooksList.addEventListener("click", handleClick)



// Sidebar Active function

elBookmarkBtn.addEventListener("click", () => {
    elOverlayBar.classList.add("active_bar")
    elSidebar.classList.add("active-sidebar")
})

// Sidebar No Active function
elCloseSidebar.addEventListener("click", () => {
    setTimeout(() => {
        elOverlayBar.classList.remove("active_bar")
    }, 500)
    elSidebar.classList.remove("active-sidebar")
})

// Sidebar Delete book function
elSidebarList.addEventListener("click", (evt) => {
    if(evt.target.matches(".js-book-del")){
        const id = evt.target.dataset.deleteId
        let idx = bookmarks?.findIndex((item) => item.link == id)
        bookmarks.splice(idx, 1);
        window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks, 4, null))
        handleRenderBookmark(bookmarks)
        handleRenderBooks(books)
        handleIncludeCountBookmarks()
    }
})


handleRenderBooks(books);
handleFilterCountry(books);
handleCreateOption();
handleIncludeCountBookmarks();
handleRenderBookmark(bookmarks)