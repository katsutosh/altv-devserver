import * as alt from 'alt-client';
import * as game from 'natives';

let index = getMinimapAnchor();

function getMinimapAnchor() {
    let safeZone = game.getSafeZoneSize(),
        sfX = 1.0 / 20.0,
        sfY = 1.0 / 20.0,
        aspectRatio = game.getAspectRatio(false),
        resolution = game.getActiveScreenResolution(0, 0),
        scaleX = 1.0 / resolution[1],
        scaleY = 1.0 / resolution[2],
        minimap = {
            width: 0,
            height: 0,
            leftX: 0,
            bottomY: 0,
            scaleX: 0,
            scaleY: 0,
            rightX: 0,
            topY: 0
        };
    minimap.width = scaleX * (resolution[1] / (4 * aspectRatio));
    minimap.height = scaleY * (resolution[2] / 5.674);
    minimap.leftX = scaleX * (resolution[1] * (sfX * (Math.abs(safeZone - 1.0) * 10)));
    minimap.bottomY = 1.0 - scaleY * (resolution[2] * (sfY * (Math.abs(safeZone - 1.0) * 10)));
    minimap.scaleX = scaleX;
    minimap.scaleY = scaleY;
    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;
    return minimap;
}

function DrawText(text, x, y, scale, fontType, r, g, b, a, alignRight = false, textCentre = false, useOutline = true, useDropShadow = true) {
    game.setTextFont(fontType);
    game.setTextProportional(false);
    game.setTextScale(scale, scale);
    game.setTextColour(r, g, b, a);
    game.setTextEdge(2, 0, 0, 0, 150);
    if (useDropShadow) {
        game.setTextDropshadow(0, 0, 0, 0, 255);
        game.setTextDropShadow();
    }
    if (useOutline) {
        game.setTextOutline();
    }

    if (alignRight) {
        game.setTextRightJustify(true);
        game.setTextWrap(0, x);
    }

    game.setTextCentre(textCentre);

    game.beginTextCommandDisplayText('CELL_EMAIL_BCON');
    //Split text into pieces of max 99 chars blocks
    text.match(/.{1,99}/g).forEach(textBlock => {
        game.addTextComponentSubstringPlayerName(textBlock);
    });
    game.endTextCommandDisplayText(x, y, 0.0);
}

let isMetric = false;
alt.everyTick(() => {
    isMetric = game.getProfileSetting(227) == 1;
    if (alt.Player.local.vehicle) {
        DrawText(`${(game.getEntitySpeed(alt.Player.local.vehicle.scriptID) * (isMetric ? 3.6 : 2.236936)).toFixed(0)} ${(isMetric) ? 'KM/H' : 'MPH'}`, index.rightX - 0.003, index.bottomY - 0.0485, 0.45, 4, 255, 255, 255, 255, true);
    }
});
