import axios from "axios";
import { AnswerObject, GenQuestion } from "../../types-new";
import { chunkAndUpload } from "./audio";

export async function resizeAndCompress(file: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;
                const maxWidth = 800;
                const maxHeight = 800;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx!.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob: Blob | null) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject("Error in compression")
                    }
                    
                }, 'image/jpeg', 0.7);
            };

            img.onerror = function() {
                reject(new Error("Unable to load the image."));
            };

            img.src = event!.target!.result as string;
        };

        reader.onerror = function() {
            reject(new Error("Error reading the file."));
        };

        reader.readAsDataURL(file);
    });
}

export async function compressAndUploadImage(file: File): Promise<{link: string, path: string}> {
    const compPhoto = await resizeAndCompress(file);
    const photoForm = new FormData();
    photoForm.append("photos", compPhoto, "photoUpload")
    const {link, path} = await axios.post(`http://localhost:8000/api/uploads/image/`, photoForm).then(res => res.data);
    return {link, path}
}

export async function uploadFileAnswers(questions: GenQuestion[], answers: AnswerObject[]) {
    const associatedFiles: string[] = [];
    const newAnswers: AnswerObject[] = [];
    if (questions) {
        for (const [idx, q] of questions.entries()) {
            console.log("Processing answer", answers[idx].answer)
            if (q.response.type == "IMG") {
                const objectURL = answers[idx].answer
                if (objectURL) {
                    console.log(objectURL)
                    const photo = await fetch(objectURL).then(res => res.blob()).catch(console.log);
                    if (!photo) {
                        continue;
                    }
                    const compPhoto: Blob = await resizeAndCompress(photo);
                    const photoForm = new FormData();
                    photoForm.append("photos", compPhoto, "photoUpload")
                    const uploadResponse: {link: string, path: string} = await axios.post(`http://localhost:8000/api/uploads/image`, photoForm)
                        .then(res => {
                            if (res.status === 200) {
                                return res.data
                            }
                        });
                    const {link, path} = uploadResponse;
                    console.log(uploadResponse)
                    associatedFiles.push(path);
                    newAnswers.push({answer: link, score: 0})
                }
                
            } else if (q.response.type == 'AUD' || q.response.type == 'REC') {
                const audio = await fetch(answers[idx].answer).then(res => res.blob()).catch(console.log);
                if (!audio) {
                    continue;
                }
                const {id, associated} = await chunkAndUpload(new File([audio], 'newRecording.mp3', {type: 'audio/mpeg'}))
                associatedFiles.concat(associated);
                newAnswers.push({answer: id, score: 0})
            }   else {
                newAnswers.push({answer: answers[idx].answer, score: q.response.correct?.toLowerCase() === answers[idx].answer.toLowerCase() ? q.pointValue : 0})
            }
        }
        return [associatedFiles, newAnswers];
    } else {
        return [];
    }
}