<template>
  <edit-content
    v-loading="loading"
    :name="'Sensation'"
    :list1="emotionCycle.sensations.leg.template"
    :list2="emotionCycle.sensations.leg.leg"
    :list1-title="'Emotional Cycle Leg Sensations Template'"
    :list2-title="'Emotional Cycle Leg Sensations'"
    :placeholder="'New Leg Sensation'"
    @createPrepopulated="createSensation"
    @updateTemplate="updateTemplate"
    @delete="deleteSensation"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'LegEditContent',
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
    if (!this.emotionCycle.sensations.leg.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_LEGS',
      'emotionCycle/SET_LEG',
      'emotionCycle/SET_LTEMPLATE',
      'emotionCycle/SET_LTEMPLATEID'
    ]),
    createSensation (leg) {
      this.loading = true
      prepopulatedService.createPrepopulated('legSensation', leg)
        .then(res => {
          this['emotionCycle/SET_LEG'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteSensation (id) {
      prepopulatedService.deletePrepopulated('legSensation', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('legSensation'),
        prepopulatedService.getPrepopulatedTemplate('leg')
      ])
        .then(([legSensations, template]) => {
          const ids = new Set(template.sensations.map(s => s.id))
          this['emotionCycle/SET_LEGS'](legSensations.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_LTEMPLATE'](template.sensations)
          this['emotionCycle/SET_LTEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.sensations.leg.templateId, 'leg', this.emotionCycle.sensations.leg.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
