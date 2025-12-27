import React, { useState } from 'react';
import KPICard from './KPICard';
import { FaGem, FaCube, FaVial, FaWater, FaRulerCombined, FaIndustry, FaTint } from 'react-icons/fa';

const TabButton = ({ label, isActive, onClick }) => (
    <button className={`tab-btn ${isActive ? 'active' : ''}`} onClick={onClick}>
        {label}
    </button>
);

const f = (n) => (n ? Math.round(n).toLocaleString('fa') : '0');
const f2 = (n) => (n ? n.toFixed(2) : '0.00');

const MainContent = ({ stats, pad }) => {
    const [activeTab, setActiveTab] = useState('summary');

    if (!pad) return <div className="main-content">Select a pad to see details.</div>;

    return (
        <div className="main-content">
            <h1 className="page-title">گزارش پد: {pad.name}</h1>
            <div className="tabs-container">
                <TabButton label="خلاصه" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
                <TabButton label="هندسه" isActive={activeTab === 'geometry'} onClick={() => setActiveTab('geometry')} />
                <TabButton label="فنی" isActive={activeTab === 'technical'} onClick={() => setActiveTab('technical')} />
                <TabButton label="آبیاری" isActive={activeTab === 'irrigation'} onClick={() => setActiveTab('irrigation')} />
            </div>

            {activeTab === 'summary' && (
                <div id="tab-summary" className="tab-content active">
                    <div className="kpi-container">
                        <KPICard title="مس قابل استحصال" value={f2(stats.cu)} unit="تن" icon={<FaGem />} color="#10b981" />
                        <KPICard title="حجم خاک‌ریزی" value={f(stats.vol)} unit="متر مکعب" icon={<FaCube />} />
                        <KPICard title="مصرف اسید" value={f(stats.acid)} unit="تن" icon={<FaVial />} color="#f43f5e" />
                        <KPICard title="دبی کل آبیاری" value={f2(stats.flow_m3_hr)} unit="متر مکعب/ساعت" icon={<FaWater />} color="#0ea5e9" />
                    </div>
                    <div className="content-card">
                        <div className="card-header">نمایش سریع</div>
                        <table>
                            <tbody>
                                <tr><td>تناژ کل مواد</td><td>{f(stats.mass)} تن</td></tr>
                                <tr><td>مساحت بستر</td><td>{f(stats.baseArea)} متر مربع</td></tr>
                                <tr><td>مساحت تاج</td><td>{f(stats.topArea)} متر مربع</td></tr>
                                <tr><td>ابعاد تاج</td><td>{`${f2(stats.topL)} × ${f2(stats.topW)} متر`}</td></tr>
                                <tr><td>تعداد امیترها</td><td>{f(stats.emitCount)} عدد</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'geometry' && (
                <div id="tab-geometry" className="tab-content active">
                     <div className="content-card">
                        <div className="card-header">ارتفاع گوشه‌های پد</div>
                        <table>
                            <tbody>
                                <tr><td>گوشه جلو-چپ (FL)</td><td>{f2(stats.hTL)} متر</td></tr>
                                <tr><td>گوشه جلو-راست (FR)</td><td>{f2(stats.hTR)} متر</td></tr>
                                <tr><td>گوشه پشت-چپ (BL)</td><td>{f2(stats.hBL)} متر</td></tr>
                                <tr><td>گوشه پشت-راست (BR)</td><td>{f2(stats.hBR)} متر</td></tr>
                            </tbody>
                        </table>
                    </div>
                     <div className="content-card">
                        <div className="card-header">طول یال‌های شیب‌دار</div>
                        <table>
                            <tbody>
                                <tr><td>یال جلو-چپ (Hip FL)</td><td>{f2(stats.hipFL)} متر</td></tr>
                                <tr><td>یال جلو-راست (Hip FR)</td><td>{f2(stats.hipFR)} متر</td></tr>
                                <tr><td>یال پشت-چپ (Hip BL)</td><td>{f2(stats.hipBL)} متر</td></tr>
                                <tr><td>یال پشت-راست (Hip BR)</td><td>{f2(stats.hipBR)} متر</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'technical' && (
                <div id="tab-technical" className="tab-content active">
                    <div className="content-card">
                        <div className="card-header">جزئیات فنی</div>
                        <table>
                            <tbody>
                                <tr><td>تناژ خاک (Mass)</td><td>{f(stats.mass)} تن</td></tr>
                                <tr><td>حجم کل (Prismoidal)</td><td>{f(stats.vol)} متر مکعب</td></tr>
                                <tr><td>مس قابل استحصال (Cu)</td><td>{f2(stats.cu)} تن</td></tr>
                                <tr><td>مصرف اسید (15kg/t)</td><td>{f(stats.acid)} تن</td></tr>
                                <tr><td>عیار مس</td><td>{pad.grade}%</td></tr>
                                <tr><td>بازیابی</td><td>{pad.rec}%</td></tr>
                                <tr><td>دانسیته</td><td>{pad.dens} تن/متر مکعب</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'irrigation' && (
                <div id="tab-irrigation" className="tab-content active">
                    <div className="content-card">
                        <div className="card-header">سیستم آبیاری</div>
                        <table>
                            <tbody>
                                <tr><td>فلوریت کل</td><td>{f2(stats.flow_m3_hr)} متر مکعب/ساعت</td></tr>
                                <tr><td>تعداد امیترها</td><td>{f(stats.emitCount)} عدد</td></tr>
                                <tr><td>طول لوله کلکتور</td><td>{f(stats.topL)} متر</td></tr>
                                <tr><td>طول لوله لترال</td><td>{f(stats.latLen)} متر</td></tr>
                                <tr><td>طول کل لوله</td><td>{f(stats.pipeLen)} متر</td></tr>
                                <tr><td>فاصله لترال</td><td>{pad.lat} سانتی‌متر</td></tr>
                                <tr><td>فاصله امیتر</td><td>{pad.emit} سانتی‌متر</td></tr>
                                <tr><td>دبی هر امیتر</td><td>{pad.irrRate} میلی‌لیتر/دقیقه</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainContent;
