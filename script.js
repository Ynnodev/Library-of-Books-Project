//Library of books:
const searchBar = document.getElementById("searchBar");
const testDiv = document.getElementById("testDiv");
const bookList = document.getElementById("bookList");
const addBookBtn = document.getElementById("setBook");
const addBookModal = document.getElementById("addBookModal");
const sendBookBrn = document.getElementById("sendBook");
const borrowBookBtn = document.getElementById("borrowBookBtn");
//Let scope varaibles:
let isBorrowing = false;

searchBar.addEventListener('keypress', (e) => {
    if (e.key === "Enter"){ //TO FINISH:
        if (isBorrowing === false){
            const searchTxt = searchBar.value;
            searchBook(searchTxt);
        }else{
            const query = searchBar.value;
            borrowBook(query)
                .then(result => console.log(result))
                .catch(error => console.log(error))
        }
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
    isBorrowing = !isBorrowing;

    if (isBorrowing){
        searchBar.focus()
        searchBar.setAttribute('placeholder', `Type in the name of the book you wanna borrow!`);

    }else{
        searchBar.setAttribute('placeholder', `Type in a Book's Title!`);
        searchBar.style.backgroundColor = `white`
    }
});

const libraryBooks = {
    books: {
        "978-0143127741": {title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, rating: 10, genre: "Romance", availableCopies: 4, available: true},
        "978-0143127742": {title: "The Pragmatic Programmer", author: "Andy Hunt", year: 1999, rating: 9.3, genre: "Computer", availableCopies: 5, available: true}
    },

    addBooks(isbn, title, author, year, rating, genre, availableCopies, available){
        if (this.books.hasOwnProperty(isbn)){
            console.log("Book already exists");
            return;
        }

        this.books[isbn] = { title, author, year, rating, genre, availableCopies, available }
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
        const bookObj = Object.values(this.books).find(book => book.title.toLowerCase().includes(title.toLowerCase()));

        if (bookObj && bookObj.availableCopies === 0 && bookObj.available){
            bookObj.available = false;
            console.log("Congratulationsm you've reserved a book!");
        }else{
            console.log("The books exists or is already reserved.");
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
    });
}

function borrowBook(bookTitle){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true;
            const book = Object.values(libraryBooks.books).find(book => book.title.toLowerCase().includes(bookTitle));

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