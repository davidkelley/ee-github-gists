const https = require('https');
const AWS = require('aws-sdk');
const URL = require('url');

const publish = (TopicArn, data) => {
  const Subject = `User "${data[0].owner.login}" has ${data.length} new Gists.`;
  const Body = `View the gists here: ${data[0].owner.url}/gists`;
  const Message = JSON.stringify({ default: Subject, email: Body });
  const params = { Message, Subject, TopicArn, MessageStructure: 'json' };
  return new AWS.SNS({ region: process.env.AWS_REGION }).publish(params).promise();
};

const send = ({ topicArn }, cb, raw) => {
  const data = JSON.parse(raw);
  const finish = () => cb(null, data);
  if (data.length === 0) return finish();
  publish(topicArn, data).then(finish).catch(cb);
};

exports.handler = (event, ctx, cb) => {
  let body = '';
  const { url, interval, headers } = event;
  const { host, pathname } = URL.parse(url);
  const since = new Date(+new Date() - (1000 * 60 * interval)).toISOString();
  const req = https.get({ host, path: `${pathname}?since=${since}`, headers }, (res) => {
    res.setEncoding('utf8');
    res.on('data', (data) => { body += data; });
    res.on('end', () => send(event, cb, body));
  }).on('error', cb)
};
