import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

interface PropTypes {
  toggleInlineStyle: (style: string) => void;
}

function EditorToolBar({ toggleInlineStyle }: PropTypes) {
  const iconStyle = "";
  const btnStyle = "my-1 p-1 w-8 h-8 text-gray-500 hover:text-orange-500 hover:bg-gray-300";

  return (
    <div className="h-10 border-y-[1px] border-gray-300 dark:border-gray-700">
      {/* 粗體 */}
      <button type="button" className={btnStyle} onClick={() => toggleInlineStyle('BOLD')}>
        <FontAwesomeIcon icon={icon({ name: 'bold', style: 'solid'})} />
      </button>

      {/* 斜體 */}
      <button type="button" className={btnStyle} onClick={() => toggleInlineStyle('ITALIC')}>
        <FontAwesomeIcon icon={icon({ name: 'italic', style: 'solid'})} />
      </button>
    </div>
  )
}

export default EditorToolBar