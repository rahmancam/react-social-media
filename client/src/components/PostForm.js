import { Form, Button } from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { useForm } from '../hooks/useForm';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../graphql';

function PostForm() {
    const { onSubmit, onChange, values } = useForm(() => {
        createPost();
    }, { body: '' });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            console.log(result);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            data.getPosts.unshift(result.data.createPost);
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
            values.body = '';
        },
        onError() {

        }
    });

    return (
        <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Enter text here ..."
                    name="body"
                    onChange={onChange}
                    value={values.body}
                />
                <Button type="submit" color="teal">Submit</Button>
            </Form.Field>
        </Form>
    )
}

export default PostForm

const CREATE_POST_MUTATION = gql`
    mutation createNewPost($body: String!) {
        createPost(body: $body) {
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