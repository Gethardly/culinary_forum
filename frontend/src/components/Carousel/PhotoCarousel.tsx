import React from 'react';
import { Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

interface PhotoCarouselProps {
  url: string;
  images: string[];
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ url, images }) => {
  return (
    <Carousel height="200px">
      {images.map((image, index) => (
        <Paper key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img src={url + image} alt={`Image ${index}`} />
        </Paper>
      ))}
    </Carousel>
  );
};

export default PhotoCarousel;
