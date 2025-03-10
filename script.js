const user = {
    name: "Pedro", //Property
    surname: "Igor", //Property
    age: 19, //Property
    role: "Programmer",
    isAdmin: true,
    greet(){ //Method
        console.log(`Hello, I'm ${this.name}!!`);
    }
}

const { name: RenamedName = "Guest", surname, age, role } = user;
const anotherObj = {
    city: "New York",
    state: "Massachusetts"
}

const person = {
    name: "MyName",
    age: "MyAge"
};

const allMerged = { ...person, ...anotherObj };

const newPerson = { ...person };

const mergedAgain = Object.assign({}, person, anotherObj);
console.log(mergedAgain);

user.name = "Sonic the Hedgehog";
delete user.surname;
console.log(user);

console.log(user.hasOwnProperty("name"));
console.log("age" in user);

for (let key in user){
    console.log(`${key}: ${user[key]}`);
}

console.log(Object.values(user));
console.log(Object.entries(user));
console.log(Object.keys(user));

const library = {
    name: "Name",
    books: [
        {
            title: "Idk",
            author: "Myself"
        }
    ],
    addBook(title, author){
        this.books.push({title, author})
    },
    listBooks(){
        for (key in this.books){
            console.log(`${this.books[key].title} by ${this.books[key].author}`);
        }
    }
}

library.addBook("1984", "George Orwell");
library.addBook("Beyond Good and Evil", "Michel Ancel");
library.listBooks();

const obj1 = { name: "Alice", surname: "Mary", details: { age: 19 } }
const obj2 = obj1;
const obj3 = structuredClone(obj1);

obj2.details.age = 25;
console.log(obj1);

const movie = {
    title: "Steven Universe: The Movie",
    director: "Rebecca Sugar",
    releaseYear: 2022,
    rating: 6,
    isGoodRating(){
        return console.log(this.rating >= 7);
    }
}

const { title, rating } = movie;
const withGenre = {...movie, genre: "Novel?"};
movie.isGoodRating();

//Library of books:

const libraryBooks = {
    books: {
        "978-0143127741": {title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, rating: 10, availableCopies: 4},
        "978-0143127742": {title: "The Pragmactic Programmer", author: "Andy Hunt", year: 1999, rating: 9.3, availableCopies: 5}
    },

    addBooks(isbn, title, author, year, rating, availableCopies){
        if (this.books.hasOwnProperty(isbn)){
            console.log("Book already exists");
            return;
        }

        this.books[isbn] = { title, author, year, rating, availableCopies }
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
    borrowBook(title){
        const bookObj = Object.values(this.books).find(book => book.title === title);

        if (bookObj && bookObj.availableCopies > 0){
            bookObj.availableCopies--;
            console.log(`You've borrowed the book ${title}!`);
        }else{
            console.log(`Sorry, no results for ${title}`);
        }
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
    }
}

libraryBooks.addBooks("978-8888888888", "1984", "George Orwell", 1949, 9.5);
libraryBooks.listBooks();