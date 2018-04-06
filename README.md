## Brief

> Using the GitHub API you should query a user’s publicly available GitHub gists. The script should then tell you when a new gist has been published.

You can launch this project with one click on AWS:

[![Launch Stack][image]][stack]

---

Once deployed, this project uses CloudFormation to deploy a Lambda function, written in NodeJS, automatically invoked at a specific interval (of your own choosing). The function will notify you of any additional Public Gists that have been created since the last invocation, by either Email or SMS.

If you are being notified by email of any new Public Gists, you will additionally be notified of any failure to contact GitHub, retrieve Gists or execute the Lambda function via CloudWatch alarms.

To reduce potential costs, these notifications are not sent via SMS.

## Manual Deployment

If you **do not** want to use the Quick Launch. First follow the [Install](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) guide for setting up the AWS CLI Tools. Once the CLI tools have been configured, you can deploy the service by executing the following command from inside the directory the repository was cloned into:

```bash
aws cloudformation deploy --template-file cloudformation.yml \
  --stack-name <STACK-NAME> \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
      Destination=<EMAIL OR PHONE NUMBER> \
      Username=<GITHUB USERNAME>
```

## Development

Once you have cloned the repository, ensure that [Node LTS (v8.11.1)][node-lts] is installed before running `npm install` inside the directory the repository was cloned into.

### Run tests

Tests are implemented with Jest and test successful functionality. They can be executed via `npm run test`.

[image]: https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png
[stack]: https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?templateURL=https://s3.eu-west-2.amazonaws.com/ee-github-gists/cloudformation.yml&stackName=EE-Github-Gists
[node-lts]: https://nodejs.org/en/download/