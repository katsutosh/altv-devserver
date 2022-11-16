import * as alt from 'alt-client';
import * as game from 'natives';

game.setPedDefaultComponentVariation(game.playerPedId());

alt.onServer('player:setProp', (componentId, drawableId, textureId) => {
    if (drawableId === -1) {
        game.clearPedProp(alt.Player.local.scriptID, componentId);
    }
    game.setPedPropIndex(alt.Player.local.scriptID, componentId, drawableId, textureId, false);
});

alt.onServer('player:setComponent', (componentId, drawableId, textureId) => {
    game.setPedComponentVariation(alt.Player.local.scriptID, componentId, drawableId, textureId, 0);
});