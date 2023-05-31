import { Card, CardContent, CardHeader, CardMedia, Grid, styled, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { apiURL } from '../../../constants';
import noImageAvailable from '../../../assets/images/noImage.png';
import { User } from '../../../types';

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
});

interface Props {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  photoGallery: string[];
  owner: User;
}

const RecipeItem: React.FC<Props> = ({ id, title, ingredients, instructions, photoGallery, owner }) => {
  let cardImage = noImageAvailable;

  if (photoGallery.length !== 0) {
    cardImage = apiURL + '/images/recipe_photos/' + photoGallery[0];
  }

  return (
    <Grid item xs={12} sm={6} md={2} lg={3} component={Link} to={'/product/' + id} style={{ textDecoration: 'none' }}>
      <Card>
        <ImageCardMedia image={cardImage} title={title} />
        <CardHeader title={owner.displayName} />
        <CardContent>
          <Typography variant="h5">{title}</Typography>
          <strong>{ingredients.length}</strong>
          <Typography component="p">
            {instructions.length > 200 ? instructions.slice(0, 200) + '...' : instructions}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecipeItem;
