import React, { useState } from 'react';
import { PROJECTS_DATA, ICONS } from '../../constants';
import type { Project } from '../../types';

const Browser: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(PROJECTS_DATA[0]);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    return (
        <div className="h-full flex bg-[#202020] text-white">
            <aside className="w-64 h-full bg-[#2b2b2b] p-2 flex-shrink-0 overflow-y-auto">
                <h3 className="text-lg font-bold p-2">Projects</h3>
                <ul>
                    {PROJECTS_DATA.map(project => (
                        <li key={project.id}>
                            <button
                                onClick={() => handleProjectClick(project)}
                                className={`w-full text-left flex items-center gap-2 p-2 rounded ${selectedProject?.id === project.id ? 'bg-blue-600' : 'hover:bg-white/10'}`}
                            >
                                {project.type === 'Folder' ? 
                                    <div className="w-5 h-5 text-yellow-500 flex-shrink-0">{ICONS.FOLDER}</div> : 
                                    <div className="w-5 h-5 text-gray-300 flex-shrink-0">{ICONS.FILE}</div>
                                }
                                <span className="text-sm truncate">{project.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="flex-1 p-6 overflow-y-auto">
                {selectedProject ? (
                    <article>
                        <h2 className="text-2xl font-bold mb-2">{selectedProject.name}</h2>
                        <p className="text-gray-400 mb-4 whitespace-pre-wrap">{selectedProject.description}</p>
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Technologies Used:</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedProject.technologies.map(tech => (
                                    <span key={tech} className="bg-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{tech}</span>
                                ))}
                            </div>
                        </div>
                        {selectedProject.url && (
                             <a 
                                href={selectedProject.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                            >
                                View on GitHub
                            </a>
                        )}
                    </article>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a project to view details.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Browser;
