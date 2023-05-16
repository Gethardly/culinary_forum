import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { User, UserMutation } from '../../types';
import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Groups';
import CottageIcon from '@mui/icons-material/Cottage';
import { getEditingUser, getUsersList, logout, updateUser } from '../../features/users/usersThunks';
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

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const usersListData = useAppSelector(selectUsersListData);
  const mainUser = useAppSelector(selectUser);
  const error = useAppSelector(selectEditingError);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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

  return (
    <>
      <Button onClick={handleClick} color="inherit" style={{ textTransform: 'inherit' }}>
        <Typography mr={1}>{user.displayName}</Typography>
        <AccountCircleIcon />
      </Button>
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
          <Divider key="user-divider" />,
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
          <Divider key="user-divider" />,
        ]}
        <MenuItem onClick={openDialog}>
          <AccountBoxIcon sx={{ mr: 1 }} />
          Редактировать профиль
        </MenuItem>
        <Divider key="user-divider" />
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
    </>
  );
};

export default UserMenu;
