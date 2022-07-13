import React, {useState} from 'react';
import './index.css'
// @ts-ignore
import logo from './logo.jpg'

const App = () => {
  const [count, setCount] = useState<number>(20)

  const onButtonClick = () => {
    throw new Error()
  }

  return (
    <div>
      <img src={logo} alt=''/>
      <h1>{count}</h1>
      <button onClick={() => setCount(prev => prev + 1)}>increment</button>
      <button onClick={() => setCount(prev => prev - 1)}>decrement</button>
      <button onClick={onButtonClick}>Error</button>
    </div>
  );
};

export default App;