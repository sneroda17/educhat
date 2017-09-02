export default function(delay) {
  return new Promise(resolve => {
    setTimeout(_ => {
      resolve();
    }, delay.millis);
  });
}
