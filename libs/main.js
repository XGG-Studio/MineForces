#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.10')
  .option('-s, --setting <path>', 'the path of the setting file')
  .option('-u, --user <user_name>', 'add your id to team value')
  .option('-f, --force', 'force updating the problem')
  .parse(process.argv);

var fs = require('fs');
var util = require('./util');

var saveDirectory = util.getSaveDirectory();
if (!fs.existsSync(saveDirectory)){
    fs.mkdirSync(saveDirectory);
}

function setUserSetting(callback) {
  var log = require('./log');
  var setting = require('./setting');
  setting = new setting.Setting();
  if (program.setting) {
    fs.readFile(program.setting, function(err, data) {
      if (err) {
        log.fail('Cannot find user setting file: ' + program.setting);
      } else {
        var user_setting;
        try {
          user_setting = JSON.parse(data);
        } catch(e) {
          log.fail('Invalid JSON file: ' + e);
        }
        if (user_setting) {
          setting.setUserSetting(user_setting);
          callback(setting);
        }
      }
    });
  } else {
    callback(setting);
  }
}

setUserSetting(function(setting) {
  if (program.user) {
    setting.addUser(program.user);
  }
  if (program.force) {
    setting.setForceUpdate();
  }
  var filter = require('./filter');
  filter.outputFilteredProblemSets(setting);
});
