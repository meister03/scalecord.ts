"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLORS = exports.permissionOverwritesTypes = exports.DISCORD_EPOCH = void 0;
exports.DISCORD_EPOCH = 1_420_070_400_000;
var permissionOverwritesTypes;
(function (permissionOverwritesTypes) {
    permissionOverwritesTypes[permissionOverwritesTypes["role"] = 0] = "role";
    permissionOverwritesTypes[permissionOverwritesTypes["member"] = 1] = "member";
})(permissionOverwritesTypes = exports.permissionOverwritesTypes || (exports.permissionOverwritesTypes = {}));
exports.COLORS = {
    DEFAULT: 0x000000,
    AQUA: 0x1abc9c,
    WHITE: 0xffffff,
    BLUE: 0x3498db,
    GREEN: 0x57f287,
    PURPLE: 0x9b59b6,
    YELLOW: 0xfee75c,
    ORANGE: 0xe67e22,
    GOLD: 0xf1c40f,
    NAVY: 0x34495e,
    RED: 0xed4245,
    GREY: 0x95a5a6,
    GREYPLE: 0x99aab5,
    BLURPLE: 0x5865f2,
};
