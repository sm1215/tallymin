const roulette = {
  highlightClass: 'tabulator-highlight',
  winnerClass: 'tabulator-winner',
  spinLengthMin: 2000,
  spinLengthMax: 4000,
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  },
  spin: async function(rowElements) {
    const winner = this.getRandomIntInclusive(0, rowElements.length - 1);

    let elementIndex = 0;
    while (elementIndex < rowElements.length) {
      let element = rowElements[elementIndex];
      await this.highlight(element).then(async result => {
        await this.wash(element);
      });
      elementIndex++;
    }
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
      }, 150);
    });
  }
}