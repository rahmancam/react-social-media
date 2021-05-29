import { Form, Button } from 'semantic-ui-react';
import { useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/auth';

function Register({ history }) {
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);
    const { values, onChange, onSubmit } = useForm(() => {
        addUser();
    }, {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    });

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, result) {
            login(result.data.register)
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
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    error={errors.username ? true : false}
                    onChange={onChange}
                    value={values.username}></Form.Input>
                <Form.Input
                    label="Email"
                    placeholder="Email..."
                    name="email"
                    type="email"
                    error={errors.email ? true : false}
                    onChange={onChange}
                    value={values.email}></Form.Input>
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    onChange={onChange}
                    value={values.password}></Form.Input>
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password..."
                    name="confirmPassword"
                    type="password"
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                    value={values.confirmPassword}></Form.Input>
                <Button tyoe="submit" primary>Register</Button>
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

const REGISTER_USER = gql`
    mutation registerUser(
            $username: String!
            $email: String!
            $password: String!
            $confirmPassword: String!) {   
            register(
                registerInput: { 
                        username: $username
                        email: $email
                        password: $password
                        confirmPassword: $confirmPassword
                    }
            ) {
                id
                email
                username
                createdAt
                token
            }
    }
`;

export default Register
