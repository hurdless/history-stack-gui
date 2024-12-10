import { useNavigate } from 'react-router-dom';

const Test2 = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Test2</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>홈으로</button>
        <button onClick={() => navigate('/test1')}>Test1</button>
        <button onClick={() => navigate('/test3')}>Test3</button>
        <button onClick={() => navigate('/test4')}>Test4</button>
        <a href="/test1">A tag - Test1</a>
        <a href="/test3">A tag - Test3</a>
        <a href="/test4">A tag - Test4</a>
      </div>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <button onClick={() => navigate(1)}>앞으로가기</button>
    </div>
  );
};

export default Test2;
