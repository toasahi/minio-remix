import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone-esm";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, CheckCircle } from "lucide-react";

export default function FileInput() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const removeFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const uploadFiles = () => {
    setUploading(true);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-2xl">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ease-in-out ${
          isDragActive
            ? "border-primary bg-green-500/5"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input type="file" {...getInputProps()} name="file" />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Drag drop some files here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          (Only *.jpeg, *.jpg, *.png, *.gif and *.pdf files will be accepted)
        </p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-2"
          >
            {files.map((file) => (
              <motion.li
                key={file.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <button
            onClick={uploadFiles}
            disabled={uploading}
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-500/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out"
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </motion.div>
      )}

      {uploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-green-500/10">
                  Uploading
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-primary">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-green-500"
        >
          <CheckCircle className="mx-auto h-8 w-8" />
          <p className="mt-2 text-sm font-semibold">Upload Complete!</p>
        </motion.div>
      )}
    </div>
  );
}
