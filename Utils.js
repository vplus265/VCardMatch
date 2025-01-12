class Utils {
  static random(a, b) {
    return (Math.random() * (b - a)) + a;
  }

  static parse_time(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  }

  /*
    ``
    const durationFormat = new Intl.DurationFormat('en-US', {
      style: 'long',
    });

    console.log(durationFormat.format(5000)); // Output: "5 seconds"
    ``
  */
}