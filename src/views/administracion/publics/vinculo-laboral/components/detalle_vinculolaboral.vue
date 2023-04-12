<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :xs="24" :md="8">
        <div style="width: 100%;height: calc(100vh - 165px);overflow: auto; padding-top: 20px;">
          <el-descriptions title="Información personal" direction="vertical" :column="4" border>
            <!-- <el-descriptions-item label="Nro. historia clinica" :span="2">
              {{ data.nro_historia_clinica }}
            </el-descriptions-item>
            <el-descriptions-item label="Nro. historia clinica fisica" :span="2">
              {{ data.nro_historia_clinica_fisica }}
            </el-descriptions-item> -->
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
            <el-descriptions-item label="Teléfono" :span="4">
              {{ data.persona.telefono }}
            </el-descriptions-item>
            <el-descriptions-item label="Correo electronico" :span="4">
              {{ data.persona.correo }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider />
          <el-descriptions title="Información geográfica" direction="vertical" :column="4" border>
            <el-descriptions-item label="REGIÓN" :span="4">
              {{ data.region }}
            </el-descriptions-item>
            <el-descriptions-item label="PROVINCIA" :span="4">
              {{ data.provincia }}
            </el-descriptions-item>
            <el-descriptions-item label="DISTRITO" :span="4">
              {{ data.distrito }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider />
        </div>
      </el-col>
      <el-col :xs="24" :md="16">
        <div style="width: 100%;height: calc(100vh - 165px);overflow: auto;">
          <el-descriptions title="ÁREA - CARGO" direction="vertical" :column="4" border>
            <el-descriptions-item label="ÁREA" :span="1">
              {{ data.area.nombre }}
            </el-descriptions-item>
            <el-descriptions-item label="CARGO" :span="1">
              {{ data.cargo.nombre }}
            </el-descriptions-item>
            <el-descriptions-item label="TIPO PERSONAL" :span="2">
              {{ data.tipopersonal.nombre }}
            </el-descriptions-item>
            <el-descriptions-item label="FECHA INICIO" :span="2">
              {{ data.fecha_inicio }}
            </el-descriptions-item>
            <el-descriptions-item label="FECHA FIN" :span="2">
              {{ data.fecha_fin }}
            </el-descriptions-item>
            <el-descriptions-item label="FECHA BAJA" :span="2">
              {{ data.fecha_baja }}
            </el-descriptions-item>
            <el-descriptions-item label="MOTIVO BAJA" :span="2">
              {{ data.motivo_baja }}
            </el-descriptions-item>
            <el-descriptions-item label="FECHA RENUNCIA" :span="4">
              {{ data.fecha_renuncia }}
            </el-descriptions-item>
          </el-descriptions>
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
import VinculoLaboralResource from '@/api/vinculolaboral'
const vinculoLaboralResource = new VinculoLaboralResource()
export default {
  name: 'DetalleVinculoLaboral',
  props: {
    vinculoLaboralId: {
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
        },
        area: {
          id: null,
          abreviatura: '',
          nombre: ''
        },
        cargo: {
          id: null,
          abreviatura: '',
          nombre: ''
        },
        tipopersonal: {
          id: undefined,
          nombre: ''
        }
      }
    }
  },
  watch: {
    vinculoLaboralId(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.getDetalleVinculoLaboral()
      }
    }
  },
  mounted() {
    if (this.vinculoLaboralId) {
      this.getDetalleVinculoLaboral()
    }
  },
  methods: {
    getDetalleVinculoLaboral() {
      this.loading = true
      vinculoLaboralResource.detalle(this.vinculoLaboralId)
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
