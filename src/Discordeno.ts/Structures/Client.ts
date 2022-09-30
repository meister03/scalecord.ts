// @ts-nocheck
import { createBot } from "../../mod";
import { User } from "./User";
import { transformApplicationCommand } from "../../mod";
const ACTIVITIES = {
    PLAYING: 0,
    STREAMING: 1,
    LISTENING: 2,
    WATCHING: 3,
    CUSTOM: 4,
    COMPETETING: 5,
}


export class Client extends createBot {
    constructor(options = {}, options2) {
        super(options, options2);
        this.uptime = Date.now();
        this.user = new User(this, { id: options.botId });
        this._setActivity = async (content, activities) => {
            const status = activities.status;
            activities = [activities];
            const ddOptions = {
                status: status || 'online',
                activities: activities.map(activity => {
                    return {
                        type: ACTIVITIES[activity.type.toUpperCase()],
                        name: content,
                        url: activity.url,
                        applicationId: this.user.id,
                    }
                })
            };
            return await this.helpers.editBotStatus(ddOptions);
        };

        this._setApplicationCommands = async (commands, guildId, commandId) => {
            if (!Array.isArray(commands)) {
                return await this.helpers.upsertApplicationCommand(commandId, transformApplicationCommand(commands), guildId);
            }
            const ddCommands = [];
            commands.forEach(x => ddCommands.push(transformApplicationCommand(x)));
            return await this.helpers.upsertApplicationCommands(ddCommands, guildId, commandId);
        }

        this.patchMe = (options = {}) => {
            this.user = new User(this, options);
            this.user.setActivity = this._setActivity;
            // @todo create application class
            this.application = { commands: { set: this._setApplicationCommands } };
            return this.user;
        }
    }
}
