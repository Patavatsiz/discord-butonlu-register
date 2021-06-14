const { MessageEmbed } = require('discord.js');
const RegisterData = require('../Schema/RegisterData');
const settings = require('../Settings/settings.json');

module.exports = {
  name: "topteyit",
  aliases: ["topteyit", "tt", "topkayıt"],
  run: async(client, message, args) => {

    function embed(msg) {
      let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(message.guild.name, message.guild.iconURL({dynamic:true})).setTimestamp().setDescription(msg)
    message.channel.send(embed)
    } 


    if(![settings.RegisterStaff].some(x => message.member.roles.cache.get(x)) &&!message.member.hasPermission(8)) return embed("Hata: Bu komudu kullanamazsın.");

    var array = [];

    await RegisterData.find({}, async(err, data) => {
      data.filter(x => message.guild.members.cache.has(x.AdminID)).map(async (x) => {
        await array.push({ AdminID: x.AdminID, Man: x.Man, Woman: x.Woman, Total: x.Total })
      });
    });

    let regData = array.sort((a, b) => b.Total - a.Total, 0).slice(0, 20);
    let push = regData.map((victim, index) => `\`${index + 1}.\` <@${victim.AdminID}>: Toplamda ${victim.Total} kaydı bulunmakta. \`(${victim.Man} Erkek / ${victim.Woman} Kadın)\`${victim.id === message.author.id ? " **(Siz)** " : ""}`);
    embed(`\`${message.guild.name}\` Sunucusunun en çok kayıt yapan ilk 20 yetkilisi altta sıralanmıştır.\n\n${push}`)


  }
}