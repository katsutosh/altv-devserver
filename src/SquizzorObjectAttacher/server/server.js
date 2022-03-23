import * as alt from 'alt-server';


alt.onClient('objectAttacher:attachedObject', (player, objectName) => {
    player.setSyncedMeta('AttachedObject', objectName);
});

alt.onClient('objectAttacher:detachedObject', (player) => {
    player.setSyncedMeta('AttachedObject', null);
});