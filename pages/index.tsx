import { useState, useEffect, memo } from 'react'
import { forwardRef, type HTMLAttributes } from 'react';
import { notionPages, updatePage } from '_api/notion'
import NotionText from '@/components/NotionRichText'
import LearnWordCard from '@/components/LearnWordCard'
import Button from '@mui/material/Button'
import { QueryDatabaseResponse } from '@/types/notion';
import { useVocabulary } from '@/hooks/vocabulary'
import LinearProgress, {
  linearProgressClasses
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

type Results = QueryDatabaseResponse['results']

const BoxButton = (props: any) => {
  return (
    <Button
      {...props}
      className={`drop-shadow-md w-20 h-20 bg-white rounded-lg text-[#827ced] ${props.className}`}
    >
      {props.children}
    </Button>
  )
}

const Card = memo<CardProps>(
  function Card({ info, isFontCard, moreAction }) {
    return (
      <LearnWordCard
        className="swiper-slide"
        isFontCard={isFontCard}
        info={info}
        moreAction={moreAction}
      />
    )
  },
  (pre, now) => pre.isFontCard === now.isFontCard
)

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"
  }
}));

export async function getServerSideProps() {
  try {
    const params = {
      filter: {
        property: 'Tags',
        multi_select: {
          contains: 'Learning',
        },
      },
      sorts: [
        {
          property: 'Name',
          direction: 'ascending' as const,
        },
      ],
    }
    const { results } = await notionPages(params)
    return { props: { results } }
  } catch (err) {
    console.error(err)
    return { props: { results: [] } }
  }
}

const Learn = forwardRef<
  HTMLAttributes<HTMLDivElement>,
  { results: Results }
>(({ results }) => {
  const [showModal, setShowModal] = useState(false)
  const [isFontCard, setCardMode] = useState(true)
  const {
    progress,
    allVocabularies,
    formatContent,
    handleAddVocabularies,
    handleRemoveVocabulary,
  } = useVocabulary(results)

  useEffect(() => {
    document.addEventListener('click', () => {
      setShowModal(false)
    })
  }, [])

  const handleSwitchSide = () => {
    setCardMode(!isFontCard)
  }

  return (
    <div className="w-full h-screen">
      <div className="">
        <BorderLinearProgress variant="determinate" value={progress} />
        <div className="flex justify-center fade-content items-center flex-col">
          <div className="swiper !w-full h-fit mt-20">
            <div className="swiper-wrapper">
              {allVocabularies.map((item: any, index: number) => {
                const { zh, en } = formatContent(item)
                return (
                  <Card
                    key={item.id}
                    info={{ font: zh, back: en }}
                    isFontCard={isFontCard}
                    moreAction={() => setShowModal(!showModal)}
                  />
                )
              })}
            </div>
          </div>
          <div className="fixed top-3/4 min-w-full px-6 box-border">
            <div className="flex justify-around mb-8">
              <BoxButton onClick={handleRemoveVocabulary} disabled={allVocabularies.length <= 0}>
                Have Learned
              </BoxButton>
              <BoxButton
                className={isFontCard ? '!bg-[#4f42d8] !text-white' : '!bg-[#00A800] !text-white'}
                onClick={handleSwitchSide}
              >
                {isFontCard ? 'Font' : 'Back'}
              </BoxButton>
              <BoxButton onClick={handleAddVocabularies} disabled={allVocabularies.length <= 0}>
                10 More Words
              </BoxButton>
            </div>
          </div>
          {/* {showModal && (
          <Modal>
            <NotionText richText={formatContent(allVocabularies[currentIndex]).richTextEn} />
          </Modal>
        )} */}
        </div>
      </div>
    </div>
  )
})
export default Learn
