var interval = setInterval(displayRemaining, 1);
function displayRemaining() {
  event = new Date(2018, 10, 3, 8);
  remaining = event - new Date();
  days = Math.floor(remaining / (24*60*60*1000));
  hours = Math.floor((remaining / (60*60*1000)) - (days*(24)));
  minutes = Math.floor((remaining / (60*1000)) - ((hours * 60)+(days*24*60)));
  seconds = Math.floor((remaining / 1000) - ((minutes * 60) + (hours*60*60)+(days*60*60*24)));
  milliseconds = (Math.floor((remaining) - ((minutes * 60*1000) + (hours*60*60*1000)+(days*60*60*24*1000)+(seconds*1000))));
  final = days + ':' + pad(hours, 0) + ':' + pad(minutes, 0) + ':' + pad(seconds, 0) +':' + pad(milliseconds, 1);

  document.getElementById('countdown').innerHTML = final;
  if (remaining <= 0) {
    remaining < -(24*60*60*1000) ? document.getElementById('countdown').innerHTML = "Event over!" :document.getElementById('countdown').innerHTML = 'Event started!';
    clearInterval(interval);
  }
}
function pad(n, p) {
    if (n<10 && p==1) {
      return "00" + n;
    }else if (n < 100 && p==1) {
      return "0" + n;
    }else if (n < 10 && p==0){
      return "0" + n;
    }else if (n > 0) {
      return n;
    }else {
      return "000";
    }
}
