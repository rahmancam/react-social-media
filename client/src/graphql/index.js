import { gql } from '@apollo/client';

const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body 
            createdAt
            username
            likeCount
            likes {
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