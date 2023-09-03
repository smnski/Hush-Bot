import { CommandInteraction } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { Users } from "../../databases/user/models";

const adminUnbanAllCommand: ISlvtCommand = {
    guild_cooldown_short: 15 * 60,
    data: {
        type: 1,
        name: "admin_unban_all",
        description: "Lifts the ban on every user in the server.",
        defaultMemberPermissions: "8",
        options: []
    },
    async execute(interaction: CommandInteraction) {

        const guild_id = interaction.guildID!;
        const field = ["anon_banned"];
        const criteria = [true];
        const value = [false];
        let amount: number;

        try {
            amount = await Users.changeMatchingAnons(guild_id, field, criteria, value);
        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createMessage({ content: `Successfully unbanned ${amount} users.`, flags: 64 });
    }
}

export default adminUnbanAllCommand;