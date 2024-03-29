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

class ShortAnswerQuestion {
    constructor(file, qDataList=null) {
        this.file = file;
        this.title = null;
        this.correct = null;
        this.isComplete = null;
        this.qDataList = qDataList;
        this.limit = null;
    }

    getData() {
        const data = new FormData();
        data.append("title", this.title);
        data.append("correct", this.correct);
        data.append("file", this.file);
        return data;
    }

    formResponse(data) {
        this.title = data.get("title");
        this.correct = data.get("correct");
        this.limit = data.get("limit")
        this.isComplete = true;
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
    }
}

export default ShortAnswerQuestion;