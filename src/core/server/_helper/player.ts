import * as alt from 'alt-server';

declare module 'alt-server' {
    export interface BaseObject {
        heading: number;
    }
}

Object.defineProperty(alt.Entity.prototype, 'heading', {
    get() {
        let heading = this.rot.toDegrees().z;
        if (heading < 0) {
            heading = heading + 360;
        }
        return heading;
    },
    set(value) {
        let radians = new alt.Vector3(0, 0, value).toRadians().z;
        this.rot = new alt.Vector3(this.rot.x, this.rot.y, radians);
    }
});