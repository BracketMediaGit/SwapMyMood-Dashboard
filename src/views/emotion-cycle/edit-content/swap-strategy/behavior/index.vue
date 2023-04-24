<template>
  <edit-content
    v-loading="loading"
    :name="'behavior'"
    :list1="emotionCycle.swapStrategy.template.behaviors"
    :list2="emotionCycle.swapStrategy.behaviors"
    :list1-title="'Emotion Cycle Behavior Strategies Template'"
    :list2-title="'Emotion Cycle Behavior Strategies'"
    :placeholder="'New Behavior'"
    @createPrepopulated="createBehavior"
    @updateTemplate="updateTemplate"
    @delete="deleteBehavior"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import emotionCycleService from '@/services/emotionCycle'
import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'BehaviorStrategyEditContent',
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
    if (!this.emotionCycle.swapStrategy.template.behaviors.length || !this.emotionCycle.swapStrategy.behaviors.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_SBEHAVIORS',
      'emotionCycle/SET_SBEHAVIOR',
      'emotionCycle/SET_STEMPLATE',
      'emotionCycle/SET_STEMPLATEID'
    ]),
    createBehavior (behavior) {
      this.loading = true
      emotionCycleService.createStrategy('behavior', behavior)
        .then(res => {
          this['emotionCycle/SET_SBEHAVIOR'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteBehavior (id) {
      prepopulatedService.deletePrepopulated('behavior', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        emotionCycleService.getStrategies('behavior'),
        emotionCycleService.getStrategyTemplate()
      ])
        .then(([behaviors, temp]) => {
          const { id, template } = temp
          const ids = new Set(template.behaviors.map(t => t.id))
          this['emotionCycle/SET_SBEHAVIORS'](behaviors.filter(t => !ids.has(t.id)))
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
