const { MessageEmbed, Client, Collection } = require('discord.js');
const client = new Client();
const buttons = require('discord-buttons'); buttons(client);
const moment = require('moment');
const ms = require('ms');
const mongoose = require('mongoose');
const fs = require('fs');
const settings = require('./Source/Settings/settings.json')
const UserData = require('./Source/Schema/UserData');
const NameData = require('./Source/Schema/NameData');

// Command Handlers 
const commands =  client.commands = new Collection();
const aliases = client.aliases = new Collection();

fs.readdirSync('./Source/Commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
  let command = require(`./Source/Commands/${files}`);
  if (!command.name) return console.log(`Hatalı Kod Dosyası => [./Source/Commands/${files}]`)
  commands.set(command.name, command);
  if (!command.aliases || command.aliases.length < 1) return
  command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})

client.on('message', message => {
  var prefix = settings.botPrefix
  if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(1).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return;
  cmd.run(client, message, args)
});
// Command Handlers

// Bot Ready
client.on("ready", () => {
  client.user.setPresence({ activity: { name: settings.botActivityName, type: settings.botActivityType }, status: settings.botStatus });
  client.channels.cache.get(settings.botVoiceChannel).join().catch();
  console.log("Bot Ready");
});
// Bot Ready

// MongoDB Connection
mongoose.connect(settings.mongoConnectionLink, {
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB")
});
mongoose.connection.on("error", () => {
  console.log("Something wrong! Don't connect to MongoDB");
});
// MongoDB Connection

// ------------------[ START ]------------------ \\

client.giris = (date) => {
const startedAt = Date.parse(date);
var msecs = Math.abs(new Date() - startedAt);
const years = Math.floor(msecs / ( 1000 * 60 * 60 * 24 * 365 ));
msecs -= years * 1000 * 60 * 60 * 24 * 365;
const months = Math.floor(msecs / ( 1000 * 60 * 60 * 24 * 30 ));
msecs -= months * 1000 * 60 * 60 * 24 * 30;
const weeks = Math.floor(msecs / ( 1000 * 60 * 60 * 24 * 7 ));
msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
const days = Math.floor(msecs / ( 1000 * 60 * 60 * 24 ));
msecs -= days * 1000 * 60 * 60 * 24
const hours = Math.floor(msecs / ( 1000 * 60 * 60 ));
msecs -= hours * 1000 * 60 * 60
const mins = Math.floor(msecs / ( 1000 * 60 ));
msecs -= mins * 1000 * 60
const secs = Math.floor(msecs / ( 1000 ));
msecs -= secs * 1000;

var string = "";
 if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;
  string = string.trim();
  return `${string} önce`;
}

client.on("guildMemberAdd", async (member) => {
let security = Date.now() - member.user.createdTimestamp > 1000 * 60 * 60 * 24 * 15 ? "güvenli" : "şüpheli"
let channel = client.channels.cache.get(settings.welcomeChannel);
let embed = new MessageEmbed().setColor("RANDOM").setAuthor(member.guild.name, member.guild.iconURL({dynamic: true})).setFooter("Lucy ❤️ " + member.guild.name).setTimestamp()
if(security === "şüpheli") {
 member.setNickname("Şüpheli")
 channel.send(embed.setDescription(`${member} (${member.id}) az önce sunucuya katıldı, fakat hesabı \`${moment(member.user.createdAt).locale("tr").format("LLL")}\` tarihinde \`(${client.giris(member.user.createdAt)})\` açıldığı için <@&${settings.Suspicious}> rolü verildi`));
 member.roles.add(settings.Suspicious);
} else if (security === "güvenli"){
 member.user.username.includes(settings.Tag) ? member.setNickname(`${settings.Tag} İsim | Yaş`) && member.roles.add(settings.FamilyRole) && member.roles.add(settings.Unregistered) : member.setNickname(`${settings.Untag} İsim | Yaş`) && member.roles.add(settings.Unregistered)
 channel.send(`
\`>\` Sunucumuza hoşgeldin ${member}! Seninle birlikte ${member.guild.memberCount} kişiye ulaştık.
    
    \`>\` Hesabın \`${moment(member.user.createdAt).locale("tr").format("LLL")}\` tarihinde \`(${client.giris(member.user.createdAt)})\` açılmış.
    
      \`>\` Sunucu kurallarımız <#${settings.rulesChannel}> kanalında belirtilmiştir. Unutma! Sunucu içerisindeki tutumun kuralların izin verdiği sınırları aşarsa gerekli ceza-i işlemler uygulanır.
    
    \`>\` Tagımızı \`(${settings.Tag})\` alarak bizlere destek olabilirsin.
    
\`>\` Sol taraftaki \`V.Confirmed\` kanallarından birine girip \`isim-yaş\` belirterek kayıt olabilirsin.`)
};
});

client.on("message", message => {
if(message.content.toLocaleLowerCase().includes(".tag" || "!tag" || "?tag" || "TAG")) return message.channel.send(settings.Tag)
});

client.on("guildMemberRemove", async (member) => {
let namedata = await NameData.findOne({ UserID: member.id });
let data = await new UserData({ UserID: member.id, Name: namedata.LastName, Process: "Sunucudan Ayrılma" }); data.save();
});


client.login(settings.botToken);
// ------------------[ END ]------------------ \\