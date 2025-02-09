import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import izitoast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  stopButton: document.querySelector('[data-stop]'),
  daysDisplay: document.querySelector('[data-days]'),
  hoursDisplay: document.querySelector('[data-hours]'),
  minutesDisplay: document.querySelector('[data-minutes]'),
  secondsDisplay: document.querySelector('[data-seconds]'),
};
const MAX_DATE = 99; // +99 days from current date
function calcMaxDate() {
  const dateNtime = new Date();
  const futureDays = dateNtime.getDate() + MAX_DATE;
  dateNtime.setDate(futureDays);
  return dateNtime;
}
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
const timeLeft = {
  userDate: new Date(),
  maxDate: calcMaxDate(),
  intervalID: null,
  start() {
    if (this.userDate.valueOf() <= Date.now()) {
      izitoast.error(msgTimePassed);
      refs.startButton.disabled = true;
      return;
    }
    this.intervalID = setInterval(() => {
      this.tick();
    }, 1000);
    refs.dateInput.disabled = true;
    refs.startButton.disabled = true;
    refs.stopButton.disabled = false;
  },
  stop() {
    if (this.intervalID) clearInterval(this.intervalID);
    refs.stopButton.disabled = true;
    refs.dateInput.disabled = false;
    refs.daysDisplay.textContent = '00';
    refs.hoursDisplay.textContent = '00';
    refs.minutesDisplay.textContent = '00';
    refs.secondsDisplay.textContent = '00';
  },
  tick() {
    const diffMs = this.userDate.valueOf() - Date.now();
    if (diffMs < 1000) {
      this.stop();
      return;
    }
    const diff = convertMs(diffMs);
    refs.daysDisplay.textContent = diff.days.toString().padStart(2, '0');
    refs.hoursDisplay.textContent = diff.hours.toString().padStart(2, '0');
    refs.minutesDisplay.textContent = diff.minutes.toString().padStart(2, '0');
    refs.secondsDisplay.textContent = diff.seconds.toString().padStart(2, '0');
  },
};
const msgFutureDate = {
  message: 'Please choose a date in the future',
  messageColor: 'white',
  backgroundColor: 'red',
  position: 'topCenter',
};
const msgTimePassed = {
  message:
    'Selected date is in the past now. Please select new date in the future.',
  messageColor: 'white',
  backgroundColor: 'red',
  position: 'topCenter',
};
const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: timeLeft.userDate,
  maxDate: timeLeft.maxDate,
  minuteIncrement: 1,
  onClose(selectedDates) {
    timeLeft.userDate = selectedDates[0];
    if (timeLeft.userDate.valueOf() <= Date.now()) {
      izitoast.error(msgFutureDate);
      refs.startButton.disabled = true;
      return;
    }
    refs.startButton.disabled = false;
  },
};

// Begin
refs.startButton.disabled = true;
refs.stopButton.disabled = true;
const fp = flatpickr(refs.dateInput, flatpickrOptions);
refs.startButton.addEventListener('click', () => {
  timeLeft.start();
});
refs.stopButton.addEventListener('click', () => {
  timeLeft.stop();
});
