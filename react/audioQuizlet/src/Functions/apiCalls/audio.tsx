import axios from "axios";

export async function getAudioFile(id: string) {
    const {totalChunks, mimeType} = await axios.get(`http://localhost:8000/api/uploads/audio/${id}/chunks`).then(res=>res.data);
    const promises = [];
    for (let i=0; i<totalChunks; i++) {
      promises.push(fetch(`http://localhost:8000/api/uploads/audio/${id}/chunks/${i}`).then(res => res.blob()));
    }
    const chunks = (await Promise.all(promises))
    const blob = new Blob(chunks, {type: mimeType});
    return blob;
  }


export async function newAudio(mimeType: string): Promise<string> {
  const response = await axios.post(`http://localhost:8000/api/uploads/audio/`, JSON.stringify({mimeType}), {headers: {"Content-Type": "application/json"}})
    .then(res => res.data)
  return response.id;
}

export async function uploadChunk(id: string, data: BlobPart, index: number): Promise<{path: string}> {
  console.log("processing chunk", data)
  const formData = new FormData();
  formData.append('index', String(index));
  formData.append('chunk', new Blob([data], {type: "application/octet-stream"}));
  const response = await axios.post(`http://localhost:8000/api/uploads/audio/${id}/chunks`, formData).then(res => res.data)
  return response;
}

export async function chunkAndUpload(file: File): Promise<{id: string, associated: string[]}> {
  const id = await newAudio(file.type); // Create a new audio document and get its ID
  const chunkSize = 4 * 1024 * 1024; // 4 MB chunk size (adjust as needed)
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
      fileReader.onload = async (event: ProgressEvent<FileReader>) => {
          const chunkPaths = [];
          if (event.target && event.target.result) {
            const buffer: ArrayBuffer = event.target.result as ArrayBuffer;
            const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, buffer.byteLength);
                const chunk = buffer.slice(start, end);
                
                try {
                    const {path} = await uploadChunk(id, chunk, i);
                    chunkPaths.push(path);
                    console.log(`Uploaded chunk ${i + 1} of ${totalChunks}`);
                } catch (error) {
                    reject(error);
                }
            }

            resolve({id: id, associated: chunkPaths});
          } else {
            reject("No data present")
          }
          
      };

      fileReader.onerror = (error) => {
          reject(error);
      };

      fileReader.readAsArrayBuffer(file);
  });
}