import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { Prisma } from './generated/prisma'
import { Context } from './utils'

const resolvers = {
  Query: {
    allPosts(parent, args, ctx, info) {
      return ctx.db.query.posts({}, info)
    }
  },
  Mutation: {
    createDraft(parent, { title, text }, context: Context, info) {
      return context.db.mutation.createPost(
        { data: { title, text } },
        info,
      )
    },
    deletePost(parent, { id }, context: Context, info) {
      return context.db.mutation.deletePost({ where: { id } }, info)
    },
    publish(parent, { id }, context: Context, info) {
      return context.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true },
        },
        info,
      )
    },
  },
  Subscription: {
    newPost: {
      subscribe: async (parent, args, ctx, info) => {
        return await ctx.db.subscription.post({}, info)
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'https://us1.prisma.sh/public-luminousleg-143/subscription1/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queries & mutations
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
