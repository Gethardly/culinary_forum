import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/users/Login';
import CreateUser from './features/users/CreateUser';
import Users from './features/users/Users';
import Protected from './components/Protected';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import 'rsuite/dist/rsuite.min.css';
import Recipes from './features/recipes/Recipes';
import CreateRecipe from './features/recipes/CreateRecipe';
import OneRecipe from './features/recipes/components/OneRecipe';
import Chats from './features/chats/Chats';

function App() {
  const user = useAppSelector(selectUser);
  return (
    <Layout>
      <Routes>
        <Route path="*" element={'Not found'} />
        <Route path="/" element={<Recipes />} />
        <Route path="/my_recipes/:id" element={<Recipes />} />
        <Route path="/create_recipe" element={<CreateRecipe />} />
        <Route path="/recipe/:id" element={<OneRecipe />} />
        <Route path="/register" element={<CreateUser user={user} />} />
        <Route path="/login" element={<Login user={user} />} />
        <Route element={<Protected userRole={user?.role} priority="admin" />}>
          <Route path="/users" element={<Users />} />
        </Route>
        <Route path="/messages/:id?" element={<Chats />} />
      </Routes>
    </Layout>
  );
}

export default App;
