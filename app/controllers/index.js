import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  queryParams = ['categories', 'statuses'];

  @tracked categories = ['1', '2', '3', '4', '5', '6'];
  @tracked statuses = ['0', '1', '2'];
}
