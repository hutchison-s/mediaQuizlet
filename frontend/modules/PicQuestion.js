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

class PicQuestion {
    constructor(file, qDataList=null) {
        this.file = file;
        this.title = null;
        this.correct = null;
        this.isComplete = null;
        this.qDataList = qDataList;
        this.limit = null;
        this.photo = null;
        this.type = "photoUpload"
        this.pointValue = 1;
    }

    getData() {
        const data = new FormData();
        data.append("title", this.title);
        data.append("photo", this.photo);
        data.append("file", this.file);
        return data;
    }

    formResponse(data) {
        this.title = data.get("title");
        this.limit = data.get("limit")
        this.isComplete = true;
        this.pointValue = data.get("pointValue")
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

export default PicQuestion;