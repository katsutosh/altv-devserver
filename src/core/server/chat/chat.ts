import * as alt from 'alt-server';

alt.onClient('chat:triggerCommand', (player: alt.Player, msg: string) => {
    if (msg.length > 0) {
        let args = msg.split(' ');
        let cmd = args.shift();
        invokeCmd(player, cmd.toLowerCase(), args);
    }
});

let cmdHandlers = {};

function invokeCmd(player, cmd, args) {
    const callback = cmdHandlers[cmd];
    if (callback) {
        callback(player, args);
    } else {
        response(player, 'Command nicht gefunden.');
    }
}

export function registerCmd(cmd, callback) {
    if (cmdHandlers[cmd.toLowerCase()] !== undefined) {
        alt.logError(`Failed to register command /${cmd.toLowerCase()}, already registered`);
    } else {
        cmdHandlers[cmd.toLowerCase()] = callback;
    }
}

export function response(player, message: string) {
    alt.emitClientRaw(player, 'log:Console', `[CHAT]: ${message}`);
}