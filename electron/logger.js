const logger = require('electron-log');

logger.server = function (data) {
  // data is from server std.out and may includes multiple lines
  const messages = data.toString().split('\n');
  messages.forEach(msg => {
    if (msg.length > 0) { 
      if (msg.startsWith('INFO')) logger.info(msg.substring(6));
      else if (msg.startsWith('WARN')) logger.warn(msg.substring(6));
      else if (msg.startsWith('ERROR')) logger.error(msg.substring(6));
      else if (msg.startsWith('DEBUG')) logger.debug(msg.substring(6));
      else logger.silly(msg);
    }
  });
}

module.exports = logger;
