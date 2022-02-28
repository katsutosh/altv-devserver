import * as alt from 'alt-server';
import {IObject, IObjectData, ObjectEvent} from '../../shared/streamer';

export class ObjectService implements IObject {
    public static _id: number = 0;
    public static objectList: Array<ObjectService> = [];
    public id: number;
    public model: string;
    public position: alt.Vector3;
    public heading: number;
    public onGroundProperly: boolean;
    public collision: boolean;
    public dimension: number;
    public streamDistance: number;
    public objectData: IObjectData;

    constructor(_model: string, _position: alt.Vector3, _heading: number = 0, _onGroundProperly: boolean = true, _collision: boolean = false, _dimension: number = 0, _streamDistance: number = 200, _objectData: IObjectData = null) {
        if (typeof _heading === 'string') {
            _heading = parseFloat(_heading);
        }
        ObjectService._id++;
        this.id = ObjectService._id;
        this.model = _model;
        this.position = _position;
        this.heading = _heading;
        this.onGroundProperly = _onGroundProperly;
        this.collision = _collision;
        this.dimension = _dimension;
        this.streamDistance = _streamDistance;
        this.objectData = _objectData;

        this.create();
    }

    create() {
        ObjectService.objectList.push(this);
        alt.emitAllClientsRaw(ObjectEvent.Create, this);
    }

    static updateModel(id: number, newModel: string) {
        const object = ObjectService.getById(id);
        if (!object) {
            return;
        }
        
        object.model = newModel;
        
        alt.emitAllClients(ObjectEvent.Sync, ObjectService.objectList);
    }
    
    static delete(id: number) {
        const objectIndex = ObjectService.getIndexById(id);

        if (objectIndex < 0) {
            return;
        }

        ObjectService.objectList.splice(objectIndex, 1);

        alt.emitAllClients(ObjectEvent.Delete, id);
    }

    static getById(id: number) {
        return ObjectService.objectList.find((object) => object.id === id);
    }

    static getIndexById(id: number) {
        return ObjectService.objectList.findIndex((object) => object.id === id);
    }

    static sync(player: alt.Player) {
        if (ObjectService.objectList.length) {
            alt.emitClient(player, ObjectEvent.Sync, ObjectService.objectList);
        }
    }
}

alt.on('playerConnect', ObjectService.sync);