import './App.css';
import React, { useEffect } from 'react';

import { Provider } from 'react-redux';
import store from './reducer/store';
import ToDoList from './screen/ToDoList';

function App() {
  return (
    <Provider store={store}>
      <ToDoList />
    </Provider>
  );
}

export default App;
