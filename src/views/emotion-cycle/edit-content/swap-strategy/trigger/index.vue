<template>
  <edit-content
    v-loading="loading"
    :name="'trigger'"
    :list1="emotionCycle.swapStrategy.template.triggers"
    :list2="emotionCycle.swapStrategy.triggers"
    :list1-title="'Emotion Cycle Trigger Suggestions Template'"
    :list2-title="'Emotion Cycle Trigger Suggestions'"
    :placeholder="'New Trigger'"
    @createPrepopulated="createTrigger"
    @updateTemplate="updateTemplate"
    @delete="deleteTrigger"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import emotionCycleService from '@/services/emotionCycle'
import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'TriggerStrategyEditContent',
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
    if (!this.emotionCycle.swapStrategy.template.triggers.length || !this.emotionCycle.swapStrategy.triggers.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_STRIGGERS',
      'emotionCycle/SET_STRIGGER',
      'emotionCycle/SET_STEMPLATE',
      'emotionCycle/SET_STEMPLATEID'
    ]),
    createTrigger (trigger) {
      this.loading = true
      emotionCycleService.createStrategy('trigger', trigger)
        .then(res => {
          this['emotionCycle/SET_STRIGGER'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteTrigger (id) {
      prepopulatedService.deletePrepopulated('trigger', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        emotionCycleService.getStrategies('trigger'),
        emotionCycleService.getStrategyTemplate()
      ])
        .then(([triggers, temp]) => {
          const { id, template } = temp
          const ids = new Set(template.triggers.map(t => t.id))
          this['emotionCycle/SET_STRIGGERS'](triggers.filter(t => !ids.has(t.id)))
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
