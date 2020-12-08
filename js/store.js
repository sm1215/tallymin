const store = {
  enabled: true,
  key: 'tallymin',
  state: {
    mainTable: []
  },
  init: function() {
    if (!localStorage) {
      this.enabled = false;
      this.handleError({
        message: 'Error occurred while checking for data saving capabilities. Anything written is temporary and won\'t be saved.'
      });
    }
  },
  handleError: function({message, err}) {
    if (message) {
      console.warn(message);
    }
    if (err) {
      console.log(err);
    }
  },
  updateState({key, data}) {
    this.state[key] = data;
    console.log("updating state", this.state);
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
      const stringifiedData = localStorage.getItem(this.key);
      const data = JSON.parse(stringifiedData);
      this.state = data;
      return this.state;
    } catch (err) {
      this.handleError({
        message: 'Could not load previously saved data. Sorry :[',
        err
      });
    }
  }
}