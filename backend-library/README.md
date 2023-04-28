GraphQL Part8a

<details>
<summary>

### $\color{cyan}{Dependecies}$

 </summary>

```
npm install @apollo/server graphql
```

start server :

```
node Exercise(8.X).js
```

Apollo server runs in development mode `http://localhost:4000`

This takes us to `Apollo Studio Explorer`

</details>

<details>
<summary>

### $\color{cyan}{Exercises}$

 </summary>

`8.1:` The number of books and authors

- Implement queries bookCount and authorCount which return the number of books and the number of authors.
  `8.2:` All books
- Implement query allBooks, which returns the details of all books.

`8.3:` All authors

- Implement query allAuthors, which returns the details of all authors. The response should include a field bookCount containing the number of books the author has written.

`8.4:` Books of an author

- Modify the allBooks query so that a user can give an optional parameter author. The response should include only books written by that author.

`8.5:` Books by genre

- Modify the allBooks query so that a user can give an optional parameter genre or genre and author.

Added only author as an option which will work similar to Exercise8.4

i) genre
ii) autor
iii) author and genre

`8.6:` Adding a book

- Implement mutation `addBook` to add new book.

* The mutation works even if the author is not already saved to the server or author data list.

- If the author is not yet saved to the server, a new author is added to the system. Born year will be null for now.

`8.7:` Updating the birth year of an author

- Implement mutation `editAuthor`, which will be used for changing the birth year or `born:` of the author.

- If the author is not in the system, `null` is returned:

</details>
