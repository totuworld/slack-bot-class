import * as debug from 'debug';

import {
  LogLevel,
  RTMClient,
  WebClient,
  WebAPICallResult
} from '@slack/client';

const log = debug('sb:server');

const SLACK_TOKEN: string = process.env.SLACK_TOKEN || 'token';

const rtm = new RTMClient(SLACK_TOKEN, { logLevel: LogLevel.ERROR });
const webClient = new WebClient(SLACK_TOKEN);

/*
 * rtm.on 으로 사용할 수 있는 event type은 다음 문서를 참고한다.
 * https://api.slack.com/events
 */

rtm.on('member_joined_channel', async event => {
  log(event);
  try {
    const welcomeMsg: WebAPICallResult & {
      ts?: string;
    } = await webClient.chat.postMessage({
      token: SLACK_TOKEN,
      channel: event.channel,
      text: `<@${event.user}> 님, 환영합니다.`
    });
    log(welcomeMsg);
  } catch (error) {
    log('An error occurred', error);
  }
});

(async () => {
  const start = await rtm.start();
  log('start: ', start);
})();
