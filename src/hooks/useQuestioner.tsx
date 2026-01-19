import { OFFLINE_QUESTION_RESPONSE_STORAGE_KEY } from "@/constants/API"
import { OFFLINE_QUESTION_BANK } from "@/data/questions"
import { language, locale } from "@/helpers/translation"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"
import { Platform } from "react-native"
import semver from 'semver'
import pkg from '../../package.json'
import { useSettings } from "./useSettings"
import { appendOfflineEntry } from "@/lib/offlineQueue"
import { QuestionDefinition } from "@/types/questioner"

export type IQuestion = QuestionDefinition;

export const useQuestioner = () => {
  const { hasActionDone, addActionDone, settings } = useSettings()
  const isMounted = useRef(true)

  const [question, setQuestion] = useState<IQuestion | null>(null)

  const questionsDone = settings.actionsDone.filter((action: any) => action?.title?.startsWith('question_slide_'))

  const getQuestion = (): Promise<IQuestion | null> => {
    const lastQuestionAnsweredToday = questionsDone.length > 0 ? dayjs(questionsDone[questionsDone.length - 1].date).isSame(dayjs(), 'day') : false

    if (lastQuestionAnsweredToday) {
      console.log('Not showing question because one was answered today')
      return Promise.resolve(null)
    }

    const question = OFFLINE_QUESTION_BANK.find((question) => {
      const satisfiesVersion = question.appVersion ? semver.satisfies(pkg.version, question.appVersion) : true
      const hasBeenAnswered = hasActionDone(`question_slide_${question.id}`)
      const localizedText = question.text[language] || question.text['en']

      if (!satisfiesVersion) console.log('Question not shown because version does not match', question.appVersion, pkg.version)
      if (hasBeenAnswered) console.log('Question not shown because it has been answered', question.id)
      if (!localizedText) console.log('Question not shown because it has no translation', question.text)

      return (
        satisfiesVersion &&
        !hasBeenAnswered &&
        !!localizedText
      )
    })

    return Promise.resolve(question || null)
  }

  const submit = (question: IQuestion, answers: IQuestion['answers']) => {

    const question_text = question.text[language] || question.text['en'];

    const answer_texts = answers.map(answer => {
      if (answer.text === null) {
        return answer.emoji;
      }

      if (answer?.text[language]) {
        return `${answer.emoji} ${answer.text[language]}`
      }

      return `${answer.emoji} ${answer?.text?.en}`
    }).join(', ')

    const metaData = {
      locale: locale,
      version: pkg.version,
      os: Platform.OS,
      deviceId: settings.deviceId,
    }

    const body = {
      date: new Date().toISOString(),
      language,
      question_text,
      answer_texts,
      answer_ids: answers.map(answer => answer.id).join(', '),
      question,
      ...metaData,
    }


    console.log('Sending Question Feedback', body)

    if (__DEV__) {
      console.log('Not queueing Question Feedback in dev mode')
      addActionDone(`question_slide_${question.id}`)
      return
    }

    return appendOfflineEntry(OFFLINE_QUESTION_RESPONSE_STORAGE_KEY, body)
      .then(() => {
        addActionDone(`question_slide_${question.id}`)
      })
  }

  useEffect(() => {
    getQuestion().then(question => {
      if (isMounted.current) {
        setQuestion(question)
      }
    })

    return () => {
      isMounted.current = false
    }
  }, [])

  return {
    question,
    submit
  }
}