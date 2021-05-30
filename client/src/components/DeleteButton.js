import { Icon, Button, Confirm } from 'semantic-ui-react';
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { FETCH_POSTS_QUERY } from '../graphql';
import Popup from './Popup';

function DeleteButton({ post: { id }, onPostDeleted, commentId }) {
    const [confirmOpen, setConfirm] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update(cache) {
            setConfirm(false);

            if (!commentId) {
                const data = cache.readQuery({ query: FETCH_POSTS_QUERY });
                const newData = { ...data };
                newData.getPosts = data.getPosts.filter(post => post.id !== id);
                cache.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });

            }

            onPostDeleted && onPostDeleted();
        },
        variables: { postId: id, commentId },
    });

    return (
        <>
            <Popup content={`Delete ${commentId ? 'comment' : 'post'}`}>
                <Button as='div'
                    color='gray'
                    floated='right'
                    onClick={() => setConfirm(true)}>
                    <Icon name="trash" />
                </Button>
            </Popup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirm(false)}
                onConfirm={deletePostOrComment} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: String!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;

export default DeleteButton
