import { emitter } from './emitter';

function sleep(time: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function statusEmitter() {
  async function doAsyncWork(eventName: string, status: string, time: number) {
    await sleep(time);
    console.log(status);
    emitter.emit(eventName, status);
  }

  await doAsyncWork('active', 'work_started', 500);
  await doAsyncWork('stalled', 'working', 3000);
  await doAsyncWork('completed', 'work_done', 4000);
}
