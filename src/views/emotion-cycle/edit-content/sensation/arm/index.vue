<template>
  <edit-content
    v-loading="loading"
    :name="'Sensation'"
    :list1="emotionCycle.sensations.arm.template"
    :list2="emotionCycle.sensations.arm.arm"
    :list1-title="'Emotion Cycle Arm Sensations Template'"
    :list2-title="'Emotion Cycle Arm Sensations'"
    :placeholder="'New Arm Sensation'"
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
  name: 'ArmEditContent',
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
    if (!this.emotionCycle.sensations.arm.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_ARMS',
      'emotionCycle/SET_ARM',
      'emotionCycle/SET_ARMTEMPLATE',
      'emotionCycle/SET_ARMTEMPLATEID'
    ]),
    createSensation (arm) {
      this.loading = true
      prepopulatedService.createPrepopulated('armSensation', arm)
        .then(res => {
          this['emotionCycle/SET_ARM'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteSensation (id) {
      prepopulatedService.deletePrepopulated('armSensation', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('armSensation'),
        prepopulatedService.getPrepopulatedTemplate('arm')
      ])
        .then(([armSensations, template]) => {
          const ids = new Set(template.sensations.map(s => s.id))
          this['emotionCycle/SET_ARMS'](armSensations.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_ARMTEMPLATE'](template.sensations)
          this['emotionCycle/SET_ARMTEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.sensations.arm.templateId, 'arm', this.emotionCycle.sensations.arm.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
