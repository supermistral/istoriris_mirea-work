import React from "react";


const SwitchSetting = ({ name, choices, current, changeHandler }) => {
    
    return (
        <div className="switch">
            <div className="switch-panel">
                <div className="text">{name}</div>
                <div className="icon"></div>
            </div>
            <label className="switch-content">
                <input 
                    className="switch-content-input"
                    type="checkbox"
                    checked={current}
                    onChange={changeHandler} 
                />
                <div className="switch-option">
                    {choices[0]}
                </div>
                <div className="switch-slider">
                    <div className="switch-slider-indicator"></div>
                </div>
                <div className="switch-option">
                    {choices[1]}
                </div>
            </label>
        </div>
    )
}


export default SwitchSetting;