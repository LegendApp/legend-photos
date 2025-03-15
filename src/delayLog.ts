const queue: any[] = [];

let timeout: any;
export function delayLog(...args: any[]) {
  queue.push(args);
  if (!timeout) {
    timeout = setTimeout(() => {
      timeout = undefined;
      queue.forEach((arg) => {
        console.log(...arg);
      });
      queue.length = 0;
    }, 1000);
  }
}
