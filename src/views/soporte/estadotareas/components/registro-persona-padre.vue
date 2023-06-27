<template>
  <div v-loading="loading">
    <agregar-editar-persona :persona-id="fakeid" @close="close" />
  </div>
</template>

<script>
import PersonasResource from '@/api/personas'
const personasResource = new PersonasResource()
export default {
  name: 'RegistroPersonaApoderado',
  data() {
    return {
      fakeid: -1,
      loading: false
    }
  },
  beforeCreate() {
    this.$options.components.AgregarEditarPersona = require('./agregar_editar').default
  },
  mounted() {
    console.log('Fake id: ' + this.fakeid)
  },
  methods: {
    close({ persona_id }) {
      if (persona_id != null) {
        console.log('next step')
        this.getPersonaInfo(persona_id)
      } else {
        this.$emit('close', { persona_id: null })
      }
    },
    getPersonaInfo(persona_id) {
      this.loading = true
      personasResource.get(persona_id)
        .then(
          (response) => {
            var persona = response.data
            this.$emit('close', { persona_id: persona.id, persona_label: persona.doc_identidad + ' - ' + persona.nombre_completo })
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    }
  }
}
</script>
