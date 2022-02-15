export function getAgeInYears(dateOfBirthString) {
    var today = new Date();
    var birthDate = new Date(dateOfBirthString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function getExperienceAge(createdAtString) {
    const days = getAgeInYears(createdAtString)
    const months = Math.floor(days/30);
    return `${months > 0 && (months + ' months')} ${days} days`
}

export function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " yr";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " mon";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " min";
    }
    return Math.floor(seconds) + " s";
  }