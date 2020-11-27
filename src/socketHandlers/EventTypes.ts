export interface Socket<OnData, EmitData> {
  on: (event: string, callback: (data: OnData) => void) => void;
  emit: (event: string, data: EmitData) => void;
}

export type Handler = {
  [key: string]: (param: any) => void;
};

export type AppData = {
  allSockets: Socket<any, any>[];
};
