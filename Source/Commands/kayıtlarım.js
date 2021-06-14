const { MessageEmbed } = require('discord.js');
const RegisterData = require('../Schema/RegisterData');
const settings = require('../Settings/settings.json');

module.exports = {
  name: "kayıtlarım",
  aliases: ["kayıtlar", "teyitsay", "teyitlerim"],
  run: async(client, message, args) => {

    function embed(msg) {
      let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(message.guild.name, message.guild.iconURL({dynamic:true})).setTimestamp().setDescription(msg)
    message.channel.send(embed).sil(10)
    } 


    if(![settings.RegisterStaff].some(x => message.member.roles.cache.get(x)) && !message.member.hasPermission(8)) return embed("Hata: Bu komudu kullanamazsın.");

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(user && !user.roles.cache.has(settings.RegisterStaff)) return embed(`Hata: bu kullanıcı yetkili değil!`);
    if(user) {
    await RegisterData.find({ AdminID: user.id }, async(err, data) => {
      if(err)return;
      if(!data) return embed("Kullanıcı daha önce hiç kayıt yapmamış!");
      let kayıts = data.map(x => `${message.author} (${message.member.roles.highest}) kullanıcısının ;\n\`•\` Toplam Kayıt Sayısı: ${x.Total ? x.Total : "0"}\n\`•\` Toplam Erkek Kayıt Sayısı: ${x.Man ? x.Man : "0"}\n\`•\` Toplam Kadın Kayıt Sayısı: ${x.Woman ? x.Woman : "0"}`)
      embed(kayıts)
    })
    } else if(!user){
    await RegisterData.find({ AdminID: message.author.id }, async(err, data) => {
      if(err)return;
      if(!data) return embed("Kullanıcı daha önce hiç kayıt yapmamış!");
      let kayıts = data.map(x => `${message.author} (${message.member.roles.highest}) kullanıcısının ;\n\`•\` Toplam Kayıt Sayısı: ${x.Total ? x.Total : "0"}\n\`•\` Toplam Erkek Kayıt Sayısı: ${x.Man ? x.Man : "0"}\n\`•\` Toplam Kadın Kayıt Sayısı: ${x.Woman ? x.Woman : "0"}`)
      embed(kayıts)
    })
   }
  }
}