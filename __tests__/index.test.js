const AWS = require('aws-sdk-mock');
const nock = require('nock');
const faker = require('faker');
const { handler } = require('../index');

describe('#handler', () => {
  const username = faker.internet.userName();

  const gist = () => ({ owner: { login: username, url: faker.internet.url() } });

  const gists = (min = 1, max = 10) => (new Array(faker.random.number({ min, max })).fill(gist()));

  describe('when the request is valid', () => {
    const data = gists();

    const domain = 'https://api.github.com';

    const path = `users/${username}/gists`;

    const event = {
      topicArn: faker.random.uuid(),
      url: `${domain}/${path}`,
      interval: faker.random.number(),
      headers: {
        'User-Agent': username,
      },
    };

    let mockGithub;

    beforeEach(() => {
      mockGithub = nock(domain).get(`/${path}`).query(true).reply(200, data);
    });

    afterEach(() => {
      nock.restore();
    });

    let mockPublish;

    beforeEach(() => {
      mockPublish = jest.fn((params, cb) => { process.nextTick(() => cb(null, {})); });
      AWS.mock('SNS', 'publish', mockPublish);
    });

    afterEach(() => {
      AWS.restore('SNS');
    });

    it('responds correctly', (done) => {
      handler(event, {}, (err, response) => {
        expect(err).toBe(null);
        expect(response).toHaveLength(data.length);
        expect(mockGithub.isDone()).toBe(true);
        expect(mockPublish).toHaveBeenCalledWith(expect.objectContaining({
          TopicArn: event.topicArn,
          MessageStructure: 'json',
          Subject: expect.any(String),
          Message: expect.stringContaining(username),
        }), expect.any(Function));
        done();
      });
    });
  });
});
