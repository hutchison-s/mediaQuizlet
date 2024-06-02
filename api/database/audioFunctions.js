import { deleteFile } from "./fileFunctions.js";
import { bucket, aCol, fieldValue } from "./firebaseConnect.js";

export async function createAudioDoc(req, res) {
    try {
      const { mimeType } = req.body;
      if (!mimeType) {
        res.status(400).send({message: "Missing mimetype"});
        return;
      }
  
      // Create new audio document in Firestore
      const audioRef = await aCol.add({
        mimeType: mimeType,
        totalChunks: 0,
        chunks: [] // Initialize empty array for storing chunk references
      });
      await audioRef.update({audioId: audioRef.id});
  
      res.send({ id: audioRef.id });
      console.log("Created new audio doc with id of "+audioRef.id);
    } catch (error) {
      res.status(500).send({ error: 'Failed to create audio document' });
    }
  }

  export async function getAllAudio(req, res) {
    try {
      // Retrieve all audio documents from Firestore
      const audioDocs = [];
      const querySnapshot = await aCol.get();
      querySnapshot.forEach((doc) => {
        audioDocs.push(doc.data());
      });
  
      res.json(audioDocs);
    } catch (error) {
      res.status(500).send({ error: 'Failed to retrieve audio documents' });
    }
  }

  export async function uploadAudioChunk(req, res) {

    console.log("chunk upload initiated");
    try {
      const { id } = req.params;
      const { index } = req.body;
      const chunk = req.file;

      if (!id) {
        res.status(400).send({message: "Audio ID required"});
        console.log("no id present in request");
        return;
      }
      if (!index || !chunk) {
        res.status(400).send({message: "Missing required fields"});
        console.log("missing info in request");
        return;
      }
  
      // Upload chunk data to Firebase Storage
      const ref = aCol.doc(id);
      let filePath = `files/audio/${id}/chunk_${index}.dat`;
      const cloudFile = bucket.file(filePath);
      console.log("uploading chunk: "+filePath, typeof chunk.buffer, chunk);
      await cloudFile.save(chunk.buffer);
      
  
      // Update audio document in Firestore
      await ref.update({
        totalChunks: fieldValue.increment(1),
        chunks: fieldValue.arrayUnion(cloudFile.name)
      });
  
      res.send({ message: 'Chunk uploaded successfully', path: cloudFile.name });
    } catch (error) {
      res.status(500).send({ error: error, message: 'Failed to upload audio chunk' });
      console.log(error)
    }
  }

  export async function getAudioInfo(req, res) {
    try {
      const { id } = req.params;
  
      // Retrieve audio document from Firestore
      const ref = aCol.doc(id);
      const doc = await ref.get();
  
      if (!doc.exists) {
        res.status(404).send({ error: 'Audio document not found' });
        return;
      }
  
      const { totalChunks, mimeType } = doc.data();
      res.send({ totalChunks, mimeType });
    } catch (error) {
      res.status(500).send({ error: 'Failed to retrieve audio document info' });
    }
  }

  export async function getChunk(req, res) {
    try {
      const { id, index } = req.params;
      
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
  
      // Retrieve audio document from Firestore
      const ref = aCol.doc(id);
      const doc = await ref.get();
      console.log("Getting chunk "+(index+1)+" of "+doc.data().totalChunks+" from audio doc "+id)
  
      if (!doc.exists) {
        res.status(404).send({ error: 'Audio document not found' });
        return;
      }
  
      const {chunks, mimeType} = doc.data();
      if (!chunks || index >= chunks.length) {
        res.status(404).send({ error: 'Audio chunk not found' });
        return;
      }
      let chunkFilePath = `files/audio/${id}/chunk_${index}.dat`;
      const cloudFile = bucket.file(chunkFilePath);
      cloudFile.createReadStream()
            .on('error', (err) => {
                console.error('Error reading audio chunk:', err);
                res.status(500).send({ error: 'Failed to retrieve audio chunk data' });
            })
            .pipe(res); // Pipe the data directly to the response

    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve audio chunk data' });
    }
  }

  export async function deleteAudioDoc(id) {
    const ref = aCol.doc(id);
    await ref.delete();
    return {message: "deleted audio document"};
  }

  export async function deleteAudioDocsFromAnswers(questions, answers) {
    if (questions.length == 0 || answers.length == 0) return;
    const potentialPromises = answers.map((a, idx) => {
      if (['AUD', 'REC'].includes(questions[idx].response.type)) {
          return deleteAudioDoc(a)
      } else {
          return Promise.resolve()
      }
    })
    await Promise.all(potentialPromises)
  }

  export async function deleteAudioDocsFromPrompts(questions) {
    if (questions.length == 0) return;
    const promises = questions.flatMap(q => 
      q.prompts
        .filter(p => p.type === 'audio')
        .map(p => deleteAudioDoc(p.path))
    )
    await Promise.all(promises)
  }