import React, { useState, useRef, useCallback, useEffect } from 'react';

// --- SVG Icon Components (Self-Contained & Minimal) ---
// Using inline SVGs for zero dependencies.

const CloudIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const UploadIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const FileIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);


// --- Main UI Components ---

// Sidebar: Displays the app title and the list of successfully uploaded files.
const Sidebar = ({ uploadedFiles }) => (
    <div className="w-72 bg-gray-900 p-6 flex flex-col border-r border-gray-800">
        <div className="flex items-center gap-3 mb-12">
            <CloudIcon className="w-7 h-7 text-slate-300" />
            <h1 className="text-xl font-bold text-white">Private Cloud</h1>
        </div>
        <h2 className="text-sm font-semibold text-slate-400 mb-4">Uploaded Files</h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {uploadedFiles.map((file) => (
                <div key={`${file.name}-${file.lastModified}`} title={file.name} className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                    <FileIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="truncate flex-1">{file.name}</span>
                </div>
            ))}
        </div>
    </div>
);

// Header: A simple top bar with a user profile dropdown menu.
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Effect to close the dropdown when clicking outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <header className="p-6 flex justify-end items-center">
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center transition-transform hover:scale-110"
                >
                    <UserIcon className="w-5 h-5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                <div
                    className={`
                        absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden
                        transition-all duration-200 ease-in-out
                        ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                    `}
                >
                    <a href="/login" className="block px-4 py-3 text-sm text-slate-300 hover:bg-gray-700 transition-colors">Sign In</a>
                    <a href="#" className="block px-4 py-3 text-sm text-slate-300 hover:bg-gray-700 transition-colors">Log Out</a>
                </div>
            </div>
        </header>
    );
};

// FileItem: Represents a single file in the "uploading" list. Shows progress.
const FileItem = ({ file, progress }) => {
    const isCompleted = progress === 100;
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center gap-4">
            <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-green-500/20' : 'bg-cyan-500/20'}`}>
                {isCompleted ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <FileIcon className="w-5 h-5 text-cyan-400" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

// FileUploader: The main drag-and-drop and click-to-upload area.
const FileUploader = ({ onFilesSelected }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files) onFilesSelected(Array.from(e.target.files));
    };

    const handleDragEvents = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        else if (e.type === 'dragleave') setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            onFilesSelected(Array.from(e.dataTransfer.files));
            e.dataTransfer.clearData();
        }
    }, [onFilesSelected]);

    return (
        <div 
            className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                ${isDragging ? 'border-cyan-500 bg-gray-800' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'}`}
            onDragEnter={handleDragEvents} onDragOver={handleDragEvents} onDragLeave={handleDragEvents} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-cyan-500/20' : 'bg-gray-800'}`}>
                <UploadIcon className={`w-8 h-8 transition-colors ${isDragging ? 'text-cyan-500' : 'text-slate-500'}`} />
            </div>
            <p className="text-slate-400">
                <span className="font-semibold text-cyan-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500 mt-2">Any file up to 100MB</p>
        </div>
    );
};

// App: The root component that manages state and orchestrates the UI.
export default function App() {
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // This effect watches for completed uploads and moves them to the correct list.
    // This is the main fix for the duplication bug.
    useEffect(() => {
        const completed = uploadingFiles.filter(f => f.progress === 100);
        if (completed.length > 0) {
            const completedIds = new Set(completed.map(f => f.id));
            setUploadedFiles(prev => [...prev, ...completed.map(f => f.file)]);
            setUploadingFiles(prev => prev.filter(f => !completedIds.has(f.id)));
        }
    }, [uploadingFiles]);

    const handleFilesSelected = (newFiles) => {
        const existingIds = new Set([
            ...uploadingFiles.map(f => f.id),
            ...uploadedFiles.map(f => `${f.name}-${f.size}-${f.lastModified}`)
        ]);

        const filesToUpload = newFiles
            .map(file => ({
                id: `${file.name}-${file.size}-${file.lastModified}`,
                file,
                progress: 0
            }))
            .filter(fileObj => !existingIds.has(fileObj.id));

        if (filesToUpload.length === 0) return;

        setUploadingFiles(prev => [...prev, ...filesToUpload]);

        // Simulate the upload process for each new file.
        filesToUpload.forEach(fileObj => {
            const interval = setInterval(() => {
                setUploadingFiles(currentFiles => {
                    const targetFile = currentFiles.find(f => f.id === fileObj.id);
                    if (!targetFile || targetFile.progress >= 100) {
                        clearInterval(interval);
                        return currentFiles;
                    }
                    
                    return currentFiles.map(f =>
                        f.id === fileObj.id ? { ...f, progress: Math.min(f.progress + 5, 100) } : f
                    );
                });
            }, 100);
        });
    };

    return (
        <div className="h-screen w-full bg-black text-slate-300 font-sans flex overflow-hidden">
            <Sidebar uploadedFiles={uploadedFiles} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 flex justify-center p-8 overflow-y-auto">
                    <div className="w-full max-w-2xl space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Upload Your Files</h2>
                            <p className="text-slate-400">Securely upload files to your private cloud.</p>
                        </div>
                        <FileUploader onFilesSelected={handleFilesSelected} />
                        {uploadingFiles.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-left text-white">Uploading...</h3>
                                {uploadingFiles.map((fileObj) => (
                                    <FileItem key={fileObj.id} file={fileObj.file} progress={fileObj.progress} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
