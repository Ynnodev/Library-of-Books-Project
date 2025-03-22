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

class Library {
    constructor(){
        this.books = {
            "978-0143127741": {title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, rating: 10, genre: "Romance", availableCopies: 4, available: true},
            "978-0143127742": {title: "The Pragmatic Programmer", author: "Andy Hunt", year: 1999, rating: 9.3, genre: "Computer", availableCopies: 5, available: true}
        }
    }

    addBooks(isbn, title, author, year, rating, genre, availableCopies, available = true){
        if (this.books.hasOwnProperty(isbn)){
            console.log("Book already exists");
            return;
        }

        this.books[isbn] = { title, author, year, rating, genre, availableCopies, available }
    }

    listBooks(){
        console.log("Book Library: ");
        console.log(Object.entries(this.books));
    }

    returnBook(title){
        const bookObj = Object.values(this.books).find(book => book.title === title);

        if (bookObj){
            bookObj.availableCopies++;
            console.log("Book returned successfully!");
        }else{
            console.log(`"${title}" doesn't exist!`);
        }
    }

    reserveBooks(title){
        const bookObj = Object.values(this.books).find(book => book.title.toLowerCase().includes(title.toLowerCase()));

        if (bookObj && bookObj.availableCopies === 0 && bookObj.available){
            bookObj.available = false;
            console.log("Congratulations you've reserved a book!");
        }else{
            console.log("The books exists or is already reserved.");
        }
    }

    findAuthor(title){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const respectedBook = Object.values(this.books).find(book => book.title.toLowerCase().includes(title.toLowerCase()))

                if (!respectedBook) reject("Book's author not found")
                else resolve(respectedBook.author);
            }, 1000)
        })
    }

    filterBooksByGenre(genre){
        if (typeof genre !== "string" || genre.trim() === ""){
            console.log("Incorrect genre or not a string!");
            return;
        }

        return Object.values(this.books).reduce((acc, book) => {
            if (book.genre === genre) acc.push(`${book.title} by ${book.author}`);
            return acc;
        }, []).join("\n");
    }

    getTopRatedBooks(rating){
        if (isNaN(rating) || rating < 0 || rating > 10){
            console.log("Not a number or invalid rating!");
            return;
        }

        const books = Object.values(this.books).filter(book => book.rating >= rating);

        if (books.length === 0){
            console.log("Sorry, but no books meet the criteria!");
            return;
        }

        books.forEach(book => console.log(`${book.title} by ${book.author} - Rating: ${book.rating}`));
    }

    async borrowMultipleBooks(...titles){
        if (!titles.length || titles.some(t => typeof t !== "string")){
            console.log("Error!!");
            return;
        }

        try {
            const results = await Promise.all(titles.map(title => borrowBook(title.trim())));
            console.log("All books borrowed successfully: ", results);
        } catch (error) {
            console.log("Some books couldn't be borrowed: ", error);
        }
    }

    suggestRandomBook(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const allBooks = Object.values(this.books);
                const randomIndex = Math.floor(Math.random() * allBooks.length);
                const book = allBooks[randomIndex];

                if (allBooks.length === 0){
                    reject("Sorry, but there are no books available.");
                    return;
                }

                resolve(book);
            }, 2000)
        })
    }

    suggestByGenre(bookGenre){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const genreBooks = Object.values(this.books).filter(currB => currB.genre.trim().toLowerCase().includes(bookGenre.trim().toLowerCase()) && currB.availableCopies > 0);

                if (!genreBooks.length){
                    reject(`No books found in ${bookGenre}`);
                    return;
                }

                resolve(genreBooks);
            }, 2000);
        })
    }

    checkBookAvailable(book){//Call this method on the UI!
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const wishedBook = Object.values(this.books).find(thebook => thebook.title.toLowerCase().includes(book.toLowerCase()));
                if (!wishedBook || wishedBook.availableCopies === 0){
                    reject("Sorry, but this book doesn't exist or is not available!")
                }

                if (wishedBook && wishedBook.availableCopies > 1){
                    resolve(`The book ${wishedBook} by ${wishedBook.author} has ${wishedBook.availableCopies} available!`);
                }
            }, 2000);
        })
    }

    async borrowMultipleSettled(...titles){//Call this method on the UI!
        if (!titles.length || titles.some(t => typeof t !== "string")){
            console.log("No books identified or not strings!");
            return;
        }

        const results = await Promise.allSettled(titles.map(t => borrowBook(t.trim())));

        results.forEach((result, index) => {
            const li = document.createElement("li");
            if (result.status === "fulfilled"){
                li.textContent = `Borrowed: ${result.value}`;
            }else{
                li.textContent = `Failed to borrow: "${titles[index]}": ${result.reason}`
            }
            bookList.appendChild(li);
        });
    }

    rateBook(title, newRating){
        const book = Object.values(this.books).find(t => t.title.toLowerCase().includes(title.toLowerCase()));
        const Rating = parseFloat(newRating);
        if (!title || !newRating || typeof title !== "string" || isNaN(newRating) || newRating < 0 || newRating > 10){
            console.log("Error: Wrong values!");
            return;
        }

        if (!book){
            console.log("No book found");
            return;
        }

        book.rating = Rating;
        console.log("Book successfully rated!");
        return `You rated ${book} with ${Rating} successfully`;
    }

    async borrowAndRate(newRating, ...titles){//Call on the UI:
        try {
            if (!titles.length || titles.some(t => typeof t !== "string")){
                console.log("Something wrong!");
                return;
            }
            const results = await Promise.all(titles.map(t => borrowBook(t.trim())));
            const ratedResults = results.map((borrowMsg, i) => {
                this.rateBook(titles[i].trim(), parseFloat(newRating));
            })
    
            ratedResults.forEach(ratingResult => {
                console.log(rslt || "Error!");
                const li = document.createElement("li");
                li.textContent = `${results[i]} - ${ratingResult || "Rating failed"}`
                bookList.appendChild(li);
            })

        } catch (error) {
            const li = document.createElement("li");
            li.textContent = `Error: ${error}`
            bookList.appendChild(li);
            console.log("Error: ", error);
        }
    }

    borrowBook(bookTitle){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = true;
                const book = Object.values(this.books).find(book => book.title.toLowerCase().includes(bookTitle.toLowerCase()));
    
                if (!book){
                    reject("Book not found");
                    return;
                }
    
                if (success && book.availableCopies > 0){
                    book.availableCopies--;
                    book.borrowedDate = new Date();
                    const liElement = document.createElement("li");
                    liElement.textContent = `Congratulations, you've borrowed the book ${bookTitle} by ${book.author} at ${book.borrowedDate}`;
                    bookList.appendChild(liElement);
                    resolve(`Congratulations! The book ${book.title} by ${book.author} was borrowed at ${book.borrowedDate}!`);
                }else{
                    reject(`Sorry, no copies available`);
                }
            }, 2000);
        });
    }

    searchBook(search){
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
}

