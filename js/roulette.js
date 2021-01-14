const roulette = {
  highlightClass: '.tabulator-highlight',
  winnerClass: 'tabulator-winner',
  spinLengthMin: 2000,
  spinLengthMax: 4000,
  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  },
  spin: function(options) {
    const spinLength = this.getRandom(this.spinLengthMin, this.spinLengthMax);
    // TODO: randomly choose a winner from the options provided
    // need to figure out what structure we can pull in from the rows selected by tabulator.js

    // cycle through rows adding and removing the highlightClass as needed
    // cycle multiple times, decreasing the spinLength each time
  }
}