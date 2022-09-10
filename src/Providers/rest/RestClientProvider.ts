import { createRestManager, CreateRestManagerOptions } from "discordeno/rest";

interface OverwrittenCreateRestManagerOptions extends Omit<CreateRestManagerOptions, "token">  {
    token?: string;
    secretKey: string;
    customUrl: string;
}

export class RestClientProvider {
    options: OverwrittenCreateRestManagerOptions;
    constructor(options: OverwrittenCreateRestManagerOptions){
        this.options = options;
    }

    public build(options: {token: string}){
        this.options.token = options.token;
        return createRestManager(this.options as CreateRestManagerOptions);
    }

}

