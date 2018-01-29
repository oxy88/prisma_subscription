import React from 'react'
import { View, Text } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Main extends React.Component {
    componentDidMount() {
        this._subscribeToNewPosts()
    }

    _subscribeToNewPosts() {
        this.props.allPostsQuery.subscribeToMore({
            document: gql`
                subscription {
                    newPost {
                        node {
                            id
                            title
                        }
                    }
                }
            `,
            updateQuery: (previous, { subscriptionData }) => {
                console.log('subscription trigerred')
            }
        })
    }

    render() {
        if (this.props.allPostsQuery.loading) {
            return null
        }
        console.log(this.props.allPostsQuery)
        return (
            <View>
                {this.props.allPostsQuery.allPosts.map(post => {
                    return (
                        <View key={post.id}>
                          <Text>{post.title}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }
}

const ALL_POSTS_QUERY = gql`
query {
    allPosts {
        id
        title
    }
}
`

export default graphql(ALL_POSTS_QUERY, { name: "allPostsQuery" })(Main)