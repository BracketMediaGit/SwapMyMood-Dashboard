<template>
  <edit-content
    v-loading="loading"
    :name="'sensation'"
    :list1="emotionCycle.swapStrategy.template.sensations"
    :list2="emotionCycle.swapStrategy.sensations"
    :list1-title="'Emotional Cycle Sensation Strategies Template'"
    :list2-title="'Emotional Cycle Sensation Strategies'"
    :placeholder="'New Sensation'"
    @createPrepopulated="createSensation"
    @updateTemplate="updateTemplate"
    @delete="deleteSensation"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import emotionCycleService from '@/services/emotionCycle'
import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'SensationStrategyEditContent',
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
    if (!this.emotionCycle.swapStrategy.template.sensations.length || !this.emotionCycle.swapStrategy.sensations.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_SSENSATIONS',
      'emotionCycle/SET_SSENSATION',
      'emotionCycle/SET_STEMPLATE',
      'emotionCycle/SET_STEMPLATEID'
    ]),
    createSensation (sensation) {
      this.loading = true
      emotionCycleService.createStrategy('sensation', sensation)
        .then(res => {
          this['emotionCycle/SET_SSENSATION'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteSensation (id) {
      prepopulatedService.deletePrepopulated('sensation', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        emotionCycleService.getStrategies('sensation'),
        emotionCycleService.getStrategyTemplate()
      ])
        .then(([sensations, temp]) => {
          const { id, template } = temp
          const ids = new Set(template.sensations.map(t => t.id))
          this['emotionCycle/SET_SSENSATIONS'](sensations.filter(t => !ids.has(t.id)))
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
