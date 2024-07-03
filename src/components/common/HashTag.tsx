import React from 'react'
import { Link } from 'react-router-dom'

function HashTag(props: { text: string }) {
  const { text } = props;
  return (
    <span className="mr-1">
      <Link to="/" className="text-sky-600">
        #{text}
      </Link>
    </span>
  )
}

export default HashTag