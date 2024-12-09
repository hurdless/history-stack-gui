import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate('/test1')}>test1</button>
      <button onClick={() => navigate('/test2')}>test2</button>
      <button onClick={() => navigate('/test3')}>test3</button>
      <button onClick={() => navigate('/test4')}>test4</button>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <button onClick={() => navigate(1)}>앞으로가기</button>
    </>
  );
}

export default App;
