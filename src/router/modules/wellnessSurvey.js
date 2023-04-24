import Layout from '@/layout'

const wellnessSurveyRouter = {
  path: '/survey',
  component: Layout,
  name: 'WellnessSurvey',
  meta: {
    title: 'Wellness Survey',
    icon: 'survey'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/wellness-survey/list-wellness/index'),
      name: 'WellnessSurveyList',
      meta: { title: 'List Wellness', icon: 'survey', affix: false }
    },
    {
      path: 'edit-content',
      component: () => import('@/views/wellness-survey/edit-content/index'),
      name: 'WellnessSurveyEditContent',
      meta: { title: 'Edit Content', icon: 'survey', affix: false }
    }
  ]
}

export default wellnessSurveyRouter
