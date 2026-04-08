<template>
  <edit-content
    v-loading="loading"
    :name="'thought'"
    :list1="emotionCycle.swapStrategy.template.thoughts"
    :list2="emotionCycle.swapStrategy.thoughts"
    :list1-title="'Emotional Cycle Thought Strategies Template'"
    :list2-title="'Emotional Cycle Thought Strategies'"
    :placeholder="'New thought'"
    @createPrepopulated="createThought"
    @updateTemplate="updateTemplate"
    @delete="deleteThought"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import emotionCycleService from '@/services/emotionCycle'
import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'ThoughtStrategyEditContent',
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
    if (!this.emotionCycle.swapStrategy.template.thoughts.length || !this.emotionCycle.swapStrategy.thoughts.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_STHOUGHTS',
      'emotionCycle/SET_STHOUGHT',
      'emotionCycle/SET_STEMPLATE',
      'emotionCycle/SET_STEMPLATEID'
    ]),
    createThought (thought) {
      this.loading = true
      emotionCycleService.createStrategy('thought', thought)
        .then(res => {
          this['emotionCycle/SET_STHOUGHT'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteThought (id) {
      prepopulatedService.deletePrepopulated('thougth', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        emotionCycleService.getStrategies('thought'),
        emotionCycleService.getStrategyTemplate()
      ])
        .then(([thoughts, temp]) => {
          const { id, template } = temp
          const ids = new Set(template.thoughts.map(t => t.id))
          this['emotionCycle/SET_STHOUGHTS'](thoughts.filter(t => !ids.has(t.id)))
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
