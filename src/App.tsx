import './App.css'
import { Routes, Route } from 'react-router-dom';
import MainMenu from './MainMenu';
import PlanDetails from './PlanDetails';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/plan/:planName" element={<PlanDetails />} />
            <Route path="*" element={<MainMenu />} />
        </Routes>
    )
}

export default App;
