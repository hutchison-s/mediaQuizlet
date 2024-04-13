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
    try {
      const { id } = req.params;
      const { index } = req.body;
      const data = req.file;

      if (!id) {
        res.status(400).send({message: "Audio ID required"});
        return;
      }
      if (!index || !data || !data) {
        res.status(400).send({message: "Missing required fields"});
        return;
      }
  
      // Upload chunk data to Firebase Storage
      const ref = aCol.doc(id);
      const doc = await ref.get();
      const {mimeType} = doc.data();
      const cloudFile = bucket.file(`files/audio/${id}/chunk_${index}.${mimeType.split('/')[1]}`);
      await cloudFile.save(data);
  
      // Update audio document in Firestore
      await ref.update({
        totalChunks: fieldValue.increment(1),
        chunks: fieldValue.arrayUnion(cloudFile.name)
      });
  
      res.send({ message: 'Chunk uploaded successfully' });
    } catch (error) {
      res.status(500).send({ error: error, message: 'Failed to upload audio chunk' });
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
  
      if (!doc.exists) {
        res.status(404).send({ error: 'Audio document not found' });
        return;
      }
  
      const {chunks, mimeType} = doc.data();
      if (!chunks || index >= chunks.length) {
        res.status(404).send({ error: 'Audio chunk not found' });
        return;
      }
  
      const chunkFilePath = `files/audio/${id}/chunk_${index}.${mimeType.split("/")[1]}`
      const cloudFile = bucket.file(chunkFilePath);
  
      // Download chunk data from Firebase Storage
      const data = await cloudFile.download();
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Disposition', `attachment; filename="chunk_${index}.${mimeType.split("/")[1]}"`);
      res.send(data)

    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve audio chunk data' });
    }
  }