import { useNavigate } from 'react-router-dom';

const Test1 = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Test1</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>홈으로</button>
        <button onClick={() => navigate('/test2')}>Test2</button>
        <button onClick={() => navigate('/test3')}>Test3</button>
        <button onClick={() => navigate('/test4')}>Test4</button>
        <button onClick={() => navigate('/test2', { replace: true })}>Test2 replace</button>
        <button onClick={() => navigate('/test3', { replace: true })}>Test3 replace</button>
        <button onClick={() => navigate('/test4', { replace: true })}>Test4 replace</button>
        <a href="/test2">A tag - Test5</a>
        <a href="/test3">A tag - Test3</a>
        <a href="/test4">A tag - Test4</a>
      </div>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <button onClick={() => navigate(1)}>앞으로가기</button>
    </div>
  );
};

export default Test1;
