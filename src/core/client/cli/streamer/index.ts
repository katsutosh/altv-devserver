import './objectStreamer';
import './pedStreamer';
import alt from 'alt-client';
import game from 'natives';

let loadingModels = new Set();

export async function loadModel(classname: any) {
    return new Promise((resolve, reject) => {
        if (typeof classname === 'string' && classname.substring(0, 2) === '0x') {
            classname = parseInt(classname);
        } else if (typeof classname === 'string') {
            classname = alt.hash(classname);
        }
        if (!game.isModelValid(classname)) {
            return resolve(false);
        }
        if (game.hasModelLoaded(classname)) {
            return resolve(true);
        }

        loadingModels.add(classname);
        game.requestModel(classname);

        let interval = alt.setInterval(() => {
            if (!loadingModels.has(classname)) {
                return done(game.hasModelLoaded(classname));
            }
            if (game.hasModelLoaded(classname)) {
                return done(true);
            }
        }, 10);

        const timeout = alt.setTimeout(() => {
            return done(game.hasModelLoaded(classname));
        }, 3000);

        const done = (result: boolean) => {
            alt.clearInterval(interval);
            alt.clearTimeout(timeout);

            loadingModels.delete(classname);

            return resolve(result);
        };
    });
}