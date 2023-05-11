const { ApolloServer, UserInputError } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

// GRAphql ISSUE ERROR MESSAGE
const { GraphQLError } = require('graphql')
// fetching schema
mongoose.set('strictQuery', false)
require('dotenv').config()
// let the server create unique ID
// const { v1: uuid } = require('uuid')
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
    born: 0,
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
    born: 0,
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

/*
  you can remove the placeholder query once your first own has been implemented 
*/

// small change instead of just leaving the author name now we will place the details of the Author from mongoDB exercises .
// addAuthor(
//     name: String!
//   born: Int
//   ): Author

const typeDefs = `

type Mutation {
  addBook(
    author: String!
  title: String!
    published: Int!
  genres: [String]
  ): Book


editAuthor(
    name: String!
    born: Int!
  ): Author
createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
}

type Book {
   author: Author!
  title: String!
    published: Int
    genres: [String]
  id: ID!
  }

 type Author {
  name: String!
born:Int
bookCounts: Int!
  id: ID!
  }

type User {
    username: String!
  favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {  
allBooks(author: String, genre: String,): [Book!]
bookCount: Int!
authorCount: Int!
   allAuthors: [Author!]!
    me: User
}
`

const resolvers = {
  Query: {
    // Query allows to select author or genre for search or both together .
    allBooks: async (root, args) => {
      // genre and author
      if (!args.genre && !args.author) {
        return Book.find({}).populate('author')
      }

      // selected both  author and genre
      if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({
          $and: [
            { author: { $in: author.id } },
            { genres: { $in: args.genre } },
          ],
        }).populate('author')
        // if (book.author === args.author)
        //   return book.genres.includes(args.genre)
      }
      // selected author only
      if (!args.genre && args.author) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: { $in: author.id } }).populate('author')
        // return book.author === args.author
      }
      // selected genre only
      if (!args.author && args.genre) {
        return Book.find({ genres: { $in: args.genre } }).populate('author')
      }
    },

    // book count
    bookCount: () => async () => Book.collection.countDocuments(),

    // author count
    authorCount: async () => Author.collection.countDocuments(),
    // all authors
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    },
    // allAuthors: () => {
    //   const output = authors.map(({ name, born, id }) => {
    //     const bookCounts = books.filter((b) => b.author === name).length
    //     return { name, born, id, bookCounts }
    //   })
    //   return output
    // },
  },

  // author book counts
  Author: {
    bookCounts: async (root) => {
      return books.filter((b) => String(b.author) === String(root.id)).length
    },
  },

  me: (root, args, context) => {
    return context.currentUser
  },

  // mutation

  // adding new person of contact
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      if (args.title.length < 5) {
        throw new GraphQLError('Minimum length for title is 5 characters', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })
      }
      if (books.find((p) => p.title === args.title)) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })
      }

      //  author is added in system from new book creation . I will  implement adding in server in later exercise
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })

        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args })
        }
      }

      const book = new Book({ ...args, author })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }

      // let countAut = authors.filter((p) => p.name == args.author).length

      // if (countAut === 0) {
      //   const newAuthor = {
      //     name: args.author,
      //   }

      //   const author = { ...newAuthor, id: uuid() }

      //   authors = authors.concat(author)
      // }

      // // adding new books
      // const book = { ...args, id: uuid() }

      // books = books.concat(book)
      return book
    },
    // Edit author
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      if (args.name.length < 5) {
        throw new GraphQLError(
          'Minimum length for author name should be 4 characters',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          }
        )
      }
      // since only existing authors are displayed on drop down box the is no need for validation check
      // const author = authors.find((p) => p.name === args.name)

      // if (!author) {
      //   return null
      // }

      // const updatedAuthor = { ...author, born: args.born }
      // authors = authors.map((p) => (p.name === args.name ? updatedAuthor : p))
      // return updatedAuthor

      const author = await Author.findOne({ name: args.name })

      if (!author) return null

      author.born = args.born

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }
    },
  },
  // create user
  createUser: (root, args) => {
    const user = new User({
      username: args.username,
      favoriteGenre: args.favoriteGenre,
    })

    // const user = new User({ ...args })

    return user.save().catch((error) => {
      throw new GraphQLError('Creating the user failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
          error,
          // throw new UserInputError(error.message, {
          //   invalidArgs: args,
          // })
        },
      })
    })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if (!user || args.password !== 'secret') {
      throw new GraphQLError('wrong credentials', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }
    // if (!user || args.password !== PASSWORD) {
    //   throw new UserInputError('wrong credentials')
    // }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const PORT = process.env.PORT
startStandaloneServer(server, {
  listen: { port: PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
