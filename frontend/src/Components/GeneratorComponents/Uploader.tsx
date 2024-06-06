import React, { useRef, DragEvent, ChangeEvent } from 'react';
import { GenQuestion, GenPrompt } from '../../types-new';

interface FileUploaderProps {
  callback: (newQuestions: GenQuestion[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ callback }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    cleanFiles(Array.from(event.dataTransfer.files))
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      cleanFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    
  }

  const cleanFiles = (files: File[]) => {
    if (files.length > 20) {
      alert("Uploading limited to 20 files at a time.")
      return;
    }
    const maxSize = 1024 * 1024 * 20;
    const cleaned = files.filter(file => {
      if (file.size > maxSize) {
        alert(file.name+" is too large and will be skipped")
        return false;
      } else if (!file.type.includes('audio') && !file.type.includes('image')) {
        alert(file.name+" is not a valid file type and will be skipped")
        return false;
      } else {
        return true;
      }
    })
    if (cleaned.length > 0) {
      return handleFiles(cleaned);
    } else {
      return;
    }
    
  }

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
    <label
      htmlFor='fileInput'
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      id='uploaderTarget'      
    >
      
        Drag & drop files here or click to upload

      <input
        type="file"
        id="fileInput"
        tabIndex={0}
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleInputChange}
        accept='audio/*,image/*'
        multiple
      />
    </label>
  );
};

export default FileUploader;
