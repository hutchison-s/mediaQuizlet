import React, { useRef, DragEvent, ChangeEvent } from 'react';
import { GenQuestion, GenPrompt } from '../../types-new';

interface FileUploaderProps {
  callback: (newQuestions: GenQuestion[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ callback }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const filteredFiles = Array.from(files).filter(x => (x.type.includes("audio") || x.type.includes("image")))
    handleFiles(filteredFiles)
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFiles = (files: File[]) => {
    const newQuestions: GenQuestion[] = [];
    files.forEach((f, idx) => {
        const q: GenQuestion = {id: Date.now()+idx, prompts: [], response: {type: "SA", correct: ''}, pointValue: 1}
        let p;
        if (f.type.includes("audio")) {
            p = {file: f, type: "audio", playLimit: 3} as GenPrompt
        } else {
            p = {file: f, type: "image"} as GenPrompt
        }
        q.prompts.push(p)
        newQuestions.push(q);
    })
    callback(newQuestions);
}

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      id='uploaderTarget'
    >
      <label htmlFor="fileInput">
        Drag & drop files here or click to upload
      </label>
      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleInputChange}
        accept='audio/*,image/*'
        multiple
      />
    </div>
  );
};

export default FileUploader;
