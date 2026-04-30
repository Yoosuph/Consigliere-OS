import React from 'react';

interface NotepadProps {
  initialContent?: string;
  isReadOnly?: boolean;
}

const Notepad: React.FC<NotepadProps> = ({ initialContent, isReadOnly = true }) => {
  const defaultContent = `
Consigliere - Software Developer
------------------------------------

Hello! I'm Consigliere, a creative and detail-oriented software developer with a passion for building elegant, efficient, and user-friendly applications.

My journey into the world of code started with a fascination for how things work, and it has evolved into a career dedicated to solving complex problems through technology. I thrive in collaborative environments and am always eager to learn new skills and embrace new challenges.

This interactive portfolio is a testament to my love for both robust backend logic and polished frontend experiences. I believe that the best products are born from a deep understanding of user needs and a commitment to quality craftsmanship.

When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee.

Thanks for stopping by my digital desktop!
  `;

  const content = initialContent || defaultContent;

    return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col text-black font-sans text-sm">
      <div className="flex bg-[#F0F0F0] border-b border-[#E0E0E0] select-none text-[13px]">
          <div className="px-2 py-1 cursor-pointer hover:bg-[#E5F3FF]">File</div>
          <div className="px-2 py-1 cursor-pointer hover:bg-[#E5F3FF]">Edit</div>
          <div className="px-2 py-1 cursor-pointer hover:bg-[#E5F3FF]">Format</div>
          <div className="px-2 py-1 cursor-pointer hover:bg-[#E5F3FF]">View</div>
          <div className="px-2 py-1 cursor-pointer hover:bg-[#E5F3FF]">Help</div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto bg-white font-mono">
        {isReadOnly ? (
           <pre className="whitespace-pre-wrap">{content}</pre>
        ) : (
          <textarea defaultValue={content} className="w-full h-full bg-transparent border-none outline-none resize-none" />
        )}
      </div>
    </div>
  );
};

export default Notepad;
