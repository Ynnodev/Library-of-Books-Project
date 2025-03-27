import { Library } from "./library.js";
import { UserLibrary } from "./userLibrary.js";

//Library of books:
const searchBar = document.getElementById("searchBar");
const testDiv = document.getElementById("testDiv");
const bookList = document.getElementById("bookList");
const addBookBtn = document.getElementById("setBook");
const addBookModal = document.getElementById("addBookModal");
const sendBookBrn = document.getElementById("sendBook");
const borrowBookBtn = document.getElementById("borrowBookBtn");
const suggestRandomBookBtn = document.getElementById("suggestRandomBook");
const findAuthorBtn = document.getElementById("findAuthorBtn");
const suggestByGenreBtn = document.getElementById("suggestByGenreBtn");
const userBorrowBookBtn = document.getElementById("userBorrowBookBtn");
const returnFromMyBooks = document.getElementById("returnFromMyBooks");
//Let scope varaibles:
let isBorrowing = false;
let suggestByGenreActvt = false;

searchBar.addEventListener('keypress', async (e) => {
    if (e.key === "Enter" && isBorrowing){
        try {
            const result = await mainLibrary.borrowBook(searchBar.value);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }
    
    if (e.key === "Enter" && suggestByGenreActvt){
        const searchLi = document.createElement("li");
        searchLi.textContent = `Searching...`
        try {
            if (bookList.children){
                bookList.replaceChildren("");
            }

            bookList.appendChild(searchLi);
            const results = await mainLibrary.suggestByGenre(searchBar.value);
            searchLi.style.display = `none`;

            results.forEach((result, i) => {
                const li = document.createElement("li");
                li.textContent = `Suggestion: ${result.title} (${result.genre})`;
                bookList.appendChild(li);
            })
        } catch (error) {
            searchLi.style.display = `none`;
            const li = document.createElement("li");
            li.textContent = `Error: ${error}`;
            bookList.appendChild(li);
            console.log(`Error: ${error}`);
        }
    }

    if (e.key === "Enter" && !isBorrowing){
        mainLibrary.searchBook(searchBar.value);
    }
});

addBookBtn.addEventListener('click', function(){
    addBookModal.showModal();
});

sendBookBrn.addEventListener('click', function(){
    const addBookForm = document.getElementById("addBookForm");
    const isbn = toString(document.getElementById("isbnBookInput").value);
    const bookTitle = toString(document.getElementById("titleBookInput").value);
    const bookAuthor = toString(document.getElementById("authorBookInput").value);
    const bookYear = parseInt(document.getElementById("yearBookInput").value);
    const bookRating = parseFloat(document.getElementById("ratingBookInput").value);
    const bookGenre = toString(document.getElementById("genreBookInput").value);
    const bookAV = parseInt(document.getElementById("acBookInput").value);

    //ERROR: The books isn't being added to the books object.
    mainLibrary.addBooks(isbn, bookTitle, bookAuthor, bookYear, bookRating, bookGenre, bookAV);
    console.log("Book added successfuly!", libraryBooks.books[isbn]);
    addBookModal.close();
    addBookForm.reset();
});

borrowBookBtn.addEventListener('click', function(){
    isBorrowing = !isBorrowing;

    if (isBorrowing){
        searchBar.focus()
        searchBar.setAttribute('placeholder', `Type in the name of the book you wanna borrow!`);

    }else{
        searchBar.setAttribute('placeholder', `Type in a Book's Title!`);
        searchBar.style.backgroundColor = `white`
    }
});

suggestRandomBookBtn.addEventListener('click', async function(){
    try {
        const suggestedBook = await mainLibrary.suggestRandomBook();
        const liElement = document.createElement("li");
        liElement.textContent = `Suggested Book: ${suggestedBook.title} by ${suggestedBook.author}`
        bookList.appendChild(liElement);
    } catch (error) {
        console.log("Couldn't do it");
    }
});

findAuthorBtn.addEventListener('click', async function(){
    const query = searchBar.value;
    if (!query){
        console.log("Type the book");
        return;
    };
    try {
        const bookTitle = Object.values(mainLibrary.books).find(book => book.title.toLowerCase().includes(query.toLowerCase()));
        const author = await mainLibrary.findAuthor(query);
        const li = document.createElement("li");
        li.textContent = `${bookTitle.title}'s author is: ${author}`
        bookList.appendChild(li);
    } catch (error) {
        console.log("Error: ", error);
    }
});

suggestByGenreBtn.addEventListener('click', function(){
    suggestByGenreActvt = !suggestByGenreActvt;
    if (suggestByGenreActvt){
        searchBar.setAttribute('placeholder', "Type in a book genre, please!");
    }else{
        searchBar.setAttribute('placeholder', "Type a Book's Title!");
    }
    console.log(suggestByGenreActvt);
});

const mainLibrary = new Library();

mainLibrary.addBooks("978-1234567890", "Test Book", "John Doe", 2020, 8.5, "Fiction", 3);
mainLibrary.addBooks("978-1234567891", "The Pragmatic Programmer 2", "Andrew Hunt", 2025, 9.5, "Computer", 6);

const aliceLibrary = new UserLibrary("Alice");

userBorrowBookBtn.addEventListener('click', async function(){
    const title = searchBar.value.trim();
    try {
        const result = await aliceLibrary.borrowFromMain(title)
        const li = document.createElement("li");
        li.textContent = `${result}`
        bookList.appendChild(li);
    } catch (error) {
        console.log("Error: ", error);
    }
});

returnFromMyBooks.addEventListener('click', async function(){
    if (bookList.children) bookList.replaceChildren("");
    const title = searchBar.value.trim();
    const result = await aliceLibrary.returnFromMain(title);
    
    const li = document.createElement("li");
    li.textContent = `${result}`
    bookList.appendChild(li);
})

aliceLibrary.addToFavorites("To Kill a Mockingbird")
aliceLibrary.addToFavorites("The Pragmatic Programmer");