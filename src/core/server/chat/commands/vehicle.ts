import * as alt from 'alt-server';
import * as chat from '../chat';
import {between} from '../../../shared/helper';

chat.registerCmd('v', spawnVehicle);
chat.registerCmd('veh', spawnVehicle);

chat.registerCmd('rc', (player, args) => {
    alt.Vehicle.all.forEach(vehicle => {
        vehicle.destroy();
    });
    chat.response(player, `Du hast alle Fahrzeuge zerstört.`);
});

chat.registerCmd('extra', (player, args) => {
    if (!player.vehicle) {
        return chat.response(player, 'Du sitzt in keinem Fahrzeug.');
    }
    if (!args.length || !player.vehicle) {
        return chat.response(player, 'extra [extraId]');
    }
    if (!player.vehicle.getExtra(parseInt(args[0]))) {
        player.vehicle.setExtra(parseInt(args[0]), false);
        chat.response(player, `Extra aus.`);
    } else {
        player.vehicle.setExtra(parseInt(args[0]), true);
        chat.response(player, `Extra an.`);
    }
});

chat.registerCmd('toggleextra', (player, args) => {
    if (!player.vehicle) {
        return chat.response(player, 'Du sitzt in keinem Fahrzeug.');
    }
    if (parseInt(args[0]) == 1) {
        for(let i = 0; i < 15; i++) {
            player.vehicle.setExtra(i, true);
            chat.response(player, `Extra ${i} an.`);
        }
    } else {
        for(let i = 0; i < 15; i++) {
            player.vehicle.setExtra(i, false);
            chat.response(player, `Extra ${i} aus.`);
        }
    }
});

chat.registerCmd('paintcar', (player, args) => {
    if (!player.vehicle) {
        return chat.response(player, 'Du sitzt in keinem Fahrzeug.');
    }
    if (args.length != 2) {
        return chat.response(player, 'paintcar [col1 col2]');
    }
    if (args.length == 2) {
        if (args.some(x => x < 0 || x > 160)) {
            return chat.response(player, `Der Wert darf nicht < 0 und > 160 sein.`);
        }
        player.vehicle.primaryColor = args[0];
        player.vehicle.secondaryColor = args[1];
    }
});

chat.registerCmd('tunecar', (player, args) => {
    if (args.length != 2) {
        return chat.response(player, `tunecar [category] [partId]`);
    }
    let vehicle = player.vehicle;
    if (vehicle.modKitsCount > 0 && vehicle.modKit != 1) {
        vehicle.modKit = 1;
        chat.response(player, `Fahrzeug ist nun Tunebar`);
    }
    if (vehicle.getModsCount(48) == 0 && args[0] == 48 && args[1] >= 0) {
        return vehicle.livery = args[1];
    }
    if (vehicle.getModsCount(args[0]) < 1) {
        return chat.response(player, `Diese Kategorie ist nicht vorhanden`);
    }
    if (vehicle.getModsCount(args[0]) < args[1]) {
        return chat.response(player, `Soviele hat es nicht.`);
    }
    vehicle.setMod(args[0], args[1]);
});

/**
 * Spawn a vehicle and set the player into the vehicle.
 * @param player
 * @param args [model]
 */
export async function spawnVehicle(player, args) {
    if (!args.length) {
        return chat.response(player, `veh [Model]`);
    }
    const model = args[0];
    try {
        let vehicle = new alt.Vehicle(model, player.pos.x, player.pos.y, player.pos.z, 0, 0, player.rot.z);
        let color = between(0, 160);
        vehicle.dimension = player.dimension;
        vehicle.numberPlateIndex = 1;
        vehicle.modKit = 0;
        vehicle.pearlColor = 0;
        vehicle.primaryColor = color;
        vehicle.secondaryColor = color;
        alt.setTimeout(() => {
            player.setIntoVehicle(vehicle, 1);
        }, 250);
        chat.response(player, 'Fahrzeug gespawnt.');
    } catch(err) {
        chat.response(player, 'Modell existiert nicht.');
        alt.log(err);
    }
}