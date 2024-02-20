import React from 'react'

function ContentSection(props: {content: string}) {
  const { content } = props;
  return (
    <div className="w-full">{content}</div>
  )
}

export default ContentSection