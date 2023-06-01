import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { User, UserMutation } from '../../types';
import { Autocomplete, Avatar, Box, Button, Divider, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { alpha, styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Groups';
import CottageIcon from '@mui/icons-material/Cottage';
import { getEditingUser, getOneUser, getUsersList, logout, updateUser } from '../../features/users/usersThunks';
import ModalBody from '../ModalBody';
import UserForm from '../../features/users/components/UserForm';
import {
  openSnackbar,
  selectEditingError,
  selectEditOneUserLoading,
  selectOneEditingUser,
  selectUser,
  selectUsersListData,
} from '../../features/users/usersSlice';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { apiURL } from '../../constants';
import { selectRecipesList } from '../../features/recipes/recipesSlice';
import { fetchRecipes } from '../../features/recipes/recipesThunks';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SimpleDialog from '../Dialogs/SimpleDialog/SimpleDialog';

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: "black";
        padding: ${theme.spacing(1)};
`,
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`,
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        display: block;
`,
);

const useStyles = makeStyles(() => ({
  autocomplete: {
    '& .MuiAutocomplete-input': {
      height: '10px',
    },
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  height: '42px',
}));

interface LinkOption {
  label: string;
  id: string;
}

interface Props {
  user: User;
}

let dividerKey = 1;

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mainUser = useAppSelector(selectUser);
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const usersListData = useAppSelector(selectUsersListData);
  const recipesList = useAppSelector(selectRecipesList);
  const error = useAppSelector(selectEditingError);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [clickType, setClickType] = useState<'Подписки' | 'Подписчики'>('Подписки');
  const classes = useStyles();
  const avatarPic = apiURL + '/images/avatars/' + user.avatar;
  const optionsList: LinkOption[] = recipesList.map((recipe) => {
    return {
      id: recipe._id,
      label: recipe.title,
    };
  });
  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    await dispatch(getOneUser());
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDialog = async () => {
    handleClose();
    await dispatch(getEditingUser(user._id));
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (userToChange: UserMutation) => {
    try {
      await dispatch(updateUser({ id: user._id, user: userToChange })).unwrap();
      if (mainUser && mainUser.role === 'admin') {
        await dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
      }
      dispatch(openSnackbar({ status: true, parameter: 'editProfile' }));
      setIsDialogOpen(false);
    } catch (error) {
      throw new Error(`Произошла ошибка: ${error}`);
    }
  };

  const handleFollowersOpen = (linkType: 'Подписки' | 'Подписчики') => {
    setClickType(linkType);
    setFollowersDialogOpen(true);
  };

  const handleFollowersClose = () => {
    setFollowersDialogOpen(false);
  };

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);
  return (
    <>
      <MenuUserBox sx={{ minWidth: 210 }} display="flex" alignItems="center">
        <Search>
          <Autocomplete
            sx={{ width: 300 }}
            className={classes.autocomplete}
            onChange={(event, newValue: LinkOption | null) => {
              if (newValue?.id !== undefined) {
                navigate('recipe/' + newValue.id);
              }
            }}
            noOptionsText="Нет совпадений"
            options={optionsList}
            renderInput={(params) => <TextField {...params} label="Search recipes..." variant="outlined" />}
          />
        </Search>
        <Button onClick={handleClick}>
          <Avatar variant="rounded" alt={user.displayName} src={user.avatar ? avatarPic : ''} />
          <UserBoxText color="white">
            <UserBoxLabel variant="body1">{user.displayName}</UserBoxLabel>
            <Typography variant="body2">{user.role}</Typography>
          </UserBoxText>
        </Button>
      </MenuUserBox>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {user.role === 'admin' && [
          <MenuItem
            key="user-management"
            onClick={() => {
              handleClose();
              navigate('/users');
            }}
          >
            <GroupIcon sx={{ mr: 1 }} />
            Управление пользователями
          </MenuItem>,
          <Divider key={dividerKey} />,
        ]}
        {user && [
          <MenuItem
            key="user-main"
            onClick={() => {
              handleClose();
              navigate('/');
            }}
          >
            <CottageIcon sx={{ mr: 1 }} />
            Главная страница
          </MenuItem>,
          <Divider key={dividerKey++} />,
        ]}
        <MenuItem onClick={openDialog}>
          <AccountBoxIcon sx={{ mr: 1 }} />
          Редактировать профиль
        </MenuItem>
        <Divider key={dividerKey++} />
        <MenuItem
          onClick={() => {
            handleClose();
            navigate('/my_recipes/' + user._id);
          }}
        >
          <LibraryBooksIcon sx={{ mr: 1 }} />
          Мои рецепты
          <Box sx={{ ml: 'auto' }} component="span">
            {user.recipes.length}
          </Box>
        </MenuItem>
        <Divider key={dividerKey++} />
        <MenuItem onClick={() => handleFollowersOpen('Подписчики')}>
          <SubscriptionsIcon sx={{ mr: 1 }} />
          Подписчики
          <Box sx={{ ml: 'auto' }} component="span">
            {user.subscribers.length}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleFollowersOpen('Подписки')}>
          <PersonPinIcon sx={{ mr: 1 }} />
          Подписки
          <Box sx={{ ml: 'auto' }} component="span">
            {user.subscriptions.length}
          </Box>
        </MenuItem>
        <Divider key={dividerKey++} />
        <MenuItem
          sx={{ justifyContent: 'center' }}
          onClick={() => {
            dispatch(logout());
            handleClose();
            navigate('/');
          }}
        >
          Выйти
          <LogoutIcon sx={{ ml: 1 }} />
        </MenuItem>
      </Menu>
      {editingUser && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <UserForm error={error} onSubmit={onFormSubmit} existingUser={editingUser} isEdit isLoading={editLoading} />
        </ModalBody>
      )}
      {mainUser && (
        <SimpleDialog user={mainUser} type={clickType} open={followersDialogOpen} onClose={handleFollowersClose} />
      )}
    </>
  );
};
export default UserMenu;
