import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, styled, Typography } from '@mui/material';
import React from 'react';
import { apiURL } from '../../../constants';
import { PersonAdd as PersonAddIcon, PersonAddDisabled as PersonAddDisabledIcon } from '@mui/icons-material/';
import noImageAvailable from '../../../assets/images/noImage.png';
import { User } from '../../../types';
import { Link } from 'react-router-dom';

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
});

interface Props {
  id: string;
  title: string;
  instructions: string;
  photoGallery: string[];
  subscribe: (ownerId: string) => void;
  owner: User;
  currentUser: User | null;
}

const RecipeItem: React.FC<Props> = ({ id, title, instructions, photoGallery, owner, currentUser, subscribe }) => {
  let cardImage = noImageAvailable;

  if (photoGallery.length !== 0) {
    cardImage = apiURL + '/images/recipe_photos/' + photoGallery[0];
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    subscribe(owner._id);
  };
  console.log(currentUser?._id, owner._id);

  return (
    <Grid item xs={12} sm={6} md={2} lg={3} component={Link} to={'/recipe/' + id} style={{ textDecoration: 'none' }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ImageCardMedia image={cardImage} title={title} />
        <CardHeader title={title} />
        <CardContent sx={{ mt: 'auto' }}>
          <Typography component="p">
            {instructions.length > 50 ? instructions.slice(0, 50) + '...' : instructions}
          </Typography>
          <CardActions>
            <Typography variant="h5">{owner.displayName}</Typography>
            {currentUser && currentUser._id !== owner._id && (
              <Button sx={{ ml: 'auto' }} onClick={handleButtonClick}>
                {currentUser.subscriptions.find((subscription) => subscription._id === owner._id) ? (
                  <PersonAddDisabledIcon />
                ) : (
                  <PersonAddIcon />
                )}
              </Button>
            )}
          </CardActions>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecipeItem;
