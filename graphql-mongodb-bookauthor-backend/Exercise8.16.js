const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
// GRAphql ISSUE ERROR MESSAGE
const { GraphQLError } = require('graphql')

// token and user
const jwt = require('jsonwebtoken')

// mongoDB

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const Book = require('./models/book')
require('dotenv').config()
const Author = require('./models/author')
require('dotenv').config()
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// // let the server create unique ID
// const { v1: uuid } = require('uuid')

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
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tcettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
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

const typeDefs = `

type Mutation {
  addBook(
    author: String!
  title: String!
    published: Int
  genres: [String!]!
  ): Book

editAuthor(
    name: String!
    born: Int
  ): Author

createUser(
    username: String!
    favouriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
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
  favouriteGenre: String
  id: ID!
}

type Token {
  value: String!
}

  type Query {  
allBooks(author: String, genre: String,): [Book!]
 allAuthors: [Author!]!
bookCount: Int!
authorCount: Int!
  me:  User!
}
`

const resolvers = {
  Query: {
    allBooks: async (root, args) => {
      //   check for author first then if genre included else just genre else all book list
      if (args.author) {
        const authorExist = await Author.findOne({ name: args.author })

        if (authorExist && args.genre) {
          return await Book.find({
            author: authorExist.id,
            genres: { $in: [args.genre] },
          }).populate('author')
        }
        return Book.find({ author: { $in: authorExist.id } }).populate('author')
      } else if (args.genre) {
        return Book.find({ genres: { $in: args.genre } }).populate('author')
      } else {
        return await Book.find({}).populate('author')
      }
    },
    // book count

    bookCount: async () => Book.collection.countDocuments(),

    // author count
    authorCount: async () => Author.collection.countDocuments(),
    // all authors
    allAuthors: async () => await Author.find({}),

    // current user
    me: (root, args, context) => {
      return context.currentUser
    },
  },

  // Querry resolver ends here

  Author: {
    bookCounts: async (root) => {
      const authorExist = await Author.findOne({ name: root.name })
      const booksFound = await Book.find({ author: authorExist.id })
      return booksFound.length
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      //  checking for current user
      const currentUser = context.currentUser
      console.log('currentUser', currentUser)

      console.log('args', args)
      //  author is added in system from new book creation . I will  implement adding in server in later exercise
      let authorFound = await Author.findOne({ name: args.author })

      let bookFound = await Book.findOne({ title: args.title })

      if (bookFound) {
        throw new GraphQLError(
          'This book already exist make sure title is unique',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
            },
          }
        )
      }

      //  book length validation check

      if (args.title.length < 5) {
        throw new GraphQLError(
          'Book title  is too short minimum length should be 5.',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
            },
          }
        )
      }

      // validate year

      const currentYear = new Date().getFullYear()
      const yearValidation = currentYear - args.published

      if (yearValidation < 0) {
        throw new GraphQLError(
          'Invalid published year, check the validity of the published year.',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          }
        )
      }

      if (!authorFound) {
        if (args.author.length < 4) {
          throw new GraphQLError(
            'Author name is too short minimum length should be 4.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
              },
            }
          )
        }

        authorFound = new Author({ name: args.author, born: 0 })

        const author = authorFound

        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(
            `Saving author error "$
{error}`,
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author.error,
              },
            }
          )
        }
      }

      // adding new books
      let newAuthorFound = await Author.findOne({ name: args.author })

      const book = new Book({ ...args, author: newAuthorFound })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return book
    },
    //     addBook: async (root, args, context) => {
    //       // checking for current user
    //       const currentUser = context.currentUser
    //       console.log('currentUser', currentUser)

    //       if (!currentUser) {
    //         throw new GraphQLError('not authenticated', {
    //           extensions: {
    //             code: 'BAD_USER_INPUT',
    //           },
    //         })
    //       }
    //       // adding new book of contact
    //       let authorFound = await Author.findOne({ name: args.author })

    //       let bookFound = await Book.findOne({ title: args.title })

    //       if (bookFound) {
    //         throw new GraphQLError(
    //           'This book already exist make sure title is unique',
    //           {
    //             extensions: {
    //               code: 'BAD_USER_INPUT',
    //               invalidArgs: args.author,
    //             },
    //           }
    //         )
    //       }

    //       if (!authorFound) {
    //         // author length validation check

    //         if (args.author.length < 4) {
    //           throw new GraphQLError(
    //             'Author name is too short minimum length should be 4.',
    //             {
    //               extensions: {
    //                 code: 'BAD_USER_INPUT',
    //                 invalidArgs: args.author,
    //               },
    //             }
    //           )
    //         }

    //         authorFound = new Author({ name: args.author, born: 0 })

    //         const author = authorFound

    //         try {
    //           await author.save()
    //         } catch (error) {
    //           throw new GraphQLError(
    //             `Saving author error "$
    // {error}`,
    //             {
    //               extensions: {
    //                 code: 'BAD_USER_INPUT',
    //                 invalidArgs: args.author.error,
    //               },
    //             }
    //           )
    //         }
    //       }
    //       // adding new books

    //       const book = new Book({ ...args, author: authorFound })

    //       try {
    //         await books.save()
    //       } catch (error) {
    //         throw new GraphQLError('Saving book failed', {
    //           extensions: {
    //             code: 'BAD_USER_INPUT',
    //             invalidArgs: args.name,
    //             error,
    //           },
    //         })
    //       }
    //       return book
    //     },

    // Edit author
    editAuthor: async (root, args, context) => {
      // checking for current user
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      // since only existing authors are displayed on drop down box the is no need for validation check
      if (args.name.length < 4) {
        throw new GraphQLError('Min character length should be 4', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }
      let authorExist = await Author.findOne({ name: args.name })

      if (!authorExist) return null

      if (args.born) {
        const birth = args.born.toString()

        if (birth.length < 4 || birth.length > 4) {
          throw new GraphQLError('Length of the year should be 4 digits.', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          })
        }

        const currentYear = new Date().getFullYear()
        const yearValidation = currentYear - birth

        if (yearValidation < 0 || yearValidation === 0 || yearValidation < 10) {
          throw new GraphQLError(
            'Invalid year born entered, year born should be earlier than curent year or at least 10 years in old when writing the book.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
              },
            }
          )
        }
      }

      authorExist.born = args.born
      const authors = authorExist

      try {
        await authors.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return authors
    },

    //  create user and login

    createUser: async (root, args) => {
      if (!args.username || !args.favouriteGenre) {
        throw new GraphQLError(
          'invalid username or favourite genre should be entered.',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
            },
          }
        )
      }

      // check user exist

      const userFound = await User.findOne({ username: args.username })

      if (userFound) {
        throw new GraphQLError(
          'This user  already exist make sure title is unique',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
            },
          }
        )
      }

      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
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

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      console.log('currentUser', currentUser)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
