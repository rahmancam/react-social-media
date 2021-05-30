import { gql } from '@apollo/client';

const FETCH_POSTS_QUERY = gql`
query getAllPosts {
        getPosts {
            id
            body 
            createdAt
            username
            likeCount
            likes {
                id
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;

export { FETCH_POSTS_QUERY }