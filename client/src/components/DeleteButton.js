import { Icon, Button, Confirm } from 'semantic-ui-react';
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { FETCH_POSTS_QUERY } from '../graphql';

function DeleteButton({ post: { id }, onPostDeleted }) {
    const [confirmOpen, setConfirm] = useState(false);
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(cache) {
            setConfirm(false);
            const data = cache.readQuery({ query: FETCH_POSTS_QUERY });
            const newData = { ...data };
            newData.getPosts = data.getPosts.filter(post => post.id !== id);
            cache.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });

            onPostDeleted && onPostDeleted();
        },
        variables: { postId: id },
    });

    return (
        <>
            <Button as='div'
                color='gray'
                floated='right'
                onClick={() => setConfirm(true)}>
                <Icon name="trash" />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirm(false)}
                onConfirm={deletePost} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }

`;

export default DeleteButton
