const roulette = {
  highlightClass: 'tabulator-highlight',
  winnerBlinkClass: 'tabulator-winner-blink',
  winnerClass: 'tabulator-winner',
  highlightDisplayTime: 150,
  winnerDisplayTime: 3000,
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
    let remainder = highlights % elements.length;
    let offset = elements.length - remainder;
    let finalHighlights = highlights + offset + this.winner;

    // reset the starting point
    this.elementIndex = 0;
    // reset any classes
    elements.forEach(element => {
      element.classList.remove(this.highlightClass);
      element.classList.remove(this.winnerClass);
    });

    const winnerElement = elements[this.winner];

    await this.spin(finalHighlights, elements).then(async result => {
      winnerElement.classList.add(this.winnerBlinkClass);
      setTimeout(() => {
        winnerElement.classList.remove(this.winnerBlinkClass);
        winnerElement.classList.add(this.winnerClass);
        setTimeout(() => {
          winnerElement.classList.remove(this.winnerClass);
        }, this.winnerDisplayTime / 2)
      }, this.winnerDisplayTime);
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
          await this.wash(element, isWinner);
        });
        this.elementIndex++;
        loops--;
      }
      resolve();
    });
  },
  highlight: async function(element) {
    return await new Promise(resolve => {
      setTimeout(() => {
        element.classList.add(this.highlightClass);
        resolve();
      }, 1);
    });
  },
  wash: async function(element) {
    return await new Promise(resolve => {
      setTimeout(() => {
        element.classList.remove(this.highlightClass);
        resolve();
      }, this.highlightDisplayTime);
    });
  }
}