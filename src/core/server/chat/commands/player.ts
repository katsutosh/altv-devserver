import * as chat from '../chat';

chat.registerCmd('skin', (player, args) => {
    if (!args.length) {
        return chat.response(player, 'skin [model]');
    }
    player.model = args[0];
});

chat.registerCmd('sethp', (player, args) => {
    if (!args.length) {
        return chat.response(player, `sethp [value]`);
    }

    player.health = (parseInt(args[0]) + 100);
    chat.response(player, `Du hast deine HP auf ${args[0]} gesetzt.`);
});