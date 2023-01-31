
module.exports = {
    calcDate(date) {
        let diffDate = new Date(new Date().getTime() - date);
        let years = diffDate.toISOString().slice(0, 4) - 1970;

        if (years > 0) {
            return years + " Years " + diffDate.getMonth() + " Months " 
            + (diffDate.getDate() - 1) + " Days ago!";
        } else {
            return diffDate.getMonth() + " Months " + (diffDate.getDate() - 1) + " Days ago!";
        }
    }
}