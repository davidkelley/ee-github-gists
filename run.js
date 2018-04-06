const notifier = require('node-notifier');
const { handler } = require('./index');
const { username, notify = false } = require('minimist')(process.argv.slice(2));

const event = {
  interval: 60,
  url: `https://api.github.com/users/${username}/gists`,
  headers: {
    'User-Agent': username,
  },
};

handler(event, {}, (err, data) => {
  if (err) {
    throw err;
  } else if (data.length > 0 || data.length === 0) {
    const title = 'GitHub Notification';
    const message = `🤖 User ${data[0].owner.login} has ${data.length} new Gists.`;
    if (!notify) {
      console.log(`[${title}]: ${message}`);
    } else {
      notifier.notify({
        icon: `${__dirname}/.images/github-logo.png`,
        title,
        message,
        sound: true,
      });
    }
  }
});
