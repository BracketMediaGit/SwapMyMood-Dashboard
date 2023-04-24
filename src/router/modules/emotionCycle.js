import Layout from '@/layout'

const emotionCycleRouter = {
  path: '/emotioncycle',
  component: Layout,
  name: 'EmotionCycle',
  meta: {
    title: 'Emotion Cycles',
    icon: 'heart'
  },
  children: [
    {
      path: 'detail/:id',
      component: () => import('@/views/emotion-cycle/detail/index'),
      name: 'EmotionCycleDetail',
      hidden: true,
      meta: { title: 'Emotion Cycle Details' }
    },
    {
      path: 'list',
      component: () => import('@/views/emotion-cycle/list-emotion-cycle/index'),
      name: 'EmotionCycleList',
      meta: { title: 'List Emotion Cycles', icon: 'heart', affix: false }
    },
    {
      path: 'edit-content',
      component: () => import('@/views/emotion-cycle/edit-content/index'),
      name: 'EmotionCycleEditContent',
      meta: { title: 'Edit Emotion Cycle Content', icon: 'heart', affix: false },
      children: [
        {
          path: 'emotion',
          component: () => import('@/views/emotion-cycle/edit-content/emotion/index'),
          name: 'EmotionCycleEmotion',
          meta: { title: 'Common Emotions', icon: 'heart', affix: false }
        },
        {
          path: 'sensation',
          component: () => import('@/views/emotion-cycle/edit-content/sensation/index'),
          name: 'EmotionCycleSensation',
          meta: { title: 'Sensations', icon: 'heart', affix: false },
          children: [
            {
              path: 'head',
              component: () => import('@/views/emotion-cycle/edit-content/sensation/head/index'),
              name: 'HeadSensation',
              meta: { title: 'Head, Face, Throat, Neck', icon: 'heart', affix: false }
            },
            {
              path: 'chest',
              component: () => import('@/views/emotion-cycle/edit-content/sensation/chest/index'),
              name: 'ChestSensation',
              meta: { title: 'Chest, Heart, Breathing', icon: 'heart', affix: false }
            },
            {
              path: 'abdomen',
              component: () => import('@/views/emotion-cycle/edit-content/sensation/abdomen/index'),
              name: 'AbdomenSensation',
              meta: { title: 'Abdomen', icon: 'heart', affix: false }
            },
            {
              path: 'arm',
              component: () => import('@/views/emotion-cycle/edit-content/sensation/arm/index'),
              name: 'ArmSensation',
              meta: { title: 'Arm', icon: 'heart', affix: false }
            },
            {
              path: 'leg',
              component: () => import('@/views/emotion-cycle/edit-content/sensation/leg/index'),
              name: 'LegSensation',
              meta: { title: 'Leg', icon: 'heart', affix: false }
            },
            {
              path: 'wholebody',
              component: () => import('@/views/emotion-cycle/edit-content/sensation/whole-body/index'),
              name: 'WholebodySensation',
              meta: { title: 'Whole Body', icon: 'heart', affix: false }
            }
          ]
        },
        {
          path: 'thought',
          component: () => import('@/views/emotion-cycle/edit-content/thought/index'),
          name: 'EmotionCycleThought',
          meta: { title: 'Common unhelpful thoughts', icon: 'heart', affix: false }
        },
        {
          path: 'strategy',
          component: () => import('@/views/emotion-cycle/edit-content/swap-strategy/index'),
          name: 'EmotionCycleStrategies',
          meta: { title: 'Strategies', icon: 'heart', affix: false },
          children: [
            {
              path: 'trigger',
              component: () => import('@/views/emotion-cycle/edit-content/swap-strategy/trigger/index'),
              name: 'triggerStrategy',
              meta: { title: 'Triggers', icon: 'heart', affix: false }
            },
            {
              path: 'emotion',
              component: () => import('@/views/emotion-cycle/edit-content/swap-strategy/emotion/index'),
              name: 'emotionStrategy',
              meta: { title: 'Emotions', icon: 'heart', affix: false }
            },
            {
              path: 'sensation',
              component: () => import('@/views/emotion-cycle/edit-content/swap-strategy/sensation/index'),
              name: 'sensationStrategy',
              meta: { title: 'Sensations', icon: 'heart', affix: false }
            },
            {
              path: 'thought',
              component: () => import('@/views/emotion-cycle/edit-content/swap-strategy/thought/index'),
              name: 'thoughtStrategy',
              meta: { title: 'Thoughts', icon: 'heart', affix: false }
            },
            {
              path: 'behavior',
              component: () => import('@/views/emotion-cycle/edit-content/swap-strategy/behavior/index'),
              name: 'behaviorStrategy',
              meta: { title: 'Behaviors', icon: 'heart', affix: false }
            }
          ]
        }
      ]
    }
  ]
}

export default emotionCycleRouter
