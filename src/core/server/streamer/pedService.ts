import * as alt from 'alt-server';
import {IPed, IPedData, PedEvent} from '../../shared/streamer';

export class PedService implements IPed {
    public static _id: number = 0;
    public static pedList: Array<PedService> = [];
    public id: number;
    public model: string;
    public position: alt.Vector3;
    public heading: number;
    public dimension: number;
    public streamDistance: number;
    public pedData: IPedData;

    constructor(_model: string, _position: alt.Vector3, _heading: number = 0, _dimension: number = 0, _streamDistance: number = 50, _pedData: IPedData = null) {
        if (typeof _heading === 'string') {
            _heading = parseFloat(_heading);
        }
        PedService._id++;
        this.id = PedService._id;
        this.model = _model;
        this.position = _position;
        this.heading = _heading;
        this.pedData = _pedData;
        this.dimension = _dimension;
        this.streamDistance = _streamDistance;

        this.create();
    }

    create() {
        PedService.pedList.push(this);
        alt.emitAllClientsRaw(PedEvent.Create, this);
    }

    static delete(id: number) {
        const pedIndex = PedService.getIndexById(id);

        if (pedIndex < 0) {
            return;
        }

        PedService.pedList.splice(pedIndex, 1);

        alt.emitAllClients(PedEvent.Delete, id);
    }

    static getById(id: number) {
        return PedService.pedList.find((ped) => ped.id === id);
    }

    static getIndexById(id: number) {
        return PedService.pedList.findIndex((ped) => ped.id === id);
    }

    static sync(player: alt.Player) {
        if (PedService.pedList.length) {
            alt.emitClient(player, PedEvent.Sync, PedService.pedList);
        }
    }
}

alt.on('playerConnect', PedService.sync);