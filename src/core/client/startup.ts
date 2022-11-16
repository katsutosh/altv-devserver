import * as alt from 'alt-client';
import './events';
import './minimap';
import './streamer';
import {between} from '../shared/helper';

alt.onServer('log:Console', handleLogConsole);

alt.log(between(0, 5));

function handleLogConsole(msg: string) {
    alt.log(msg);
}

alt.on('consoleCommand', (name, ...args) => {
    alt.emitServerRaw('chat:triggerCommand', `${name} ${args.join(' ')}`);
});