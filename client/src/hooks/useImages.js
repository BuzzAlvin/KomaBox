import { useState, useEffect } from "react";
import { getRandomImages } from "../api/mangadex";

export const useRandomImages = (page) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const fetchImages = async () => {

      try {
        setLoading(true);

    // simulate random by random offset
    const randomOffset = Math.floor(Math.random() * 1000);

    const data = await getRandomImages(randomOffset);

        setImages(data);

      } catch (err) {

        console.error("Error fetching images:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchImages();
    
  }, [page]);

  return { images, loading };
};