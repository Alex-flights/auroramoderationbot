const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promtMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "Bans the Member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        // No Args
        if (!args[0]) {
            return message.reply("Please provide a person to ban!")
                .then(m => m.delete(5000));
        }

        // No Reason
        if (!args[1]) {
            return message.reply("Please provide a reason to ban!")
                .then(m => m.delete(5000));
        }

        // No Author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("You don't have permission to do it buddy please contant staff.")
                .then(m => m.delete(5000));
        }

        // No bot permission
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("Aurora doesnt have perm **BAN_MEMBERS** Please give it to the bot and try again!")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("Couldn't find that member, try again!")
                .then(m => m.delete(5000));
        }

        // Can't kick yourself
        if (message.author.id === toBan.id) {
            return message.reply("You can't ban yourself silly but you can destory the woman Aurora")
                .then(m => m.delete(5000));
        }
        // Bannable
        if (!toBan.bannable) {
            return message.reply("I cant ban person due to role hierarchy, i suppose.")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Banned Member:** ${toBan} (${toBan.id})
            **> Banned By:** ${message.author} (${message.author.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to Ban ${toBan}?`);

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promtMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Err....... Someting wen't wrong?`)
                    });

                logChannel.send(embed);
        } else if (emoji === "❌") {
            msg.delete();

            message.reply("Ban canceled...")
                .then(m => m.delete(5000));
        }
        })
    }
}