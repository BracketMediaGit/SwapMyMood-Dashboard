<template>
  <edit-content
    v-loading="loading"
    :name="'Sensation'"
    :list1="emotionCycle.sensations.chest.template"
    :list2="emotionCycle.sensations.chest.chest"
    :list1-title="'Emotional Cycle Chest, Heart, Breathing Sensations Template'"
    :list2-title="'Emotional Cycle Chest, Heart, Breathing Sensations'"
    :placeholder="'New Chest, Heart, Breathing Sensation'"
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
  name: 'ChestEditContent',
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
    if (!this.emotionCycle.sensations.chest.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_CHESTS',
      'emotionCycle/SET_CHEST',
      'emotionCycle/SET_CTEMPLATE',
      'emotionCycle/SET_CTEMPLATEID'
    ]),
    createSensation (chest) {
      this.loading = true
      prepopulatedService.createPrepopulated('chestSensation', chest)
        .then(res => {
          this['emotionCycle/SET_CHEST'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteSensation (id) {
      prepopulatedService.deletePrepopulated('chestSensation', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('chestSensation'),
        prepopulatedService.getPrepopulatedTemplate('chest')
      ])
        .then(([chestSensations, template]) => {
          const ids = new Set(template.sensations.map(s => s.id))
          this['emotionCycle/SET_CHESTS'](chestSensations.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_CTEMPLATE'](template.sensations)
          this['emotionCycle/SET_CTEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.sensations.chest.templateId, 'chest', this.emotionCycle.sensations.chest.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
