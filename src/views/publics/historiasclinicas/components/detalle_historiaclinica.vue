<template>
  <div v-loading="loading" style="height: calc(100vh - 75px);">
    <el-row :gutter="10">
      <el-col :xs="24" :md="8">
        <div style="width: 100%;height: calc(100vh - 165px);overflow: auto; padding-top: 20px;">
          <el-descriptions title="Información personal" direction="vertical" :column="4" border>
            <el-descriptions-item label="Nro. historia clínica" :span="2">
              {{ data.nro_historia_clinica }}
            </el-descriptions-item>
            <el-descriptions-item label="Nro. historia clínica fisica" :span="2">
              {{ data.nro_historia_clinica_fisica }}
            </el-descriptions-item>
            <el-descriptions-item label="Tipo doc. identidad" :span="2">
              <template v-if="data.persona.tipo_doc_identidad === 1">
                DNI
              </template>
              <template v-else>
                CARNET EXTRANGERIA
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Nro doc. identidad" :span="2">
              {{ data.persona.doc_identidad }}
            </el-descriptions-item>
            <el-descriptions-item label="Nombre" :span="4">
              {{ data.persona.nombre_completo }}
            </el-descriptions-item>
            <el-descriptions-item label="Fecha de nacimiento" :span="2">
              {{ data.persona.fecha_nacimiento }}
            </el-descriptions-item>
            <el-descriptions-item label="Sexo" :span="2">
              <template v-if="data.persona.sexo === 'M'">
                MASCULINO
              </template>
              <template v-else>
                FEMENINO
              </template>
            </el-descriptions-item>
          </el-descriptions>
          <el-divider />
          <el-descriptions title="Información de contacto" direction="vertical" :column="4" border>
            <el-descriptions-item label="Telefono" :span="4">
              {{ data.persona.telefono }}
            </el-descriptions-item>
            <el-descriptions-item label="Correo electronico" :span="4">
              {{ data.persona.correo }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider />
          <el-descriptions title="Información geografica" direction="vertical" :column="4" border>
            <el-descriptions-item label="REGION" :span="4">
              {{ data.region }}
            </el-descriptions-item>
            <el-descriptions-item label="PROVINCIA" :span="4">
              {{ data.provincia }}
            </el-descriptions-item>
            <el-descriptions-item label="DISTRITO" :span="4">
              {{ data.distrito }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
      <el-col :xs="24" :md="16">
        <div style="width: 100%;height: calc(100vh - 165px);overflow: auto;">
          info atenciones
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="10" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" plain style="width: 100%;" @click="close">Cerrar</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// Resource
import HistoriasClinicasResource from '@/api/historiasclinicas'
const historiasClinicasResource = new HistoriasClinicasResource()
export default {
  name: 'DetalleHistoriaClinica',
  props: {
    historiaClinicaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      data: {
        id: null,
        persona_id: null,
        nro_historia_clinica: null,
        nro_historia_clinica_fisica: null,
        persona: {
          id: null,
          tipo_doc_identidad: null,
          doc_identidad: null,
          nombres: null,
          apellido_paterno: null,
          apellido_materno: null,
          fecha_nacimiento: null,
          nombre_completo: null,
          sexo: null,
          telefono: null,
          correo: null,
          distrito_id: null,
          direccion: null,
          provincia_id: null,
          region_id: null,
          distrito: null,
          provincia: null,
          region: null
        }
      }
    }
  },
  watch: {
    historiaClinicaId(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.getDetalleHistoriaClinica()
      }
    }
  },
  mounted() {
    if (this.historiaClinicaId) {
      this.getDetalleHistoriaClinica()
    }
  },
  methods: {
    getDetalleHistoriaClinica() {
      this.loading = true
      historiasClinicasResource.detalle(this.historiaClinicaId)
        .then(
          (response) => {
            this.data = response.data
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    close() {
      this.$emit('close')
    }
  }
}

</script>
