import { Form, Button } from 'semantic-ui-react';
import { useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/auth';

function Login({ history }) {
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);
    const { values, onChange, onSubmit } = useForm(() => {
        loginUser();
    }, {
        username: '',
        password: '',
    });

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, result) {
            login(result.data.login);
            history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
            console.error(err);
        },
        variables: values
    });

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    error={errors.username ? true : false}
                    onChange={onChange}
                    value={values.username}></Form.Input>
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    onChange={onChange}
                    value={values.password}></Form.Input>
                <Button tyoe="submit" primary>Login</Button>
            </Form>
            {
                Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul className="list">
                            {Object.values(errors).map(value => (
                                <li key={value}>{value}</li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

const LOGIN_USER = gql`
    mutation loginUser(
            $username: String!
            $password: String!) {   
            login(
                username: $username
                password: $password   
            ) {
                id
                email
                username
                createdAt
                token
            }
    }
`;

export default Login
