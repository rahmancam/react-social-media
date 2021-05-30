import { Popup } from 'semantic-ui-react';

function CustomPopup({ content, children }) {
    return (
        <Popup content={content} inverted trigger={children} />
    );
}

export default CustomPopup
