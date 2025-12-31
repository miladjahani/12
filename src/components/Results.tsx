import { FaChartBar, FaCube, FaFlask, FaWater } from 'react-icons/fa';
import { CalculationResults } from '../utils/types';

interface ResultsProps {
  results: CalculationResults;
}

const KPICard = ({ icon, title, value, unit, colorClass }: { icon: React.ReactElement, title: string, value: string, unit: string, colorClass: string }) => (
  <div className="bg-tg-secondary-bg p-4 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-tg-secondary-text">{title}</p>
      <p className="text-xl font-bold text-tg-text">{value} <span className="text-sm font-normal text-tg-secondary-text">{unit}</span></p>
    </div>
  </div>
);

const Results: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="p-4 bg-tg-bg border-b border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={<FaFlask />} title="Recoverable Cu" value={results.cu.toFixed(2)} unit="tons" colorClass="bg-green-500" />
        <KPICard icon={<FaCube />} title="Fill Volume" value={results.vol.toLocaleString()} unit="m³" colorClass="bg-yellow-500" />
        <KPICard icon={<FaFlask />} title="Acid Consumption" value={(results.mass * 15 / 1000).toFixed(2)} unit="tons" colorClass="bg-red-500" />
        <KPICard icon={<FaWater />} title="Irrigation Flow" value={results.flow.toFixed(2)} unit="m³/hr" colorClass="bg-blue-500" />
      </div>

      <div className="mt-4 bg-tg-secondary-bg p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-tg-text">Detailed Geometry</h3>
        <table className="w-full text-sm text-left">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-tg-secondary-text">Top Dimensions (L x W)</td>
              <td className="py-2 text-tg-text">{`${results.topL.toFixed(2)}m x ${results.topW.toFixed(2)}m`}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-tg-secondary-text">Base Area</td>
              <td className="py-2 text-tg-text">{results.baseArea.toLocaleString()} m²</td>
            </tr>
            <tr>
              <td className="py-2 text-tg-secondary-text">Top Area</td>
              <td className="py-2 text-tg-text">{results.topArea.toLocaleString()} m²</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;