const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    var item  = "";
    var time;
    var winnerCount;

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("❌Sorry no permission to do it. **__OOF__**❌");

    // a?giveaway | winners | time | giveaway name |

    winnerCount = args[0];
    time = args[1];
    item = args.splice(2, args.length).join(" ");

    message.delete();

    var date = new Date().getTime();
    var dateTime = new Date(date + (time * 1000));

    var embed = new discord.RichEmbed()
        .setTitle("🎉  **__GIVEAWAY__**  🎉")
        .setFooter(`Giveaway ends at: ** ${dateTime}`)
        .setDescription(item);

    var embedSend = await message.channel.send(embed);
    embedSend.react("🎉");

    setTimeout(function() {

        var random = 0;
        var winners = [];
        var inList = false;

        var peopleReacted = embedSend.reactions.get("🎉").users.array();

        
        for (let i = 0; i < peopleReacted.length; i++) {

            if(peopleReacted[i].id == bot.user.id){
                peopleReacted.splice(i, 1);
                continue;
            }
        }

        if(peopleReacted.length == 0){
            return message.channel.send("No one reacted exept the bot no winner found, exept Aurora! ;(")
        }

        if(peopleReacted.length < winnerCount){
            return message.channel.send("There are too few players who participated so Aurora has won. F in the chat ;(")
        }

        for (let i = 0; i < winnerCount; i++) {

            inList = false;

            random = Math.floor(Math.random() * peopleReacted.length);

            for (let y = 0; y < winnerCount.length; y++) {
                
                if(winners[y] == peopleReacted[random]){
                    inList = true;
                    i--;
                    break;
                }

            }

            if(!inList){
                winners.push(peopleReacted[random]);
            }

        }

        for (let i = 0; i < winners.length; i++) {
            

            message.channel.send("Proficiat " + winners[i] + `**⚠ __ ${item} YOU HAVE WON THE GIVEAWAY PLEASE DM _Aurora_#2020 to claim! (Server Owner)__ ⚠**`);
        }
        
    }, time * 1000);


}

module.exports = {
    name: "giveaway",
    category: "moderation",
    description: "Starts the giveaway"
}