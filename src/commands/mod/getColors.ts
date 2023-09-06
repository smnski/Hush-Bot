import { CommandInteraction } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { color_data } from "../../data/colors";

const modPingCommand: ISlvtCommand = {
    data: {
        type: 1,
        name: "mod_get_colors",
        description: "Shows *only to you* available colors for embeds and nicknames.",
        defaultMemberPermissions: "4",
        options: []
    },
    async execute(interaction: CommandInteraction) {/*
        const available_colors = (color_data.map(x => x.color_name)).join(", ");
        await interaction.createMessage({ content: `Available colors:\n${available_colors}` , flags: 64 });
        */
    }
}

export default modPingCommand;