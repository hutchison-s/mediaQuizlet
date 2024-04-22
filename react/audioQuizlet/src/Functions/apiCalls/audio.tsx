export async function getAudioFile(id: string) {
    const {totalChunks, mimeType} = await fetch(`http://localhost:8000/api/uploads/audio/${id}/chunks`).then(res=>res.json());
    const promises = [];
    for (let i=0; i<totalChunks; i++) {
      promises.push(fetch(`http://localhost:8000/api/uploads/audio/${id}/chunks/${i}`).then(res => res.blob()));
    }
    const chunks = (await Promise.all(promises))
    const blob = new Blob(chunks, {type: mimeType});
    return blob;
  }