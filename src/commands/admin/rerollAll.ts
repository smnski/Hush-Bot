import { CommandInteraction, User } from "oceanic.js";
import { ISlvtCommand } from "../../bot";
import { Users } from "../../databases/user/models";

const adminRerollAllCommand: ISlvtCommand = {
    guild_cooldown_short: 15 * 60,
    data: {
        type: 1,
        name: "admin_reroll_all",
        description: "Rerolls the anonymous username of every bot user on the server.",
        defaultMemberPermissions: "8",
        options: []
    },
    async execute(interaction: CommandInteraction) {

        interaction.defer(64);

        const guild_id = interaction.guildID!;

        const fields = ["anon_id", "anon_color"];
        let anon_info: [string, number], amount = 0;

        try {
            // Deletes all anon_ids to make generating new ones faster.
            await Users.changeMatchingAnons(guild_id, ["anon_id"], [], [""]);

            const users = await Users.find({});

            for(const user of users) {
                anon_info = await Users.generateAnonID(guild_id);
                const values = [anon_info[0], anon_info[1]];
                await user.changeGuild(guild_id, fields, values);
                amount++;
            }

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }
        await interaction.createFollowup({ content: `Successfully rerolled ${amount} users.`, flags: 64 });
    }
}

export default adminRerollAllCommand;