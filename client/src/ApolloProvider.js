import App from './App';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react'
import { setContext, } from "@apollo/client/link/context";

const authLink = setContext((request, previousContext) => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
    }
});

const link = new HttpLink({
    uri: "http://localhost:5000"
});

const client = new ApolloClient({
    link: authLink.concat(link),
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