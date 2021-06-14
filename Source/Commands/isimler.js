const { MessageEmbed } = require('discord.js');
const UserData = require('../Schema/UserData');
const settings = require('../Settings/settings.json');

module.exports = {
  name: "isimler",
  aliases: [""],
  run: async(client, message, args) => {

    function embed(msg) {
      let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(message.guild.name, message.guild.iconURL({dynamic:true})).setTimestamp().setDescription(msg)
    message.channel.send(embed).sil(10)
    }

    if(![settings.RegisterStaff].some(x => message.member.roles.cache.get(x)) && !message.member.hasPermission(8)) return embed("Hata: bu komudu kullanamzsın.");

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!user) return embed("Hata: Bir kullanıcı belirtin.")

    await UserData.find({ UserID: user.id }, async (err, data) => {
      if(err) return;
      if(!data) return embed("Hata: İsim kaydınız bulunamadı");
      data = data.reverse();
      let list = data.map((victim) => `\`${victim.Name}\` (${victim.Process})`).slice(0, 20).join("\n");
      embed(`${settings.No} ${user} (${user.roles.highest}) kullanıcısının toplamda **${data.length}** isim kaydı bulundu ve son 20 ismi altta sıralandı.\n\n${list}`)
    });


  }
}