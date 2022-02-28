import * as alt from 'alt-client';
import * as game from 'natives';
import {IPed, IPedData, PedEvent} from '../../shared/streamer';
import {loadModel} from './index';

export class PedStreamer implements IPed {
    public static pedList: Array<PedStreamer> = [];
    public id: number;
    public model: string;
    public position: alt.Vector3;
    public heading: number;
    public dimension: number;
    public streamDistance: number;
    public pedData: IPedData;

    public gameHandle: number | null;

    constructor(pedData: IPed) {
        this.id = pedData.id;
        this.model = pedData.model;
        this.position = pedData.position;
        this.heading = pedData.heading;
        this.dimension = pedData.dimension;
        this.streamDistance = pedData.streamDistance;
        this.pedData = pedData.pedData;
        this.gameHandle = null;

        PedStreamer.pedList.push(this);
    }

    static sync(pedList: Array<any>) {
        PedStreamer.pedList = pedList;
    }

    static create(pedData: IPed) {
        new PedStreamer(pedData);
    }

    static delete(id: number) {
        const pedIndex = PedStreamer.getIndexById(id);

        if (pedIndex < 0) {
            return;
        }

        const gameHandle = PedStreamer.pedList[pedIndex].gameHandle;

        PedStreamer.pedList.splice(pedIndex, 1);
        game.deletePed(gameHandle);
    }

    static getById(id: number) {
        return PedStreamer.pedList.find((ped) => ped.id === id);
    }

    static getIndexById(id: number) {
        return PedStreamer.pedList.findIndex((ped) => ped.id === id);
    }

    static updateObjectHandle(id: number, gameHandle: number) {
        const ped = PedStreamer.getById(id);

        if (!ped) {
            return;
        }

        ped.gameHandle = gameHandle;
    }

    static async show(ped: PedStreamer) {
        const hash = alt.hash(ped.model);
        await loadModel(ped.model);

        const createdPed = game.createPed(1, hash, ped.position.x, ped.position.y, ped.position.z - 0.5, ped.heading, false, false);
        game.setEntityHeading(createdPed, ped.heading);
        game.freezeEntityPosition(createdPed, true);

        game.taskSetBlockingOfNonTemporaryEvents(ped.heading, true);
        game.setBlockingOfNonTemporaryEvents(ped.heading, true);
        game.setPedFleeAttributes(ped.heading, 0, false);
        game.setPedCombatAttributes(ped.heading, 17, true);
        game.setEntityInvincible(ped.heading, true);
        game.setPedCanBeTargetted(ped.heading, false);
        game.freezeEntityPosition(ped.heading, true);

        ped.gameHandle = createdPed;
        PedStreamer.updateObjectHandle(ped.id, createdPed);
    }

    static hide(ped: PedStreamer) {
        game.deletePed(ped.gameHandle);

        ped.gameHandle = null;
        PedStreamer.updateObjectHandle(ped.id, null);
    }

    static async checkPeds() {
        if (alt.Player.local && alt.Player.local.pos) {
            let myDimension: number = 0;
            if (alt.Player.local.hasMeta('dimension')) {
                myDimension = alt.Player.local.getMeta('dimension');
            }

            for(const ped of PedStreamer.pedList) {
                const pedPos = new alt.Vector3(ped.position.x, ped.position.y, ped.position.z);
                const isInRange = alt.Player.local.pos.isInRange(pedPos, ped.streamDistance);

                if (ped && !ped.gameHandle && isInRange && myDimension === ped.dimension) {
                    await PedStreamer.show(ped);
                }

                if (ped.gameHandle && (!isInRange || myDimension !== ped.dimension) && game.doesEntityExist(ped.gameHandle)) {
                    PedStreamer.hide(ped);
                }
            }
        }
    }
}

alt.onServer(PedEvent.Sync, PedStreamer.sync);
alt.onServer(PedEvent.Create, PedStreamer.create);
alt.onServer(PedEvent.Delete, PedStreamer.delete);
alt.setInterval(PedStreamer.checkPeds, 1000);