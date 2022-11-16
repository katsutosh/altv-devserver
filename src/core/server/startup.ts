import * as alt from 'alt-server';

import './imports/autoreconnect';
import './imports/streamer';
import './imports/chat';
import './imports/helper';
import {between} from '../shared/helper';


let welcomeText = 'DevServer - katsutosh';
alt.log(welcomeText);

console.log(between(0, 5));
alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: alt.Player) {
    alt.log(`[${player.id}] ${player.name} has connected to the server.`);

    player.model = 'mp_m_freemode_01';
    player.spawn(0, 0, 75, 0);
    alt.emitClient(player, 'log:Console', welcomeText);
}
