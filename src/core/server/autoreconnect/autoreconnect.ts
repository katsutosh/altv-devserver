import request from 'request';

const RETRY_DELAY = 2500;
const DEBUG_PORT = 9223;

async function getLocalClientStatus() {
    try {
        request.get({
            url: `http://127.0.0.1:${DEBUG_PORT}/status`
        }, function(err, httpResponse, body) {
            return body;
        });

    } catch(error) {
        return null;
    }
}

async function connectLocalClient() {
    const status = await getLocalClientStatus();
    if (status === null) {
        return;
    }

    if (status === 'MAIN_MENU') {
        setTimeout(() => connectLocalClient(), RETRY_DELAY);
    }

    try {
        request.post({
            url: `http://127.0.0.1:${DEBUG_PORT}/reconnect`
        }, function(err, httpResponse, body) {
            return body;
        });
    } catch(error) {
        console.log(error);
    }
}

connectLocalClient();