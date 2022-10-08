"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
// @ts-nocheck
const mod_1 = require("../../mod");
const User_1 = require("./User");
const mod_2 = require("../../mod");
const ACTIVITIES = {
    PLAYING: 0,
    STREAMING: 1,
    LISTENING: 2,
    WATCHING: 3,
    CUSTOM: 4,
    COMPETETING: 5,
};
class Client extends mod_1.createBot {
    constructor(options = {}, options2) {
        super(options, options2);
        this._uptime = Date.now();
        this.user = new User_1.User(this, { id: options.botId });
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
                    };
                })
            };
            return await this.helpers.editBotStatus(ddOptions);
        };
        this._setApplicationCommands = async (commands, guildId, commandId) => {
            if (!Array.isArray(commands)) {
                return await this.helpers.editGlobalApplicationCommand(commandId, (0, mod_2.transformApplicationCommand)(commands), guildId);
            }
            const ddCommands = [];
            commands.forEach(x => ddCommands.push((0, mod_2.transformApplicationCommand)(x)));
            return await this.helpers.upsertGlobalApplicationCommands(ddCommands, guildId, commandId);
        };
        this.patchMe = (options = {}) => {
            this.user = new User_1.User(this, options);
            this.user.setActivity = this._setActivity;
            // @todo create application class
            this.application = { commands: { set: this._setApplicationCommands } };
            return this.user;
        };
    }
    get uptime() {
        Date.now() - this._uptime;
    }
}
exports.Client = Client;
