export declare type PickPartial<T, K extends keyof T> = {
    [P in keyof T]?: T[P] | undefined;
} & {
    [P in K]: T[P];
};
export declare enum GatewayIPCMessageTypes {
    PACKET = 50
}
