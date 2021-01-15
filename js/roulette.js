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
  run: async function(rowElements) {
    // this.winner = this.getRandomIntInclusive(0, rowElements.length - 1);
    this.winner = 1;
    // TODO: need to adjust this so the loops end right next to the winning row
    // probably mod by elements.length
    const loops = this.getRandomIntInclusive(3, 9) * this.winner; 
    this.elementIndex = 0;

    await this.spin(loops, rowElements).then(async result => {
      await this.spin(3, [rowElements[this.winner]], true);
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
    console.log("addClass", addClass);
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