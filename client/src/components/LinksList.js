import React from 'react'
import { Link } from 'react-router-dom'

export default function LinksList({ links }) {
  if (!links.length) {
    return <p className="center">There is no links:(</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Original</th>
          <th>Cutted</th>
          <th>Open</th>
        </tr>
      </thead>
      <tbody>
        {links.map((link, idx) => (
          <tr key={link._id}>
            <td>{idx + 1}</td>
            <td>{link.from}</td>
            <td>{link.to}</td>
            <td>
              <Link to={`/detail/${link._id}`}>Open</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
