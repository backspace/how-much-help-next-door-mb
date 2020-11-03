import Route from '@ember/routing/route';
import requests from '../util/requests';

export default class IndexRoute extends Route {
  model() {
    return requests;
  }
}
