
import ParticipationRates from "./ParticipationRates";
import Score from "./Score";
import "../../style/DashboardEmp.css"; // Import the CSS file

const DashboardEmp = () => {
  return (
    <div className="dashboard-emp">
        <div className="participation-rates">
          <ParticipationRates  /> 
        </div>
        <div className="">
          <Score />
        </div>
    </div>
  );
};

export default DashboardEmp;
