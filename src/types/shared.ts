export type PickPartial<T, K extends keyof T> =
  & {
    [P in keyof T]?: T[P] | undefined;
  }
  & { [P in K]: T[P] };

export enum GatewayIPCMessageTypes {
  PACKET = 50,
  
} 