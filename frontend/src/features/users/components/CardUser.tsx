import React from 'react';
import { User } from '../../../types';
import { Button, ButtonGroup, CircularProgress, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAppSelector } from '../../../app/hooks';
import { selectDeleteOneUserLoading } from '../usersSlice';
import { ROLES } from '../../../constants';
import { StyledTableRow } from '../theme';

interface Props {
  user: User;
  onDelete: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardUser: React.FC<Props> = ({ user, onDelete, onEditing }) => {
  const deleteLoading = useAppSelector(selectDeleteOneUserLoading);
  const userRole = ROLES.find((role) => role.name === user.role);

  return (
    <StyledTableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center">{user.email}</TableCell>
      <TableCell align="center">{user.displayName}</TableCell>
      <TableCell align="center">{userRole?.prettyName}</TableCell>
      <TableCell align="right">
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button size="small" color="error" onClick={onDelete} disabled={deleteLoading}>
            {!deleteLoading ? <DeleteIcon /> : <CircularProgress size={20} />}
          </Button>
          <Button size="small" color="success" onClick={onEditing}>
            <EditIcon />
          </Button>
        </ButtonGroup>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardUser;
