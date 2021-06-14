const { Client } = require('discord.js');
const client = new Client();
const settings = require('../Settings/settings.json');
const moment = require('moment');
const UserData = require('../Schema/UserData');
const NameData = require('../Schema/NameData');
const RegisterData = require('../Schema/RegisterData');


Promise.prototype.sil = function(time) {
if(this) this.then(message => {
  if(message.deletable) message.delete({ timeout: time * 1000 });
});
};

class lucyDatabase {

   static async man(user, admin) {
    await user.roles.cache.has(settings.BoosterRole) ? user.roles.set([ settings.ManRole, settings.BoosterRole ]) : user.roles.set([ settings.ManRole ])
    let regData = await RegisterData.findOne({ AdminID: admin.id })
    if(regData)
     { await regData.Man++; regData.Total++;  regData.save(); }
     else 
     { let d = await new RegisterData({ AdminID: admin.id, Man: 1, Woman: 0, Total: 1}); d.save() };
  };

    static async woman(user, admin) {
    await user.roles.cache.has(settings.BoosterRole) ? user.roles.set([ settings.WomanRole, settings.BoosterRole ]) : user.roles.set([ settings.WomanRole ])
    let regData = await RegisterData.findOne({ AdminID: admin.id })
    if(regData)
     { await regData.Woman++; regData.Total++; regData.save(); }
     else 
     { let f = await new RegisterData({ AdminID: admin.id, Man: 0, Woman: 1, Total: 1 }); f.save() };
  };

  static async setusername(user, name, process) {
    let x = await new UserData({ UserID: user.id, Name: name, Process: process }); x.save()
    let nameData = await NameData.findOne({ UserID: user.id });
    if(!nameData) 
    { let y = await new NameData({ UserID: user.id, LastName: name }); y.save()} 
    else
    { await NameData.findOneAndUpdate({ UserID: user.id }, { UserID: user.id, LastName: name }) }
  };


};

module.exports = {lucyDatabase}