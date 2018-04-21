import Request from '../models/requests';
import RequestResponse from '../models/requestResponse';
import {Observable, Subject} from 'rxjs';
import RequestBean from '../beans/request.beans';
import _ from 'lodash';
import helpers from '../helpers';

export default {
  queue: [],
  queue$: new Subject(),
  /**
   *  
   * @param {Request} request 
   */
  push(request) {
    this.queue$.next(JSON.parse(JSON.stringify(request)));
  },

  getQueue() {
    return this.queue;
  },

  pullRequest(requestId) {
    _.pullAllBy(this.queue, (q) => q._id === requestId);
  },

  process() {
    this.queue$
      .do((request) => this.queue.push(request))
      .flatMap((request) => Observable.fromPromise(this.treat(request)).combineLatest(Observable.of(request)))
      .subscribe((responsePayload) => {
        console.log('Process Worker :: Request treated : ', responsePayload[0]);
        this.pullRequest(responsePayload[1]._id);
      });
  },

  treat(request) {
    switch(request.type) {
      case 'joinLobby':
      return RequestBean.joinLobby(request);
      case 'createGame':
      return RequestBean.createGame(request);
      case 'joinGame':
      return RequestBean.joinGame(request);
      default:
      return helpers.wrapInPromise(RequestBean.throwError('rejected', 'Unknown request type', request));
    }
  }
};