import { Observable } from 'rxjs';
import { serverBuilder } from 'rxjs-grpc';

import { helloworld } from './grpc-namespaces';

async function main() {
  type ServerBuilder = helloworld.ServerBuilder;
  const server = serverBuilder<ServerBuilder>('helloworld.proto', 'helloworld');

  server.addGreeter({

    sayHello(request) {
      return Observable.of({
        message: 'Hello ' + request.name
      });
    },

    sayMultiHello(request): Observable<helloworld.HelloReply> {
      return Observable.timer(100, 500)
        .mapTo<number, helloworld.HelloReply>({
          message: `Hello ${request.name}`,
          room: helloworld.Room.SECOND
        })
        .take(request.num_greetings);
    }

  });

  server.start('0.0.0.0:50051');
}

main().catch(error => console.error(error));
