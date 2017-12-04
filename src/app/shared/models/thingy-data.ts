import { User } from './user';

export class ThingyData {
    _id?: string;

    thingyID: string;

    user: User;

    date: Date;
    temperature: number;
    pressure: number;
    humidity: number;
    eco2: number;
    tvoc: number;
    colorRed: number;
    colorGreen: number;
    colorBlue: number;
    colorAlpha: number;
    button: number;
    tapDirection: number;
    tapCount: number;
    orientation: number;
    gyroscopeX: number;
    gyroscopeY: number;
    gyroscopeZ: number;
    latitude: number;
    longitude: number;
}
