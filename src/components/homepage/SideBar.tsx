import React from 'react';

type ItemProps = {
  text: string;
  count: number;
};

function SideBarItem({ text, count }: ItemProps) {
  return (
    <div className="my-1.5 text-gray-500 cursor-pointer hover:text-orange-500">
      {text}({count})
    </div>
  );
}

function SideBar() {
  return (
    <div className="hidden md:block text-left h-fit min-w-60 py-8 px-5 mr-8 rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="text-orange-500 text-xl mb-2.5 font-semibold">TOPICAL TAGS</div>
      <div className="ml-3.5 tm-2">
        <SideBarItem text="NEXT-JS" count={6} />
        <SideBarItem text="REACT" count={5} />
        <SideBarItem text="TAILWIND" count={2} />
      </div>
    </div>
  );
}

export default SideBar;
