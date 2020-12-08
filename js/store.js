const store = {
  key: 'tallymin',
  state: {
    mainTable: []
  },
  init: function() {
    console.log("store works");
  },
  handleError: function({message, err}) {
    console.warn(message);
    console.log(err);
  },
  updateState({key, contents}) {
    console.log("updating state");
    this.state[key] = contents;
    this.save();
  },
  save: function() {
    console.log("saving");
    try {
      const stringifiedData = JSON.stringify(this.state);
      localStorage.setItem(this.key, stringifiedData);
    } catch (err) {
      this.handleError({
        message: 'Could not save state locally. Navigating away from the page will result in lost data.',
        err
      });
    }
  },
  load: function() {
    try {
      const stringifiedData = localStorage.getItem(this.key)
      console.log("loading stringifiedData", stringifiedData);
    } catch (err) {
      this.handleError({
        message: 'Could not load previously saved data. Sorry :[',
        err
      });
    }
  }
}