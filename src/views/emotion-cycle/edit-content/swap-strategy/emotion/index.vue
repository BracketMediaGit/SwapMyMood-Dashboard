<template>
  <edit-content
    v-loading="loading"
    :name="'emotion'"
    :list1="emotionCycle.swapStrategy.template.emotions"
    :list2="emotionCycle.swapStrategy.emotions"
    :list1-title="'Emotion Cycle Emotion Strategies Template'"
    :list2-title="'Emotion Cycle Emotion Strategies'"
    :placeholder="'New Emotion'"
    @createPrepopulated="createEmotion"
    @updateTemplate="updateTemplate"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import emotionCycleService from '@/services/emotionCycle'
import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'EmotionStrategyEditContent',
  components: { EditContent },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'emotionCycle'
    ])
  },
  created () {
    this.getData()
    if (!this.emotionCycle.swapStrategy.template.emotions.length || !this.emotionCycle.swapStrategy.emotions.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_SEMOTIONS',
      'emotionCycle/SET_SEMOTION',
      'emotionCycle/SET_STEMPLATE',
      'emotionCycle/SET_STEMPLATEID'
    ]),
    createEmotion (emotion) {
      this.loading = true
      emotionCycleService.createStrategy('emotion', emotion)
        .then(res => {
          this['emotionCycle/SET_SEMOTION'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteEmotion (id) {
      prepopulatedService.deletePrepopulated('emotion', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        emotionCycleService.getStrategies('emotion'),
        emotionCycleService.getStrategyTemplate()
      ])
        .then(([emotions, temp]) => {
          const { id, template } = temp
          const ids = new Set(template.emotions.map(t => t.id))
          this['emotionCycle/SET_SEMOTIONS'](emotions.filter(t => !ids.has(t.id)))
          this['emotionCycle/SET_STEMPLATE'](template)
          this['emotionCycle/SET_STEMPLATEID'](id)
          this.loading = false
        })
    },
    updateTemplate () {
      emotionCycleService.updateStrategyTemplate(this.emotionCycle.swapStrategy.templateId, this.emotionCycle.swapStrategy.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
