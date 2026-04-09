import React from 'react'

const FooterColumn = ({ title, links = [] }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-200">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterColumn
