import * as alt from 'alt-shared';

export declare interface IPed {
    id: number,
    model: string,
    position: alt.Vector3,
    heading: number,
    dimension: number;
    streamDistance: number;
    pedData: IPedData;
}

export declare interface IPedData {
    shopId: number | null;
}

export declare const enum PedEvent {
    Create = 'Ped:Create',
    Delete = 'Ped:Delete',
    Sync = 'Ped:Sync',
}