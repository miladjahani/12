import { usePads } from '../context/PadsContext';
import { FaPlus, FaTrash } from 'react-icons/fa';

const PadManager = () => {
    const { addPad, deletePad, pads } = usePads();

    return (
        <div className="bg-[#212b36] p-3 rounded-lg">
            <h2 className="text-white font-bold text-sm mb-3 border-b border-gray-600 pb-2">مدیریت پدها</h2>
            {/* Pad selection dropdown can go here */}
            <div className="flex gap-2 mt-2">
                <button onClick={() => addPad('top')} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs py-2 rounded">طبقه بالا</button>
                <button onClick={() => addPad('right')} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs py-2 rounded">کنار (راست)</button>
                <button
                    onClick={deletePad}
                    disabled={pads.length <= 1}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded disabled:bg-gray-500"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default PadManager;
