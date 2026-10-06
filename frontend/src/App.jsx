import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
export default function App() { return <Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/library" element={<Library />} /><Route path="/auth" element={<Auth />} /><Route path="/upload" element={<Upload />} /></Route></Routes>; }
