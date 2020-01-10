const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "info",
    description: "Find out some nice instagram statistics",
    usage: "<name>",
    run: async (client, message,args) => {
        const name = args.join(" ");

        if (!name){
            return message.reply("Maybe it is genious to search for someone...!")
                .then(m => m.delete(5000));
        }

        const url = `https://instagram.com/${name}/?__a=1`;
        const res = await fetch(url).then(url => url.json());

        if (!res.graphql.user.username) {
            return message.reply("I couldn't find that account... 😭")
                .then(m => m.delete(5000));
        }

        const account = res.graphql.user;

        console.log(account.edge_owner_to_timeline_media);

        const embed = new RichEmbed()
            .setColor("BLUE")
            .setTitle(account.full_name)
            .setURL(account.external_url_linkshimmed)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Profile information", stripIndents`**- Username:** ${account.username}
            **- Full Name:** ${account.full_name}
            **- Biography:** ${account.biography.length == 0 ?  "none" : account.biography}
            **- Posts:** ${account.edge_owner_to_timeline_media}
            **- Followers:** ${account.edge_followed_by_count}
            **- Following:**  ${account.edge_follow.count}
            **- Private Account:** ${account.is_private ? "Yes 🔐" : "Nope 🔓"}`);

        message.channel.send(embed);
    }
}