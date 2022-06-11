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

chat.registerCmd('male', (player, args) => {
    player.model = 'mp_m_freemode_01';
});
chat.registerCmd('female', (player, args) => {
    player.model = 'mp_f_freemode_01';
});