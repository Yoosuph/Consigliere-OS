import React, { useState, useRef, useEffect } from 'react';

interface RenameInputProps {
    initialValue: string;
    onRename: (newValue: string) => void;
    onCancel: () => void;
}

const RenameInput: React.FC<RenameInputProps> = ({ initialValue, onRename, onCancel }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleConfirm = () => {
        if (value.trim()) {
            onRename(value.trim());
        } else {
            // If the name is empty, cancel and revert to the initial name
            onRename(initialValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleConfirm}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white border border-blue-500 rounded px-1 py-0 w-full text-sm outline-none"
        />
    );
};

export default RenameInput;
