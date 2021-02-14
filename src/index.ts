import * as admin from 'firebase-admin';

const serviceAccount = require('../server-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

import { ApolloServer, ApolloError, ValidationError, gql } from 'apollo-server';

// @ts-ignore
import { User, Post, Comment } from './types/types'

const typeDefs = gql`
  # A User
  type User {
    id: ID!
    name: String!
    image: String!
    posts: [Post]!
  }

  # A Post Object
  type Post {
    id: ID!
    user: User,
    postImg: String,
    likesCount: [User],
    comments: [Comment],
    description: String,
    postedAt: String
  }
  
  # A Comment Object
  type Comment {
    id: ID!
    user: User,
    text: String!
  }

  type Query {
    users: [User],
    posts: [Post],
  }
`;

const resolvers = {
  Query: {
    async posts() {
      const posts = await admin
        .firestore()
        .collection('posts')
        .get();
      return posts.docs.map(tweet => tweet.data()) as Post[];
    },
    async users() {
      const users = await admin
          .firestore()
          .collection('users')
          .get();
      return users.docs.map(tweet => tweet.data()) as User[];
    },
    // async user(_: null, args: { id: string }) {
    //   try {
    //     const userDoc = await admin
    //       .firestore()
    //       .doc(`users/${args.id}`)
    //       .get();
    //     const user = userDoc.data() as User | undefined;
    //     return user || new ValidationError('User ID not found');
    //   } catch (error) {
    //     throw new ApolloError(error);
    //   }
    // }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
