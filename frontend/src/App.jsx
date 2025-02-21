import { useState } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Reason from './components/Reason';
import How from './components/How';
import Footer from './components/Footer';
import About from './components/About';
import Form from './components/BetaForm';
import FAQs from './components/FAQs';
import BetaForm from './components/BetaForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Banner />
      <About />
      <Reason />
      <How />
      <BetaForm />
      <FAQs />
      <Footer />
    </>
  );
}

export default App;
