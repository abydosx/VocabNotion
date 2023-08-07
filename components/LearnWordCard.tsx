import AudioButton from './AudioButton'
import { memo } from 'react'
import type { MouseEvent } from 'react';
import styles from './styles/LearnWordCard.module.scss'

interface CardProps {
  info: FormatContent
  className?: string
  isFontCard: boolean
  handleShowModal: (info: FormatContent) => void
}

const Card = ({ className, isFontCard, handleShowModal, info }: CardProps) => {
  const flip = (e: MouseEvent) => {
    const card = (e.target as HTMLElement).closest('.card')
    card?.classList.toggle(styles['card-flipped'])
  }

  const moreAction = () => {
    handleShowModal(info)
  }

  const { zh: back, en: font } = info

  return (
    <div className={`${className} swiper-slide text-white xl:h-80 xl:w-80 !h-48 !w-48 card ${isFontCard ? '' : styles['back-mode']}`}>
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

const LearnWordCard = memo<CardProps>(
  function LearnWordCard({ className, info, isFontCard, handleShowModal }) {
    return (
      <Card
        className={className}
        isFontCard={isFontCard}
        info={info}
        handleShowModal={handleShowModal}
      />
    )
  },
  (pre, now) => pre.isFontCard === now.isFontCard
)
export default LearnWordCard
