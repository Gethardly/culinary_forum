import { Button, Card, CardContent, CardHeader, CardMedia, Grid, styled, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { apiURL } from '../../../constants';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
    <Grid item xs={12} sm={6} md={2} lg={3} component={Link} to={'/recipe/' + id} style={{ textDecoration: 'none' }}>
      <Card sx={{ height: '100%' }}>
        <ImageCardMedia image={cardImage} title={title} />
        <CardHeader
          sx={{
            ':hover': {
              background: 'lightgrey',
            },
          }}
          title={owner.displayName}
          action={
            <Button>
              <PersonAddIcon />
            </Button>
          }
        />
        <CardContent>
          <Typography variant="h5">{title}</Typography>
          <strong>{ingredients.length}</strong>
          <Typography component="p">
            {instructions.length > 50 ? instructions.slice(0, 50) + '...' : instructions}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecipeItem;
