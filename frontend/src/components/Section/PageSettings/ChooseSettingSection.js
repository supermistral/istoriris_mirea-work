import React, { useState } from "react";
import ChooseSetting from "./ChooseSetting";


const ChooseSettingSection = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(null);

    return data.map((item, i) =>
        item !== null && 
        <button className="settings-item" key={i}>
            <ChooseSetting
                data={item.data}
                currentIndex={item.currentIndex}
                linkUrl={item.linkUrl}
                searchParam={item.searchParam}
                isShow={currentIndex === i}
                show={() => setCurrentIndex(i)}
                hide={() => currentIndex === i && setCurrentIndex(null)}
                ind={i}
            />
        </button>
    )
}


export default ChooseSettingSection;