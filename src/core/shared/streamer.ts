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
}

export declare const enum PedEvent {
    Create = 'Ped:Create',
    Delete = 'Ped:Delete',
    Sync = 'Ped:Sync'
}

export declare interface IObject {
    id: number,
    model: string,
    position: alt.Vector3,
    heading: number,
    onGroundProperly: boolean,
    collision: boolean,
    dimension: number;
    streamDistance: number;
    objectData: IObjectData;
}

export declare interface IObjectData {
    
}

export declare const enum ObjectEvent {
    Create = 'Object:Create',
    Delete = 'Object:Delete',
    Sync = 'Object:Sync'
}