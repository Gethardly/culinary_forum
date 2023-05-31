import { Alert, Button, Grid, IconButton } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onChange: (files: File[]) => void;
  btnName: string;
}

const FileUploadComponent: React.FC<Props> = ({ onChange, btnName }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const removeFile = (removeFile: File) => {
    const updatedFiles = selectedFiles.filter((file) => file !== removeFile);
    setSelectedFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      setSelectedFiles(fileList);
      onChange(fileList);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        {selectedFiles.map((file, index) => (
          <Alert
            sx={{ mt: 1 }}
            key={file.name}
            severity="success"
            action={
              <IconButton key={index} aria-label="close" color="inherit" size="small" onClick={() => removeFile(file)}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {file.name}
          </Alert>
        ))}
      </Grid>
      <Grid item sx={{ ml: 2 }}>
        <input style={{ display: 'none' }} id="file-upload" type="file" multiple onChange={handleFileSelect} />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span">
            {btnName}
          </Button>
        </label>
      </Grid>
    </Grid>
  );
};

export default FileUploadComponent;
