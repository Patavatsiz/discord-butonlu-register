const { MessageEmbed, Client } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const client = new Client();
const settings = require('../Settings/settings.json');
const {lucyDatabase} = require('../Functions/lucyDatabase');
module.exports = {
  name: "isim",
  aliases: ["i", "name"],
  run: async(client, message, args) => {

  function embed(msg) {
    let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(message.guild.name, message.guild.iconURL({dynamic:true})).setTimestamp().setDescription(msg)
    message.channel.send(embed).sil(10)
  }

    if(![settings.RegisterStaff].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission(8)) return embed(`Bu komudu kullanmak için gerekli rollere veya izinlere sahip değilsin.`)

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!user || user.id === message.author.id || user.id === message.guild.OwnerID || user.bot || user.roles.highest.position >= message.member.roles.highest.position) return embed("Bu kullanıcıyı kayıt edemem veya bir kullanıcı belirtmedin.")
    
    if(!args[1]) return embed("Hata: Bir isim belirtmelisin");
    let name_1 = args[1].charAt(0).replace("i", "İ").toLocaleUpperCase() + args[1].slice(1).toLocaleLowerCase();
    let age = Number(args[2]);
    let fix = user.user.username.includes(settings.Tag) ? settings.Tag : settings.Untag
    let name_2
    if(age) name_2 = `${fix} ${name_1} | ${age}`
    if(!age) name_2 = `${fix} ${name_1}`
    await user.setNickname(name_2);

    if(!user.roles.cache.has(settings.ManRole) && !user.roles.cache.has(settings.WomanRole)) {

    var button_1 = new MessageButton()
    .setID("MAN")
    .setLabel("🚹 Erkek")
    .setStyle("gray")

    var button_2 = new MessageButton()
    .setID("WOMAN")
    .setLabel("🚺 Kadın")
    .setStyle("gray")
    
    let msgembed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.member.displayName, message.author.avatarURL({dynamic:true}))
    .setDescription(`${user} kullanıcının adı başarıyla \`"${name_2}"\` olarak değiştirildi.\n\nLütfen 30 saniye alttaki butonlara basarak kullanıcının cinsiyetini belirleyin.\n\nKullanıcının eski isimlerine bakarak kaydetmeniz önerilir, eski isimler için \`${settings.botPrefix}isimler <user>\``)
    .setFooter(message.guild.name, message.guild.iconURL({dynamic:true}))
    .setTimestamp();

    let msg = await message.channel.send({ buttons : [ button_1, button_2 ], embed: msgembed})
    
    var filter = (button) => button.clicker.user.id === message.author.id;
   
    let collector = await msg.createButtonCollector(filter, { time: 30000 })

      collector.on("collect", async (button) => {
      message.react(settings.Yes)
      if(button.id === "MAN") {
      await lucyDatabase.man(user, message.author)
      await lucyDatabase.setusername(user, name_2, `<@&${settings.ManRole}>`)
      await button.think(true)
      await button.reply.edit(`${user} adlı kullanıcı başarıyla <@&${settings.ManRole}> rolüyle kayıt edildi`)
      }
      if(button.id === "WOMAN") {
      await lucyDatabase.woman(user, message.author)
      await lucyDatabase.setusername(user, name_2, `<@&${settings.WomanRole}>`)
      await button.think(true)
      await button.reply.edit(`${user} adlı kullanıcı başarıyla <@&${settings.WomanRole}> rolüyle kayıt edildi`)
  }
    });

    collector.on("end", async () => {
      msg.delete();
    });


  } else {
    await user.setNickname(name_2)
    lucyDatabase.setusername(user, name_2, "İsim Değiştirme")
    embed(`${user} kullanıcının adı başarıya \`"${name_2}"\` olarak değiştirildi.`)
  }

  }
}