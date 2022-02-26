import * as alt from 'alt-client';
import './events';
import './minimap';

alt.onServer('log:Console', handleLogConsole);

function handleLogConsole(msg: string) {
    alt.log(msg);
}

alt.on('consoleCommand', (name, ...args) => {
    alt.emitServerRaw('chat:triggerCommand', `${name} ${args.join(' ')}`);
});