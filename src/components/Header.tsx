import React from 'react';
import brand from '../assets/images/brand.png';

function Header() {
  return (
    <div className="">
      <div className="flex justify-center w-full border border-gray-900">
        <div id="brand" className="max-w-5xl border border-blue-600">
          <a className="flex flex-row items-center border border-red-600 w-fit" href="/">
            <img className="w-12 h-12" src={brand} alt="logo" />
            <h4 className="text-lg">MyBlog</h4>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
