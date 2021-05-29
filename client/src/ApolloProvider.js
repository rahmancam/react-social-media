import App from './App';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react'

const client = new ApolloClient({
    uri: 'http://localhost:5000',
    cache: new InMemoryCache()
});

function Provider() {
    return (
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    );
}

export default Provider;