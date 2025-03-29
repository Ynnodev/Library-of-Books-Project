import { Library } from "./library.js";

export class UserLibrary extends Library {
    constructor(username){
        super();
        this.username = username;
        this.myBooks = JSON.parse(localStorage.getItem(`${this.username}_books`)) || {};
        this.favoriteBooks = JSON.parse(localStorage.getItem(`${this.username}_favoriteBooks`)) || {};
        this.favoriteGenres = JSON.parse(localStorage.getItem(`${this.username}_favoriteGenres`)) || {};
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
                    localStorage.setItem(`${this.username}_books`, JSON.stringify(this.books));
                    resolve(`${this.username} just borrowed: ${book.title}`);
                    this.showMyBooks();
                }else{
                    reject("Sorry, no available copies");
                }
            }, 2000)
        })
    }

    returnFromMain(bookTitle){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = Object.values(this.myBooks).find(curr => curr.title.trim().toLowerCase().includes(bookTitle.trim().toLowerCase()));
                if (!book) reject(`Couldn't find ${bookTitle}!`);
                else{
                    const isbn = Object.keys(this.myBooks).find(key => this.myBooks[key] === book);
                    const mainBook = this.books[isbn];
                    delete this.myBooks[isbn];
                    localStorage.setItem(`${this.username}_books`, JSON.stringify(this.myBooks));
                    resolve(`${this.username} returned: "${book.title}"`);
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

    addToFavorites(bookTitle){
        const book = Object.values(this.books).find(curr => curr.title.trim().toLowerCase().includes(bookTitle.trim().toLowerCase()));

        if (!book) return `No books available`;
        const isbn = Object.keys(this.books).find(key => this.books[key] === book);
        this.favoriteBooks[isbn] = { ...book };
        localStorage.setItem(`${this.username}_favorites`, JSON.stringify(this.favoriteBooks));
        return `${this.username} added ${book.title} to favorites!`;
    }

    showFavorites(){
        const favorites = Object.values(this.favoriteBooks);
        if (!favorites.length){
            console.log("No favorite books!");
            return;
        }

        if (bookList.children) bookList.replaceChildren("")
        favorites.forEach(book => {
            const li = document.createElement("li");
            li.textContent = `${book.title} by ${book.author}`
            bookList.appendChild(li);
        })
    }

    removeFromFavorites(bookTitle){
        const book = Object.values(this.books).find(book => book.title.trim().toLowerCase().includes(bookTitle.trim().toLowerCase()));
        if (!book) console.log("Couldn't find the book!");
        const isbn = Object.keys(this.books).find(key => this.books[key] === book);
        if (!this.favoriteBooks[isbn]) console.log("Couldn't find the book");
        delete this.favoriteBooks[isbn];
        localStorage.setItem(`${this.username}_favorites`, JSON.stringify(this.favoriteBooks));
        return `${book.title} by ${book.author} removed from ${this.username}'s favorites!`;
    }
}