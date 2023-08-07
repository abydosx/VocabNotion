import { useState, useEffect } from 'react'
import { forwardRef, type HTMLAttributes } from 'react';
import { notionPages } from '_api/notion'
import NotionText from '@/components/NotionRichText'
import LearnWordCard from '@/components/LearnWordCard'
import Button from '@mui/material/Button'
import { QueryDatabaseResponse } from '@/types/notion';
import { useVocabulary } from '@/hooks/vocabulary'
import LinearProgress, {
  linearProgressClasses
} from "@mui/material/LinearProgress";
import Modal from '@mui/material/Modal';
import { styled } from "@mui/material/styles";

type NotionResults = QueryDatabaseResponse['results']

function isNotionWordInfo(pet: NotionResults[0]): pet is NotionWordInfo {
  return (pet as NotionWordInfo).object === 'page';
}
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
  { results: NotionResults }
>(({ results }) => {
  const [isFontCard, setCardMode] = useState(true)
  const {
    progress,
    allVocabularies,
    formatContent,
    handleAddVocabularies,
    handleRemoveVocabulary,
  } = useVocabulary(results)

  const [open, setOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<FormatContent>()
  const handleOpen = (item: FormatContent) => {
    setCurrentItem(item)
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    document.addEventListener('click', () => {
      setOpen(false)
    })
  }, [])

  const handleSwitchSide = () => {
    setCardMode(!isFontCard)
  }

  return (
    <div className="w-full h-screen">
      <BorderLinearProgress variant="determinate" value={progress} />
      <div className="flex justify-center fade-content items-center flex-col">
        <div className="swiper !w-96 h-fit mt-20">
          <div className="swiper-wrapper">
            {allVocabularies.map((item: any) => {
              if (isNotionWordInfo(item)) {
                return (
                  <LearnWordCard
                    key={item.id}
                    info={formatContent(item)}
                    isFontCard={isFontCard}
                    handleShowModal={handleOpen}
                  />
                )
              }
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
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <NotionText richText={currentItem?.richTextEn} />
        </Modal>
      </div>
    </div>
  )
})
export default Learn
