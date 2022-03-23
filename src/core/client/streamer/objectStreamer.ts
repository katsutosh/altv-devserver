import * as alt from 'alt-client';
import * as game from 'natives';
import {IObject, IObjectData, ObjectEvent} from '../../shared/streamer';
import {loadModel} from './index';

export class ObjectStreamer implements IObject {
    public static objectList: Array<ObjectStreamer> = [];
    public id: number;
    public model: string;
    public position: alt.Vector3;
    public heading: number;
    public onGroundProperly: boolean;
    public collision: boolean;
    public dimension: number;
    public streamDistance: number;
    public objectData: IObjectData;

    public gameHandle: number | null;

    constructor(object: IObject) {
        this.id = object.id;
        this.model = object.model;
        this.position = object.position;
        this.heading = object.heading;
        this.onGroundProperly = object.onGroundProperly;
        this.collision = object.collision;
        this.dimension = object.dimension;
        this.streamDistance = object.streamDistance;
        this.objectData = object.objectData;
        this.gameHandle = null;

        ObjectStreamer.objectList.push(this);
    }

    static sync(objectList: Array<any>) {
        ObjectStreamer.objectList = objectList;
    }

    static create(objectData: IObject) {
        new ObjectStreamer(objectData);
    }

    static delete(id: number) {
        const objectIndex = ObjectStreamer.getIndexById(id);

        if (objectIndex < 0) {
            return;
        }

        const gameHandle = ObjectStreamer.objectList[objectIndex].gameHandle;

        ObjectStreamer.objectList.splice(objectIndex, 1);
        game.deleteObject(gameHandle);
    }

    static getById(id: number) {
        return ObjectStreamer.objectList.find((object) => object.id === id);
    }

    static getIndexById(id: number) {
        return ObjectStreamer.objectList.findIndex((object) => object.id === id);
    }

    static updateObjectHandle(id: number, gameHandle: number) {
        const object = ObjectStreamer.getById(id);

        if (!object) {
            return;
        }

        object.gameHandle = gameHandle;
    }

    static async show(object: ObjectStreamer) {
        const hash = alt.hash(object.model);
        await loadModel(object.model);

        if (typeof object.heading === 'string') {
            object.heading = parseFloat(object.heading);
        }

        const createdObject = game.createObjectNoOffset(hash, object.position.x, object.position.y, object.position.z, false, false, false);
        game.setEntityHeading(createdObject, object.heading);
        game.freezeEntityPosition(createdObject, true);
        game.setDisableBreaking(createdObject, false);
        game.setEntityCollision(createdObject, object.collision, false);
        if (object.onGroundProperly) {
            game.placeObjectOnGroundProperly(createdObject);
        }

        object.gameHandle = createdObject;
        ObjectStreamer.updateObjectHandle(object.id, createdObject);
    }

    static hide(object: ObjectStreamer) {
        game.deleteObject(object.gameHandle);

        object.gameHandle = null;
        ObjectStreamer.updateObjectHandle(object.id, null);
    }

    static async checkObjects() {
        if (alt.Player.local && alt.Player.local.pos) {

            let myDimension: number = 0;
            if (alt.Player.local.hasMeta('dimension')) {
                myDimension = alt.Player.local.getMeta('dimension');
            }

            for(const object of ObjectStreamer.objectList) {
                const objectPos = new alt.Vector3(object.position.x, object.position.y, object.position.z);
                const isInRange = alt.Player.local.pos.isInRange(objectPos, object.streamDistance);

                if (object && !object.gameHandle && isInRange && (myDimension === object.dimension || object.dimension === 0)) {
                    await ObjectStreamer.show(object);
                }

                if (object.gameHandle && (!isInRange || (myDimension !== object.dimension && object.dimension !== 0)) && game.doesEntityExist(object.gameHandle)) {
                    ObjectStreamer.hide(object);
                }
            }
        }
    }

    static getObjectsByModel(model: string) {
        return ObjectStreamer.objectList.filter((object) => object.model === model);
    }
}

alt.onServer(ObjectEvent.Sync, ObjectStreamer.sync);
alt.onServer(ObjectEvent.Create, ObjectStreamer.create);
alt.onServer(ObjectEvent.Delete, ObjectStreamer.delete);
alt.setInterval(ObjectStreamer.checkObjects, 1000);