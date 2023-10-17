import { LoaderFunctionArgs } from '@remix-run/node';
import { eventStream } from 'remix-utils/sse/server';
import { emitter } from '~/emitter';

export async function loader({ request }: LoaderFunctionArgs) {
  console.log('🔴 Abort signal:', request.signal);

  return eventStream(request.signal, (send) => {
    function handle(state: string) {
      try {
        send({ event: 'reportStatus', data: state });
      } catch (error) {
        console.log(error, 'Error at the `send()` method:');
      }
    }

    emitter.on('active', (state) => {
      handle(state);
    });

    emitter.on('stalled', (state) => {
      handle(state);
    });

    emitter.on('completed', (state) => {
      handle(state);
    });

    return () => {
      emitter.off('active', handle);
      emitter.off('stalled', handle);
      emitter.off('completed', handle);
    };
  });
}
