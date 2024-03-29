const newEl = (type, id = null, cl = null) => {
    const el = document.createElement(type);
    if (id) {
      el.id = id;
    }
    if (cl) {
      el.classList.add(cl);
    }
    return el;
  };

class MCQuestion {
    constructor(file, qDataList=null, optDataList=null) {
      this.file = file;
      this.title = null;
      this.options = [];
      this.correct = 0;
      this.isComplete = false;
      this.limit = 0;
      this.qDataList = qDataList;
      this.optDataList = optDataList;
    }
    // Method to get question data as FormData object
    getData() {
      const data = new FormData();
      data.append("title", this.title);
      for (const o of this.options) {
        data.append("options", o);
      }
      data.append("correct", this.correct);
      data.append("file", this.file);
      return data;
    }
    // Method to populate question data from FormData object
    formResponse(data) {
      this.title = data.get("title");
      this.options.length = 0;
      this.options.push(data.get("optA"));
      this.options.push(data.get("optB"));
      this.options.push(data.get("optC"));
      this.options.push(data.get("optD"));
      console.log(data.get("correct"))
      this.correct = parseInt(data.get("correct"));
      this.isComplete = true;
      this.limit = data.get("limit");
      this.addToDataLists();
    }
    addToDataLists() {
      if (this.qDataList) {
        const promptVals = Array.from(this.qDataList.children).map(el => el.value);
        if (!promptVals.includes(this.title)) {
          const newPrompt = newEl("option")
          newPrompt.value = this.title
          this.qDataList.prepend(newPrompt);
        }
      }
      if (this.optDataList) {
        const optVals = Array.from(this.optDataList.children).map(el => el.value)
        for (let opt of this.options) {
          if (!optVals.includes(opt)) {
            const newOpt = newEl("option");
            newOpt.value = opt;
            this.optDataList.prepend(newOpt);
          }
        }
      }
    }
  }

  export default MCQuestion;