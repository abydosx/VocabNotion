import AudioButton from './AudioButton'
import type { MouseEvent } from 'react';
import styles from './styles/LearnWordCard.module.scss'
const Card = ({ className, isFontCard, moreAction, info: { font, back } }: CardProps & { className: string }) => {
  const flip = (e: MouseEvent) => {
    const card = (e.target as HTMLElement).closest('.card')
    card?.classList.toggle(styles['card-flipped'])
  }

  return (
    <div className={`${className} text-white xl:h-80 xl:w-80 h-48 w-48 card ${isFontCard ? '' : styles['back-mode']}`}>
      <div className={styles['card-front']} onClick={flip}>
        <p>
          <span>{font}</span>
        </p>
      </div>
      <div className={styles['card-back']} onClick={flip}>
        <p>
          <span>{back}</span>
        </p>
        <AudioButton word={back} />
        <a
          className="absolute bottom-5 left-5"
          onClick={(e) => {
            e.stopPropagation()
            moreAction()
          }}
        >
          More...
        </a>
      </div>
    </div>
  )
}
export default Card
