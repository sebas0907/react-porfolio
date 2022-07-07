import About from "./components/About";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Form from "./components/Form";
import Detector from "./components/Detector";

import { Route, Routes } from 'react-router-dom';

function App() {
    const Home = () => {
      return (
        <main className="text-black bg-white body-font">
          <About />
          <Projects />
          <Skills />
          <Form />
        </main>
        )};
    return (
      <>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/yolo' element={<Detector />} />
      </Routes>
      </>
  );
}

export default App;
