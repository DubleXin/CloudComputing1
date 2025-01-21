import { GetController } from './getController.js';
import { PostController } from './postController.js';

export class RouteController {
  #getController;
  #postController;
  constructor(app) {
    console.log('Routes has been initiated!');

    this.#getController = new GetController(app);
    this.#postController = new PostController(app);
  }
}
