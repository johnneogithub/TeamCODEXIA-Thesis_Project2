// src/Components/TabComponent/Tabs.js
import React, { useState } from "react";
import "../TabView/PregnancyWheelTABStyle.css";

// Childrens
import PregnancyWheelLMP from "./PregnancyWheelLMP"; // Children 1
import PregnancyWheelIVF from "./PregnancyWheelIVF"; // Children 2
import PregnancyWheelCRL from "./PregnancyWheelCRL"; // Children 3


// This is a TabView component (Parent)
// Hierachy: three children (components), 1 parent, & 1  grandparent 

const Tabs = () => {
  // Initialize state for active tab
  const [activeTab, setActiveTab] = useState("Tab1");

  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>

    <div className="preg-bkg">  
        <div className="Tabs">
            <div className="TabButtons">
                <button className={`tabBtn ${activeTab === "Tab1" ? "active" : ""}`} onClick={() => handleTabChange("Tab1")}>Ultrasound</button>
                <button className={`tabBtn ${activeTab === "Tab2" ? "active" : ""}`} onClick={() => handleTabChange("Tab2")}>IVF</button>
                <button className={`tabBtn ${activeTab === "Tab3" ? "active" : ""}`} onClick={() => handleTabChange("Tab3")}>CRL</button>
            </div>

                {/* Render child components based on activeTab */}
                {activeTab === "Tab1" && <PregnancyWheelLMP/>}
                {activeTab === "Tab2" && <PregnancyWheelIVF />}
                {activeTab === "Tab3" && <PregnancyWheelCRL />}
        </div>
    </div>
    </>
  );
};

export default Tabs;
