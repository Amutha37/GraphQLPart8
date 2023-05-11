GraphQL Part8c

### Using MongoDB for Database

<details>
<summary>

### $\color{cyan}{Dependecies}$

 </summary>

```
npm install @apollo/server graphql
```

```
npm install mongoose
```

```
npm install mongoose-unique-validator
```

```
npm install mongoose dotenv
```

```
npm install jsonwebtoken
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

`8.13:` Database, part 1

- Add mongoose schema for `books` and `authors` so that it saves the data to a MongoDB database.

`8.14:` Database, part 2

- Implement query allBooks, which returns the details of all books.

`8.15:` Database, part 3

- Complete the program so that database validation errors (e.g. book title or author name being too short) are handled sensibly. This means that they cause GraphQLError with a suitable error message to be thrown.

`8.16:` user and logging in

- Implement user management to your application. Expand the schema .

</details>
