import * as alt from 'alt-server';
import fs from 'fs';
import path from 'path';
import request from 'request';

let welcomeText = 'DevServer - katsutosh';
alt.log(welcomeText);

const resourceDir = alt.Resource.current.path;
LoadFiles();

function LoadFiles() {
    let filesLoaded = 0;
    const folders = fs.readdirSync(path.join(resourceDir, `/server/`));
    const filterFolders = folders.filter(x => !x.includes('.js'));
    for(let i = 0; i < filterFolders.length; i++) {
        const folder = filterFolders[i];
        const folders2 = fs.readdirSync(
            path.join(resourceDir, `/server/${folder}`)
        );
        const filterFiles2 = folders2.filter(x => x.includes('.js'));
        for(let f = 0; f < filterFiles2.length; f++) {
            const newPath = `./${folder}/${filterFiles2[f]}`;
            import(newPath)
                .catch(err => {
                    alt.log('\r\n\x1b[31m[ERROR IN LOADED FILE]');
                    alt.log(err);
                    alt.log(`\r\n --> File that couldn't load: ${newPath}`);
                })
                .then(loadedResult => {
                    if (loadedResult) {
                        filesLoaded += 1;
                        //alt.log(`[${filesLoaded}] Loaded: ${newPath}`);
                    } else {
                        alt.log(`Failed to load: ${newPath}`);
                        alt.log('Killing process; failed to load a file.');
                        alt.stopServer();
                    }
                });
        }
        const filterFolders2 = folders2.filter(x => !x.includes('.js'));
        for(let g = 0; g < filterFolders2.length; g++) {
            const folder2 = filterFolders2[g];
            const folders3 = fs.readdirSync(
                path.join(resourceDir, `/server/${folder}/${folder2}`)
            );
            const filterFiles3 = folders3.filter(x => x.includes('.js'));
            for(let h = 0; h < filterFiles3.length; h++) {
                const newPath2 = `./${folder}/${folder2}/${filterFiles3[h]}`;
                import(newPath2)
                    .catch(err => {
                        alt.log('\r\n\x1b[31m[ERROR IN LOADED FILE]');
                        alt.log(err);
                        alt.log(`\r\n --> File that couldn't load: ${newPath2}`);
                    })
                    .then(loadedResult => {
                        if (loadedResult) {
                            filesLoaded += 1;
                            //alt.log(`[${filesLoaded}] Loaded: ${newPath2}`);
                        } else {
                            alt.log(`Failed to load: ${newPath2}`);
                            alt.log('Killing process; failed to load a file.');
                            alt.stopServer();
                        }
                    });
            }
        }
    }
}

alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: alt.Player) {
    alt.log(`[${player.id}] ${player.name} has connected to the server.`);

    player.model = 'mp_m_freemode_01';
    player.spawn(0, 0, 75, 0);
    alt.emitClient(player, 'log:Console', welcomeText);
}

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