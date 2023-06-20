import { useState } from 'react';

export default function TagList({ tags, addTag, removePill }) {
    const [value, setValue] = useState("");

    const handleKeyDown = (evt) => {
        if (evt.key === 'Enter') {
            addTag(value);
            setValue("");
        }
    };

    let pills = tags.map((tag, index) => {
        return (
            <span key={index} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full flex mr-2">
                <span>{tag}</span>
                <span onClick={() => removePill(tag)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </span>
            </span>
        )
    })

    return (
        <div className="flex items-center border-b border-teal-500 py-2 mb-6">
            <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text" placeholder="Hasbro" aria-label="Full name"
                value={value}
                onChange={(evt) => setValue(evt.target.value)}
                onKeyDown={handleKeyDown}
            />
            {pills}
        </div>
    )
}