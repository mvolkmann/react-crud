import React from 'react';
import Crud from './crud/crud';
import personOptions from './person/person';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Crud options={personOptions} />
    </div>
  );
}

export default App;
