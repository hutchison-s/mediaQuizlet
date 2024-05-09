import React, { useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploaderProps {
  handleFiles: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ handleFiles }) => {
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
