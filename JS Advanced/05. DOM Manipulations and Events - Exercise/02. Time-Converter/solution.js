function attachEventsListeners() {
    const btnEls = document.querySelectorAll('div input[type=button]'); 
    Array.from(btnEls).forEach(b => b.addEventListener('click', convert))

    const daysInputEl = document.getElementById('days');
    const hoursInputEl = document.getElementById('hours');
    const minutesInputEl = document.getElementById('minutes');
    const secondsInputEl = document.getElementById('seconds');

    function convert(ev) {
        const targetId = ev.target.id;
        const numberToConv = Number(ev.target.parentNode.querySelector('input[type=text]').value);

        if (targetId == 'daysBtn') {
            hoursInputEl.value = numberToConv * 24;
            minutesInputEl.value = numberToConv * 1440;
            secondsInputEl.value = numberToConv * 86400;
        }
        else if (targetId == 'hoursBtn') {
            daysInputEl.value = numberToConv / 24;
            minutesInputEl.value = numberToConv * 60;
            secondsInputEl.value = numberToConv * 60 * 60;
        }
        else if (targetId == 'minutesBtn') {
            daysInputEl.value = numberToConv / 60 / 24;
            hoursInputEl.value = numberToConv / 60;
            secondsInputEl.value = numberToConv * 60;
        }
        else if (targetId == 'secondsBtn') {
            daysInputEl.value = numberToConv / 60 / 60 / 24;
            hoursInputEl.value = numberToConv / 60 / 60;
            minutesInputEl.value = numberToConv / 60;
        }
    }
}