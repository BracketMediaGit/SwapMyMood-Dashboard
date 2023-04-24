<template>
  <edit-content
    v-loading="loading"
    :name="'question'"
    :list1="survey.template"
    :list2="survey.questions"
    :list1-title="'Wellness Survey Questions Template'"
    :list2-title="'Wellness Survey Questions'"
    :placeholder="'New question'"
    @createPrepopulated="createQuestion"
    @updateTemplate="updateTemplate"
    @delete="deleteQuestion"
  />
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import EditContent from '@/components/EditContent'

import surveyService from '@/services/survey'

export default {
  name: 'SurveyEditContent',
  components: { EditContent },
  data () {
    return {
      loading: false,
      question: '',
      questions: [],
      template: [],
      templateId: ''
    }
  },
  computed: {
    ...mapGetters([
      'survey'
    ])
  },
  created () {
    if (!this.survey.template.length) {
      this.loading = true
      this.$store.dispatch('survey/getData')
        .then(() => { this.loading = false })
    }
  },
  methods: {
    ...mapMutations([
      'survey/SET_QUESTION'
    ]),
    deleteQuestion (id) {
      surveyService.deleteQuestion(id)
        .then(res => console.log(res))
    },
    createQuestion (question) {
      this.loading = true
      surveyService.createQuestion(question)
        .then(res => {
          this['survey/SET_QUESTION'](res)
          this.loading = false
        })
    },
    updateTemplate () {
      surveyService.updateTemplate(this.survey.templateId, this.survey.template)
        .then(res => console.log(res))
    }
  }
}
</script>
