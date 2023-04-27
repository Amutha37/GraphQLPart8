const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

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
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
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
    genres: ['refactoring'],
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
type Book {
  author: String!
  title: String!
    published: String
    genres: [String]
  id: ID!
  }

 type Author {
  name: String!
born:Int
bookCounts: Int!
titles: [String]
  id: ID!
  }

  type Query {  
allBooks(genre:String!):[Book!]
bookCount: Int!
authorCount: Int!
   allAuthors: [Author!]!
}
`

const resolvers = {
  Query: {
    allBooks: () => (root, args) => {
      console.log('im here allbooks', args)

      // const output = authors.map(({ name }) => {
      const arr = []
      const output = () => {
        console.log('allbooks', args)
        const genre = books.map((b) => {
          b.includes(args.genre)
          if (genre) {
            console.log('b', {})
            arr.push({ b })
          }
        })
        console.log('arr', arr)
        return arr
        // })
      }

      return output
      // return output
      // const output = authors.map(({ name }) => {
      // const output = () => {
      //   if (args) {
      //     const bookCounts = books.filter((b) => b.author === args.name)
      //     return { args, bookCounts }
      //   }
      // }
      // })
      // const titles = []
      // output.map(({ n }) => {

      //   titles.push(n.title)
      //   console.log('output', 'titles', titles, 'args', args, 'output', output)
      //   return { args, titles }
      // })
      // return output
      // const output = () => {
      //   if (args.name) {
      //     const booktitles = books.filter((b) => b.author === args.name)
      //     const name = args.name
      //     return { name, booktitles }
      //   }
      // }
    },
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthors: () => {
      console.log('im here allAuthor')
      const output = authors.map(({ name }) => {
        const bookCounts = books.filter((b) => b.author === name).length
        console.log('allauthors', 'bookcounts', bookCounts, 'name', name)
        return { name, bookCounts }
      })
      return output
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
