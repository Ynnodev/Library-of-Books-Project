//Library of books:
const searchBar = document.getElementById("searchBar");
const testDiv = document.getElementById("testDiv");
const bookList = document.getElementById("bookList");
const addBookBtn = document.getElementById("setBook");
const addBookModal = document.getElementById("addBookModal");
const sendBookBrn = document.getElementById("sendBook");
const borrowBookBtn = document.getElementById("borrowBookBtn");

searchBar.addEventListener('keypress', (e) => {
    if (e.key === "Enter"){ //TO FINISH:
        const searchTxt = searchBar.value;
        searchBook(searchTxt);
    }
});

addBookBtn.addEventListener('click', function(){
    addBookModal.showModal();
});

sendBookBrn.addEventListener('click', function(){
    const addBookForm = document.getElementById("addBookForm");
    const isbn = document.getElementById("isbnBookInput").value;
    const bookTitle = document.getElementById("titleBookInput").value;
    const bookAuthor = document.getElementById("authorBookInput").value;
    const bookYear = parseInt(document.getElementById("yearBookInput").value);
    const bookRating = parseFloat(document.getElementById("ratingBookInput").value);
    const bookGenre = document.getElementById("genreBookInput").value;
    const bookAV = parseInt(document.getElementById("acBookInput").value);

    if (!isbn || !bookTitle || !bookAuthor || isNaN(bookYear) || isNaN(bookRating) || !bookGenre || isNaN(bookAV)){
        console.log("Please, fulfill all the inputs!");
        return;
    }

    //ERROR: The books isn't being added to the books object.
    libraryBooks.addBooks(isbn, bookTitle, bookAuthor, bookYear, bookRating, bookGenre, bookAV);
    console.log("Book added successfuly!");
    addBookForm.reset();
});

borrowBookBtn.addEventListener('click', function(){

});

const libraryBooks = {
    books: {
        "978-0143127741": {title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, rating: 10, genre: "Romance", availableCopies: 4},
        "978-0143127742": {title: "The Pragmatic Programmer", author: "Andy Hunt", year: 1999, rating: 9.3, genre: "Computer", availableCopies: 5}
    },

    addBooks(isbn, title, author, year, rating, genre, availableCopies){
        if (this.books.hasOwnProperty(isbn)){
            console.log("Book already exists");
            return;
        }

        this.books[isbn] = { title, author, year, rating, genre, availableCopies }
    },
    listBooks(){
        console.log("Book Library: ");
        console.log(Object.entries(this.books));
    },
    searchBook(query){
        const results = Object.keys(this.books).filter(isbn => {
            const book = this.books[isbn];
            return book.title.trim().toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase())
        });

        if (results.length === 0){
            console.log("Sorry, no books found!");
            return;
        }

        console.log(`Results for the query: ${query}`);
        results.forEach(isbn => {
            const book = this.books[isbn];
            console.log(`${book.title} by ${book.author}`);
        });
    },
    returnBook(title){
        const bookObj = Object.values(this.books).find(book => book.title === title);

        if (bookObj){
            bookObj.availableCopies++;
            console.log("Book returned successfully!");
        }else{
            console.log(`"${title}" doesn't exist!`);
        }
    },
    reserveBooks(title){
        const bookObj = Object.values(this.books).find(book => book.title === title);

        if (bookObj && bookObj.availableCopies === 0){
            if (!bookObj.reserved){
                bookObj.reserved = true;
                console.log(`You've reserved the book ${title}. We'll notify you when the book is available`);
            }
        }else{
            console.log("The book is available or doesn't exist!!!");
        }
    },
    filterBooksByGenre(genre){
        if (typeof genre !== "string" || genre.trim() === ""){
            console.log("Incorrect genre or not a string!");
            return;
        }

        const results = Object.values(this.books).filter(book => book.genre === genre);

        results.forEach(book => console.log(`${book.title} by ${book.author}`));
    },
    getTopRatedBooks(rating){
        if (isNaN(rating) || rating < 0 || rating > 10){
            console.log("Not a number or invalid rating!");
            return;
        }

        console.log
        const books = Object.values(this.books).filter(book => book.rating >= rating);

        if (books.length === 0){
            console.log("Sorry, but no books meet the criteria!");
            return;
        }

        books.forEach(book => console.log(`${book.title} by ${book.author} - Rating: ${book.rating}`));
    }
}

//functions
function searchBook(search){
    search = search.trim().toLowerCase();

    if (search.length === 0){
        console.log("Type something!");
        return;
    }

    const results = Object.values(libraryBooks.books).filter(book => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search));

    results.forEach(book => {
        const newElement = document.createElement("li");
        newElement.textContent = `${book.title} by ${book.author}`;
        bookList.appendChild(newElement);
    })
}

function borrowBook(bookTitle){
    return new Promise((resolve, reject) => { //Promise ready, but I gotta still call it on the code.
        setTimeout(() => {
            const success = true;
            const book = Object.values(libraryBooks.books).filter(book => book.title.includes(bookTitle));

            if (!book){
                reject("Book not found");
                return;
            }

            if (success && book.availableCopies > 0){
                book.availableCopies--;
                resolve(`Congratulations! The book ${bookTitle} by ${book.author} was borrowed!`);
            }else{
                reject(`Sorry, but the book couldn't be borrowed`);
            }
        }, 2000);
    });
}

libraryBooks.addBooks("978-8888888888", "1984", "George Orwell", 1949, 9.5);
console.log(libraryBooks.books);