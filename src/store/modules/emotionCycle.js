const state = {
  emotionCycles: [],
  emotion: {
    emotions: [],
    template: [],
    templateId: ''
  },
  sensations: {
    head: {
      head: [],
      template: [],
      templateId: ''
    },
    chest: {
      chest: [],
      template: [],
      templateId: ''
    },
    abdomen: {
      abdomen: [],
      template: [],
      templateId: ''
    },
    arm: {
      arm: [],
      template: [],
      templateId: ''
    },
    leg: {
      leg: [],
      template: [],
      templateId: ''
    },
    wholebody: {
      wholebody: [],
      template: [],
      templateId: ''
    }
  },
  thought: {
    thoughts: [],
    template: [],
    templateId: ''
  },
  swapStrategy: {
    template: {
      triggers: [],
      emotions: [],
      sensations: [],
      thoughts: [],
      behaviors: []
    },
    templateId: '',
    triggers: [],
    emotions: [],
    sensations: [],
    thoughts: [],
    behaviors: []
  }
}

const mutations = {
  SET_EC: (state, ec) => {
    state.emotionCycles = ec
  },
  SET_EMOTIONS: (state, emotions) => {
    state.emotion.emotions = emotions
  },
  SET_EMOTION: (state, problem) => {
    state.emotion.emotions.push(problem)
  },
  SET_ETEMPLATE: (state, template) => {
    state.emotion.template = template
  },
  SET_ETEMPLATEID: (state, id) => {
    state.emotion.templateId = id
  },

  SET_HEADS: (state, headSensations) => {
    state.sensations.head.head = headSensations
  },
  SET_HEAD: (state, sensation) => {
    state.sensations.head.head.push(sensation)
  },
  SET_HTEMPLATE: (state, template) => {
    state.sensations.head.template = template
  },
  SET_HTEMPLATEID: (state, id) => {
    state.sensations.head.templateId = id
  },

  SET_CHESTS: (state, chestSensations) => {
    state.sensations.chest.chest = chestSensations
  },
  SET_CHEST: (state, sensation) => {
    state.sensations.chest.chest.push(sensation)
  },
  SET_CTEMPLATE: (state, template) => {
    state.sensations.chest.template = template
  },
  SET_CTEMPLATEID: (state, id) => {
    state.sensations.chest.templateId = id
  },

  SET_ABDOMENS: (state, abdomenSensations) => {
    state.sensations.abdomen.abdomen = abdomenSensations
  },
  SET_ABDOMEN: (state, sensation) => {
    state.sensations.abdomen.abdomen.push(sensation)
  },
  SET_ATEMPLATE: (state, template) => {
    state.sensations.abdomen.template = template
  },
  SET_ATEMPLATEID: (state, id) => {
    state.sensations.abdomen.templateId = id
  },

  SET_ARMS: (state, armSensations) => {
    state.sensations.arm.arm = armSensations
  },
  SET_ARM: (state, sensation) => {
    state.sensations.arm.arm.push(sensation)
  },
  SET_ARMTEMPLATE: (state, template) => {
    state.sensations.arm.template = template
  },
  SET_ARMTEMPLATEID: (state, id) => {
    state.sensations.arm.templateId = id
  },

  SET_LEGS: (state, legSensations) => {
    state.sensations.leg.leg = legSensations
  },
  SET_LEG: (state, sensation) => {
    state.sensations.leg.leg.push(sensation)
  },
  SET_LTEMPLATE: (state, template) => {
    state.sensations.leg.template = template
  },
  SET_LTEMPLATEID: (state, id) => {
    state.sensations.leg.templateId = id
  },

  SET_WHOLEBODYS: (state, wholebodySensations) => {
    state.sensations.wholebody.wholebody = wholebodySensations
  },
  SET_WHOLEBODY: (state, sensation) => {
    state.sensations.wholebody.wholebody.push(sensation)
  },
  SET_WTEMPLATE: (state, template) => {
    state.sensations.wholebody.template = template
  },
  SET_WTEMPLATEID: (state, id) => {
    state.sensations.wholebody.templateId = id
  },

  SET_THOUGHTS: (state, thoughts) => {
    state.thought.thoughts = thoughts
  },
  SET_THOUGHT: (state, sensation) => {
    state.thought.thoughts.push(sensation)
  },
  SET_TTEMPLATE: (state, template) => {
    state.thought.template = template
  },
  SET_TTEMPLATEID: (state, id) => {
    state.thought.templateId = id
  },

  SET_STEMPLATE: (state, template) => {
    state.swapStrategy.template = template
  },
  SET_STEMPLATEID: (state, id) => {
    state.swapStrategy.templateId = id
  },
  SET_STRIGGERS: (state, triggers) => {
    state.swapStrategy.triggers = triggers
  },
  SET_STRIGGER: (state, trigger) => {
    state.swapStrategy.triggers.push(trigger)
  },
  SET_SEMOTIONS: (state, emotions) => {
    state.swapStrategy.emotions = emotions
  },
  SET_SEMOTION: (state, emotion) => {
    state.swapStrategy.emotions.push(emotion)
  },
  SET_SSENSATIONS: (state, sensations) => {
    state.swapStrategy.sensations = sensations
  },
  SET_SSENSATION: (state, sensation) => {
    state.swapStrategy.sensations.push(sensation)
  },
  SET_STHOUGHTS: (state, thoughts) => {
    state.swapStrategy.thoughts = thoughts
  },
  SET_STHOUGHT: (state, thought) => {
    state.swapStrategy.thoughts.push(thought)
  },
  SET_SBEHAVIORS: (state, behaviors) => {
    state.swapStrategy.behaviors = behaviors
  },
  SET_SBEHAVIOR: (state, behavior) => {
    state.swapStrategy.behaviors.push(behavior)
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
