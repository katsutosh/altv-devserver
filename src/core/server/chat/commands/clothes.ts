import * as alt from 'alt-server';
import * as chat from '../chat';

chat.registerCmd('clothes', (player, args) => {
    alt.emitClient(player, 'player:setComponent', parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
    chat.response(player, `Du hast dir neue Klamotten gesetzt.`);
});
chat.registerCmd('prop', (player, args) => {
    alt.emitClient(player, 'player:setProp', parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
    chat.response(player, `Du hast dir neue Props gesetzt.`);
});