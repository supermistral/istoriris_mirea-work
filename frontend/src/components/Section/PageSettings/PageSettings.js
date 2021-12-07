import React, { useCallback, useEffect, useState } from "react";
import { BiBookContent } from 'react-icons/bi';
import { RiSettings3Line, RiImage2Line } from 'react-icons/ri';
import { BsLayoutSidebarInsetReverse, BsLayoutSidebarInset } from 'react-icons/bs';
import { CgArrowLeftO } from 'react-icons/cg';
import SwitchSetting from "./SwitchSetting";
import './PageSettings.css';
import { getPageSetting } from "../Section";
import ChooseSettingSection from "./ChooseSettingSection";


const PageSettings = ({ 
    pages, 
    pageNumber, 
    sections, 
    sectionId, 
    pageSettings,
    setPageSettings 
}) => {
    const [chooseSettingItems, setChooseSettingItems] = useState({
        sections: null,
        pages: null,
    });

    useEffect(() => {
        if (typeof sections === "undefined") {
            return;
        }

        const chooseSections = sections.map((item, i) => ({
            number: i,
            text: item.name,
            id: item.id
        }));

        setChooseSettingItems(prev => ({
            ...prev,
            sections: {
                data: chooseSections,
                currentIndex: chooseSections.findIndex(item => item.id == sectionId),
                linkUrl: '/sections/',
            }
        }))
    }, [sections, sectionId]);

    useEffect(() => {
        if (typeof pages === "undefined") {
            return;
        }

        const choosePages = pages.map((item, i) => ({
            number: i,
            text: 'Страница ' + (i + 1),
            id: item.id
        }));

        setChooseSettingItems(prev => ({
            ...prev,
            pages: {
                data: choosePages,
                currentIndex: pageNumber,
                searchParam: 'page',
            }
        }));
    }, [pages, pageNumber]);

    const changeHandler = key => setPageSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const closeClickHandler = e => {
        document.activeElement.blur();
    }
    
    return (
        <div className={`page-settings`}>
            <label className="page-settings-content">
                <input className="page-settings-input" type="checkbox" />
                <div className="page-settings-list">
                    <div className="settings-header">
                        <div className="settings-header-text">Настройки</div>
                        <div className="settings-header-close" onClick={closeClickHandler}>
                            <button className="close"><CgArrowLeftO /></button>
                        </div>
                    </div>
                    <div className="settings-sections">
                        <div className="settings-section-item">
                            <div className="settings-item-header">
                                <span><BiBookContent /></span> Навигация по книге
                            </div>
                            <ChooseSettingSection data={[
                                chooseSettingItems.sections,
                                chooseSettingItems.pages
                            ]} />
                        </div>
                        <div className="settings-section-item">
                            <div className="settings-item-header">
                                <span><RiSettings3Line /></span> Управление содержимым
                            </div>
                            <button className="settings-item">
                                <SwitchSetting
                                    name="Качество"
                                    current={getPageSetting(pageSettings.quality)}
                                    changeHandler={() => changeHandler('quality')}
                                    choices={[
                                        <RiImage2Line style={{filter: 'blur(1px)'}} />, 
                                        <RiImage2Line />
                                    ]}
                                />
                            </button>
                            <button className="settings-item">
                                <SwitchSetting
                                    name="Расположение слайдера"
                                    current={getPageSetting(pageSettings.sliderPlace)}
                                    changeHandler={() => changeHandler('sliderPlace')}
                                    choices={[
                                        <BsLayoutSidebarInset />, 
                                        <BsLayoutSidebarInsetReverse />
                                    ]}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="page-settings-icon">
                    <div className="icon-wrapper">
                        <RiSettings3Line />
                    </div>
                </div>
            </label>
        </div>
    )
}

export default PageSettings;