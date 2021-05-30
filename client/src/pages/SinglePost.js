import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, Grid, Label, Icon, Button, Image, Form, Transition } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/auth';
import { useContext, useState, useRef } from 'react';

function SinglePost(props) {
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null)
    const [comment, setComment] = useState('');
    const postId = props.match.params.postId;
    const { data, loading } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        variables: {
            postId,
            body: comment
        },
        update() {
            setComment('');
            commentInputRef.current.blur();
        }
    })

    const onPostDeleted = () => {
        props.history.push('/');
    };

    let postMarkup;
    if (loading || !data.getPost) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content>
                                <LikeButton user={user} post={{ id, likes, likeCount }} />
                                <Button
                                    as='div'
                                    labelPosition='right'
                                    onClick={() => console.log('Comment on post')}
                                >
                                    <Button basic color='blue'>
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color='blue' pointing='left' >
                                        {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton post={{ id }} onPostDeleted={onPostDeleted} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                ref={commentInputRef}
                                                onChange={e => setComment(e.target.value)} />
                                            <button type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}>Submit</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        <Transition.Group>

                            {comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {
                                            user && user.username === comment.username && (
                                                <DeleteButton post={{ id }} commentId={comment.id} />
                                            )
                                        }
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                        <Card.Description>
                                            {comment.body}
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Transition.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        );
    }

    return (
        <div>
            {postMarkup}
        </div>
    )
}

const FETCH_POST_QUERY = gql`
    query getSinglePost($postId: ID!) {
        getPost(postId: $postId) {
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

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                body
                createdAt
                username
            }
            commentCount 
        }
    }
`;

export default SinglePost;