import { useState } from "react";
import { API_URL } from "../lib/config";

type UploadImageInput = {
  title: string;
  tags: string[];
  file: File;
};

const useUploadImage = () => {
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async ({ title, tags, file }: UploadImageInput) => {
    const formData = new FormData();
    formData.append("title", title);

    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    formData.append("file", file);

    try {
      const response = await fetch(API_URL + "/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed uploading file");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { uploadImage, error };
};

export default useUploadImage;
