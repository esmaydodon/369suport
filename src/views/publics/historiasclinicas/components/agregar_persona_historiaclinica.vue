<template>
  <div>
    <el-card>
      <el-steps slot="header" :active="stepactive" finish-status="success" process-status="finish" align-center>
        <el-step title="REGISTRO PERSONA" />
        <el-step title="REGISTRO HISTORIA CLINICA" />
      </el-steps>
      <div v-if="stepactive == 0">
        <agregar-editar-persona :persona-id="defaulValue" @close="validarPersonaCreada" />
      </div>
      <div v-if="stepactive == 1">
        <agregar-editar-historia-clinica :historia-clinica-id="defaulValue" :persona-id="personaId" @close="close" />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AgregarPersonaHistoriaClinica',
  components: {
    AgregarEditarHistoriaClinica: () => import('./agregar_editar.vue'),
    AgregarEditarPersona: () => import('@/views/administracion/publics/personas/components/agregar_editar')
  },
  data() {
    return {
      defaulValue: -5,
      stepactive: 0,
      personaId: -1
    }
  },
  methods: {
    validarPersonaCreada({ persona_id }) {
      if (persona_id != null) {
        console.log('next step')
        this.personaId = persona_id
        this.stepactive++
      } else {
        this.close()
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
