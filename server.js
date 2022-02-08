const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
  } = require('graphql')

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
];

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

const Book = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLInt)},
        author: {
            type: Author,
            resolve: (book) => {return authors.find(author => author.id === book.authorId)}
        }
    })

});

const Author = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(Book),
            resolve: (author) => {return books.filter(book => book.authorId === author.id)}
        }
    })

});

const RootQuery = new GraphQLObjectType({
    name:'query',
    fields: () => ({
        books: {
            type: new GraphQLList(Book),
            resolve: () => books 
        },

        book: {
            type: Book,
            args:{
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => {return books.find(book => book.id === args.id)}
        },

        authors: {
            type: new GraphQLList(Author),
            resolve: () => authors
        },

        author: {
            type: Author,
            args:{
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => {return authors.find(author => author.id === args.id)}
        }
    })

});

const RootMutation = new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
        addBook: {
            type: Book,
            args: {
                name: new GraphQLNonNull(GraphQLString),
                authorId: new GraphQLNonNull(GraphQLInt)
            },
            resolve: (parent,args) => {
                const new_book = {id: books.length + 1, name: args.name, authorId: args.authorId};
                books.push(new_book);
                return new_book;
            }
        },

        addAuthor: {
            type: Author,
            args: {
                name: new GraphQLNonNull(GraphQLString),
            },
            resolve: (parent,args) => {
                const new_author = {id: authors.length + 1, name: args.name};
                authors.push(new_author);
                return new_author;
            }
        }



    })
});

const schema = new GraphQLSchema({
    query: RootQuery
    //mutation: RootMutation
});
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(3000, () => console.log('Listening at 3000...'));