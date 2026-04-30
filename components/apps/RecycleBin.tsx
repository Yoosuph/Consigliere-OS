
import React from 'react';
import { ICONS } from '../../constants';

const RecycleBin: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-gray-400 p-4">
            <div className="w-24 h-24 text-gray-500">
                {ICONS.RECYCLE_BIN}
            </div>
            <h2 className="text-xl mt-4">Recycle Bin</h2>
            <p className="mt-2 text-center">This folder is empty.</p>
        </div>
    );
};

export default RecycleBin;
