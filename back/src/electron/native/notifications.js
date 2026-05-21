import { Notification } from "electron"

const showNotification = ({
    title,
    body
}) => {

    new Notification({
        title,
        body
    }).show();
};

export default showNotification;