const mainLibrary = new Library();

class UserLibrary extends Library {
    constructor(username){
        super();
        this.username = username;
        this.myBooks = {}
    }

    borrowFromMain(bookTitle){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = Object.values(mainLibrary.books).find(curr => curr.title.trim().toLowerCase().includes(bookTitle.trim().toLowerCase()));

                if (!book) reject("Book not found");
                else if (book.availableCopies > 0){
                    book.availableCopies--;
                    const isbn = Object.keys(this.books).find(key => this.books[key] === book);
                    this.myBooks[isbn] = { ...book, borrowedDate: new Date() };
                    resolve(`${this.username} just borrowed: ${book.title}`);
                    this.showMyBooks();
                }else{
                    reject("Sorry, no available copies");
                }
            }, 2000)
        })
    }

    showMyBooks(){
        const books = Object.values(this.myBooks);
        if (bookList.children){
            bookList.replaceChildren("");
        }
        if (!books.length){
            const li = document.createElement("li");
            li.textContent = `You've got no books.`
            bookList.appendChild(li);
            return;
        }
        books.forEach(book => {
            const li = document.createElement("li");
            li.textContent = `${book.title} by ${book.author} - Borrowed: ${book.borrowedDate.toDateString()}`
            bookList.appendChild(li);
        })
    }
}

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
});//Main Issue: When refreshed, the books are not in .myBooks object anymore because they're not persistat, time to localStorage/indexedDB to jump in the game!