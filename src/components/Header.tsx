import { FaCubes, FaMoon, FaSun, FaFilePdf } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfReport from './PdfReport';
import { usePads } from '../context/PadsContext';
import { calculatePadResults } from '../utils/calculations';
import { Terrain } from '../types';

interface HeaderProps {
  screenshot: string | null;
}

const Header = ({ screenshot }: HeaderProps) => {
  const isDarkMode = true;

  const { pads, selectedPadId } = usePads();
  const selectedPad = pads.find(p => p.id === selectedPadId);

  const terrain: Terrain = { sx: -2, sy: 1 };
  const results = selectedPad ? calculatePadResults(selectedPad, terrain, pads) : null;

  return (
    <header className="bg-[#212b36] border-b border-gray-700 flex items-center justify-between p-3 z-10 shadow-md">
      <div className="flex items-center gap-3">
        <FaCubes className="text-cyan-400 text-2xl" />
        <h1 className="text-white text-lg font-bold">Heap Master Pro</h1>
      </div>
      <div className="flex items-center gap-4">
        {selectedPad && results && (
          <PDFDownloadLink
            document={<PdfReport pad={selectedPad} results={results} screenshot={screenshot} />}
            fileName={`Report-${selectedPad.name}.pdf`}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
          >
            {({ loading }) =>
              loading ? 'در حال ساخت...' : <><FaFilePdf /> خروجی PDF</>
            }
          </PDFDownloadLink>
        )}
        <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
