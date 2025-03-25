export class Library {
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