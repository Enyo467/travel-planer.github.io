import './App.css'
import {useState} from "react";

function App() {
    const [isAddPlanOpen, setIsAddPlanOpen] = useState<boolean>(false);
    const [addedPlans, setAddedPlans] = useState<number>(0);
    const [planName, setPlanName] = useState<string>("");

    const addPlan = () => {
        setAddedPlans(addedPlans + 1);
        setIsAddPlanOpen(true);
    }

    return (
      <div className="app">
          <div className="logo">
              <h1>Travel Planner</h1>
          </div>

          <div className="plans">
              <button className="addPlanBtn" onClick={addPlan}>
                  +
              </button>
          </div>

          {isAddPlanOpen && (
              <div className="addPlanWindow">
                  <div className="nameAPW">
                      <button className="closeBtn" onClick={() => setIsAddPlanOpen(false)}>X</button>

                      <input
                          type="text"
                          id="name"
                          placeholder="Nazwij swoją podróż..."
                          value={planName}
                          onChange={(e) => setPlanName(e.target.value)}
                      />

                  </div>
              </div>
          )}
      </div>
  );
}

export default App;
