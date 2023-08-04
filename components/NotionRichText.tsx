import React from 'react'

const NotionText = ({ richText }) => {
  return (
    <div className="block w-64">
      {richText?.map((text, index) => {
        const {
          plain_text,
          href,
          annotations: { bold, italic, underline },
        } = text

        const textBaseClass = 'break-words whitespace-pre-line'

        let content = <span className={textBaseClass}>{plain_text}</span>

        if (href) {
          content = (
            <a href={href} target="_blank" rel="noopener noreferrer" className={textBaseClass}>
              <u>{plain_text}</u>
            </a>
          )
        }

        if (bold) {
          content = <strong className={textBaseClass}>{content}</strong>
        }

        if (italic) {
          content = <em className={textBaseClass}>{content}</em>
        }

        if (underline) {
          content = <u className={textBaseClass}>{content}</u>
        }

        return <React.Fragment key={text.plain_text + index}>{content}</React.Fragment>
      })}
    </div>
  )
}
export default NotionText
