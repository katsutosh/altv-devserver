import * as chat from '../chat';

chat.registerCmd('pos', (player, args) => {
    console.log(player.pos);
});

chat.registerCmd('rot', (player, args) => {
    console.log(player.rot);
});

chat.registerCmd('tp', (player, args) => {
    if (!args[0] || args.length !== 3) {
        return chat.response(player, `/tp [x] [y] [z]`);
    }
    player.pos = {
        x: args[0],
        y: args[1],
        z: args[2]
    };
});

chat.registerCmd('w', (player, args) => {
    if (!args.length) {
        return chat.response(player, `/w [Weaponmodel]`);
    }
    player.giveWeapon(args[0], 1000, true);
    chat.response(player, `Du hast dir eine Waffe gegeben.`);
});

chat.registerCmd('settime', (player, args) => {
    if (!args.length) {
        return chat.response(player, `/settime [Hour]`);
    }
    if (parseInt(args[0]) >= 0 && parseInt(args[0]) < 24) {
        player.setDateTime(1, 1, 2019, args[0], 0, 0);
    }
});

