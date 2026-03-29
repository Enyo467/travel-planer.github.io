import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './MainMenu';
import PlanDetails from './PlanDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/plan/:planName" element={<PlanDetails />} />
            </Routes>
        </Router>
    )
}

export default App;
