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
        optimisticResponse: {
            createPost: {
                id: '',
                body: values.body,
                username: values.username
            }
        },
        update(cache, result) {
            const data = cache.readQuery({
                query: FETCH_POSTS_QUERY
            });
            data.getPosts = [result.data.createPost, ...data.getPosts];
            cache.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: data.getPosts } });
            values.body = '';
        },
        onError() {

        }
    });

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Enter text here ..."
                        name="body"
                        onChange={onChange}
                        error={error ? true : false}
                        value={values.body}
                    />
                    <Button type="submit" color="teal">Submit</Button>
                </Form.Field>
            </Form>
            {
                error && (
                    <div className="ui error message" style={{ marginBottom: 20 }}>
                        <ui className="list">
                            <li>{error.graphQLErrors[0].message}</li>
                        </ui>
                    </div>
                )
            }
        </>
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