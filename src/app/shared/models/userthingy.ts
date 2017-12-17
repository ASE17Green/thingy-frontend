export class Userthingy {
    _id?: string;

    userID: string;
    thingyID: string;

    thingyMinTemperature: number;
    thingyMaxTemperature: number;
    endLatitude: number;
    endLongitude: number;

    thingyTemperatureMessageSent: boolean;
    packageArrivedMessageSent: boolean;
    packageStartedMessageSent: boolean;
}
