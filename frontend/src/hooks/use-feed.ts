import { useEffect, useState } from "react";
import type { Image } from "../lib/types";
import { API_URL } from "../lib/config";

const useFeed = (filterTags: string[]) => {
  const [images, setImages] = useState<Image[]>();
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        let apiRoute = "/feed";

        if (filterTags.length > 0) {
          const params = new URLSearchParams();

          filterTags.forEach((tag) => {
            params.append("tag", tag);
          });

          apiRoute += `?${params.toString()}`;
        }

        const response = await fetch(API_URL + apiRoute);

        if (!response.ok) {
          throw new Error("Failed fetching images");
        }

        const data = await response.json();

        setImages(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchImages();
  }, [filterTags, refetch]);

  const refetchFeed = () => {
    setRefetch(!refetch);
  };

  return { images, error, refetchFeed };
};

export default useFeed;
