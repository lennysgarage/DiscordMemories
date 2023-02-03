
module.exports = {
    calcDate(date) {
        let difference = dateDiffInDays(new Date(date), new Date());
        let years = Math.floor(difference / 365.25);
        let days = Math.floor(difference % 365.25); 

        let msg = "";
        if (days !== 0) {
            msg = days + " Days ";
        }

        if (years === 1) {
            msg = years + " Year " + msg;
        } else if (years > 1) {
            msg = years + " Years " + msg;
        } 

        return msg + "ago!";
    }
}

// Source: https://stackoverflow.com/a/15289883
function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  
  