import { useState, useEffect, useMemo } from 'react'
import Swiper from 'swiper'
import { Manipulation, EffectCoverflow } from 'swiper/modules'
import 'swiper/css/manipulation'
import 'swiper/css'
import { notionPages, updatePage } from '_api/notion'
import { QueryDatabaseResponse, PartialDatabaseObjectResponse, RichTextDatabasePropertyConfigResponse, TextRichTextItemResponse } from '@/types/notion';
export function useVocabulary(results: QueryDatabaseResponse['results'] = []) {
  const PAGE_SIZE = 10 as const
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>()
  const [allVocabularies, setAllVocabularies] = useState(results)
  const [swiper, setSwiper] = useState<typeof Swiper>()
  const [cacheWords, setCacheWords] = useState<QueryDatabaseResponse['results']>([])
  const progress = useMemo(() => parseInt((((currentIndex + 1) / allVocabularies.length) * 100).toString()) || 0, [currentIndex, allVocabularies])

  const handleRemoveVocabulary = async () => {
    const rm = allVocabularies[currentIndex]
    const sw = swiper as any
    setAllVocabularies(allVocabularies.filter((_, index) => index !== currentIndex))
    sw.update()
    updatePage({
      page_id: rm.id,
      properties: {
        Tags: {
          multi_select: [
            {
              name: 'Learned',
            },
          ],
        },
      },
    })
  }

  const getMoreWords = async () => {
    const params = {
      filter: {
        property: 'Tags',
        multi_select: {
          is_empty: true,
        },
      },
      sort: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
      page_size: PAGE_SIZE,
      ...(nextCursor ? { start_cursor: nextCursor } : {}),
    } as const
    const { results } = await notionPages(params)
    setCacheWords(results)
  }

  const handleAddVocabularies = async () => {
    if (cacheWords?.length) {
      setAllVocabularies((words) => [...words, ...cacheWords])
      cacheWords.map(async (item) => {
        updatePage(
          {
            page_id: item.id,
            properties: {
              Tags: {
                multi_select: [
                  {
                    name: 'Learning',
                  },
                ],
              },
            },
          },
        )
      })
    }
    getMoreWords()
  }

  const formatContent = (item: PartialDatabaseObjectResponse<RichTextDatabasePropertyConfigResponse>) => {
    let zh = '',
      en = '',
      richTextEn = [] as TextRichTextItemResponse[]
    if (item) {
      const {
        properties: {
          EN: { rich_text: EN_TEXT },
          ZH: { rich_text: ZH_TEXT },
          More: { rich_text: More },
        },
      } = item
      en = (EN_TEXT as unknown as TextRichTextItemResponse[])[0]?.plain_text
      zh = (ZH_TEXT as unknown as TextRichTextItemResponse[])[0]?.plain_text
      richTextEn = More as unknown as TextRichTextItemResponse[]
    }
    return { zh, en, richTextEn }
  }

  useEffect(() => {
    const swiper = new Swiper('.swiper', {
      speed: 400,
      spaceBetween: 100,
      modules: [Manipulation, EffectCoverflow],
      allowSlidePrev: true,
      effect: 'overflow',
      on: {
        init: function () {
          console.log('swiper initialized')
        },
      },
    })
    swiper.on('slideChange', function (e: any) {
      setCurrentIndex(e.activeIndex)
    })
    setSwiper(swiper as any)
  }, [allVocabularies])

  useEffect(() => {
    getMoreWords()
  }, [])

  return {
    progress,
    currentIndex,
    allVocabularies,
    formatContent,
    handleAddVocabularies,
    handleRemoveVocabulary,
  }
}
