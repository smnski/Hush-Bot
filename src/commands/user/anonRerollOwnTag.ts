import { CommandInteraction, TextChannel } from "oceanic.js";
import { IHushCommand } from "../../bot";
import { Configs } from "../../databases/config/models";
import { Users } from "../../databases/user/models";

const anonRerollOwnTagCommand: IHushCommand = {
    user_cooldown_long: 7 * 24 * 60 * 60 * 1000, //one week
    data: {
        type: 1,
        name: "anon_reroll_tag",
        description: "Rerolls your current anonymous tag. Usable once a week.",
        defaultMemberPermissions: "1024",
    },
    async execute(interaction: CommandInteraction) {

        const user_id = interaction.user.id!;
        const guild_id = interaction.guildID!;
        let rolled_id: string;

        try {
           const found_log_channel_id = await Configs.getLogChannel(guild_id);

            if(!found_log_channel_id) {
                await interaction.createMessage({ content: "This command cannot be used while a log channel isn't set up on the server.", flags: 64 });
                return;
            }

            const log_channel = interaction.client.getChannel(found_log_channel_id) as TextChannel;
            if(!log_channel.permissionsOf(interaction.client.user.id).has("VIEW_CHANNEL", "SEND_MESSAGES")) {
                await interaction.createMessage({ content: "This command cannot be used while the bot cannot send messages in server's log channel.", flags: 64 });
                return;
            }

            const found_user = await Users.getUser(user_id);
            if(!found_user) {
                await interaction.createMessage({ content: "You didn't use the bot yet and don't have a tag assigned.", flags: 64 });
                return;
            }

            const found_guild = found_user.getGuild(guild_id);
            if(!found_guild) {
                await interaction.createMessage({ content: "You didn't use the bot in this server yet and don't have a tag assigned.", flags: 64 });
                return;
            }

            const remaining_cd = found_guild.reroll_timestamp! - Date.now();
            if(remaining_cd > 0) {
                const remaining_cd_hours = Math.ceil(remaining_cd / (60 * 60 * 1000));
                await interaction.createMessage({ content: `You can only reroll your own tag once a week. Remaining cooldown: ~${remaining_cd_hours} hours.`, flags: 64 });
                return;
            }

            const old_id = found_guild.anon_id;
            const old_color_attr = old_id.split(" ")[0];

            const anon_info = await Users.generateAnonIDStrict(guild_id, old_color_attr);

            found_guild.reroll_timestamp = Date.now() + this.user_cooldown_long!;
            found_guild.anon_id = anon_info[0];
            found_guild.anon_color = anon_info[1];
            await found_user.save();

            rolled_id = anon_info[0];

            await interaction.client.rest.channels.createMessage(found_log_channel_id, 
                { content: `${user_id} rerolled their anonymous tag from: "${old_id}" to: "${rolled_id}"` });

        } catch(error) {
            console.log(error);
            await interaction.createMessage({ content: "Something went wrong while interacting with the database.", flags: 64 });
            return;
        }

        await interaction.createMessage({ content: `Your tag was successfully rerolled to: ${rolled_id}`, flags: 64 });
    }
}

export default anonRerollOwnTagCommand;