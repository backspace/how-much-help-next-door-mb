import Component from '@glimmer/component';
import { DateTime, Interval } from 'luxon';

export default class ActiveRequestComponent extends Component {
  get requestMade() {
    return DateTime.fromMillis(this.args.request.createdTime).toFormat(
      'LLL dd'
    );
  }

  get requestMatched() {
    const matchedTime = this.args.request.matchedTime;

    if (matchedTime) {
      const matchedDateTime = DateTime.fromMillis(matchedTime);
      const interval = Interval.fromDateTimes(
        DateTime.fromMillis(this.args.request.createdTime),
        matchedDateTime
      ).count('days');

      const intervalString = interval > 1 ? `(${interval} days)` : '';

      return `${matchedDateTime.toFormat('LLL dd')} ${intervalString}`;
    } else {
      return 'never';
    }
  }
}
