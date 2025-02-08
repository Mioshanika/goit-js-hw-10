import izitoast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function createPromise(delay, state) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') resolve(delay);
      else reject(delay);
    }, delay);
  });
  return promise;
}
function onResolve(value) {
  izitoast.success({
    title: 'OK',
    message: `✅ Fulfilled promise in ${value}ms`,
    position: 'topRight',
  });
}
function onReject(error) {
  izitoast.error({
    title: 'Error',
    message: `❌ Rejected promise in ${error}ms`,
    position: 'topRight',
  });
}

const dataform = document.querySelector('.dataform');

dataform.addEventListener('submit', event => {
  event.preventDefault();
  const usrDelay = event.target.elements.delay.value.trim();
  const usrState = event.target.elements.state.value.trim();
  const usrPromise = createPromise(usrDelay, usrState);
  usrPromise.then(onResolve).catch(onReject);
});
