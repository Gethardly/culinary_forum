import { Button, Card, CardContent, CardHeader, CardMedia, Grid, styled, Typography } from '@mui/material';
import React from 'react';
import { apiURL } from '../../../constants';
import { PersonAdd as PersonAddIcon, PersonAddDisabled as PersonAddDisabledIcon } from '@mui/icons-material/';
import noImageAvailable from '../../../assets/images/noImage.png';
import { User } from '../../../types';

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
});

interface Props {
  title: string;
  ingredients: string[];
  instructions: string;
  photoGallery: string[];
  subscribe: (ownerId: string) => void;
  owner: User;
  currentUser: User | null;
}

const RecipeItem: React.FC<Props> = ({
  title,
  ingredients,
  instructions,
  photoGallery,
  owner,
  currentUser,
  subscribe,
}) => {
  let cardImage = noImageAvailable;

  if (photoGallery.length !== 0) {
    cardImage = apiURL + '/images/recipe_photos/' + photoGallery[0];
  }

  return (
    <Grid item xs={12} sm={6} md={2} lg={3}>
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
            currentUser &&
            currentUser._id !== owner._id && (
              <Button onClick={() => subscribe(owner._id)}>
                {currentUser.subscriptions.find((subscription) => subscription === owner._id) ? (
                  <PersonAddDisabledIcon />
                ) : (
                  <PersonAddIcon />
                )}
              </Button>
            )
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
