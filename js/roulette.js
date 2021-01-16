const roulette = {
  highlightClass: 'tabulator-highlight',
  winnerClass: 'tabulator-winner',
  displayTime: 225,
  winner: null,
  elementIndex: 0,
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  },
  run: async function(elements) {
    this.winner = this.getRandomIntInclusive(0, elements.length - 1);
    let highlights = this.getRandomIntInclusive(elements.length * 2, elements.length * 5);
    let offset = elements.length + this.winner;
    let remainder = highlights % offset;
    let finalHighlights = highlights + remainder;

    // reset the starting point
    this.elementIndex = 0;

    await this.spin(finalHighlights, elements).then(async result => {
      await this.spin(5, [elements[this.winner]], true);
    });
  },
  spin: async function(loops, elements, isWinner) {
    return new Promise(async resolve => {
      while (loops > 0) {
        if (this.elementIndex > elements.length - 1) {
          this.elementIndex = 0;
        }
        let element = elements[this.elementIndex];
        await this.highlight(element, isWinner).then(async result => {
          await this.wash(element);
        });
        this.elementIndex++;
        loops--;
      }
      resolve();
    });
  },
  highlight: async function(element, isWinner) {
    const addClass = isWinner ? this.winnerClass : this.highlightClass;
    return await new Promise(resolve => {
      setTimeout(() => {
        element.classList.add(addClass);
        resolve();
      }, 1);
    });
  },
  wash: async function(element) {
    return await new Promise(resolve => {
      setTimeout(() => {
        element.classList.remove(this.highlightClass);
        element.classList.remove(this.winnerClass);
        resolve();
      }, this.displayTime);
    });
  }
}