import './styles/Home.css';
import googleButton from './assets/google_button_light.png';
function navigate(url){
    window.location.href = url
    }

async function auth(){
    const response = await fetch('http://localhost:3000/request',
    {method:'post'});
    const data = await response.json();
    navigate(data.url);
}

function Home(){
  return (
  <>
  <h1>Welcome to consulting ninja</h1>
  <h3>google auth</h3>
    <button type="button" onClick={()=> auth()}>
      <img src={googleButton} alt="google sign in"/>
    </button>
    </>
  );
}

export default Home;
//google sign in button and some other requirements