import { useNavigate } from 'react-router-dom';

const Test3 = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Test3</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>홈으로</button>
        <button onClick={() => navigate('/test1')}>Test1</button>
        <button onClick={() => navigate('/test2')}>Test2</button>
        <button onClick={() => navigate('/test4')}>Test4</button>
      </div>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <button onClick={() => navigate(1)}>앞으로가기</button>
    </div>
  );
};

export default Test3;
