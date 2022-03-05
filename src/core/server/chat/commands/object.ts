import * as alt from 'alt-server';
import * as chat from '../chat';
import {ObjectService} from '../../streamer/objectService';

chat.registerCmd('createobject', (player: alt.Player, args) => {
    if (player.vehicle) {
        return chat.response(player, 'Du sitzt in einem Fahrzeug.');
    }
    if (!args.length) {
        return chat.response(player, 'createobject [model]');
    }
    const model = args[0];
    new ObjectService(model, player.pos, player.heading, true, false);
});
