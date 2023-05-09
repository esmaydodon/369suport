<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :xs="24" :md="8">
        <div style="width: 100%;height: calc(100vh - 165px);overflow: auto; padding-top: 20px;">
          <el-descriptions title="" direction="vertical" :column="4" border>
            <el-descriptions-item label="N° Historia Clinica" :span="2">
              <template>
                {{ data.nro_historia_clinica }}
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Paciente" :span="2">
              {{ data.paciente }}
            </el-descriptions-item>
            <el-descriptions-item label="Fecha De Cirugia" :span="2">
              {{ data.fecha_cirugia }}
            </el-descriptions-item>
            <el-descriptions-item label="Sala De Operaciones" :span="2">
              {{ data.sala_operacion }}
            </el-descriptions-item>
            <el-descriptions-item label="Turno" :span="2">
              {{ data.turno }}
            </el-descriptions-item>
            <el-descriptions-item label="Cama De Origen" :span="2">
              {{ data.cama_origen }}
            </el-descriptions-item>
            <el-descriptions-item label="Diagnosticon" :span="2">
              {{ data.diagnostico }}
            </el-descriptions-item>
            <el-descriptions-item label="Operacion Programada" :span="2">
              {{ data.operacion_programada_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Observacion" :span="4">
              {{ data.observacion }}
            </el-descriptions-item>
            <el-descriptions-item label="Anestesiologo 1" :span="2">
              {{ data.anestesiologo_1_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Anestesiologo 2" :span="2">
              {{ data.anestesiologo_2_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Cirujano 1" :span="2">
              {{ data.cirujano_1_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Cirujano 2" :span="2">
              {{ data.cirujano_2_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Cirujano 3" :span="4">
              {{ data.cirujano_3_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Medico residente anastesiologo 1" :span="2">
              {{ data.medico_residente_anestesiologo_1_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Medico residente anastesiologo 2" :span="2">
              {{ data.medico_residente_anestesiologo_2_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Medico Residente Cirugia 1" :span="2">
              {{ data.medico_residente_cirugia_1_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Medico Residente Cirugia 2" :span="2">
              {{ data.medico_residente_cirugia_2_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Licenciada Instrumentista 1" :span="2">
              {{ data.licenciada_instrumentista_1_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Licenciada Instrumentista 2" :span="2">
              {{ data.licenciada_instrumentista_2_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Licenciada Circulante 1" :span="2">
              {{ data.licenciada_circulante_1_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Licenciada Circulante 2" :span="2">
              {{ data.licenciada_circulante_2_id_label }}
            </el-descriptions-item>
            <el-descriptions-item label="Turno Anestesiologo" :span="2">
              {{ data.turno_anestesiologo }}
            </el-descriptions-item>
            <el-descriptions-item label="SIS" :span="2">
              <el-switch v-model="data.sis" active-color="#13ce66" inactive-color="#ff4949" />
            </el-descriptions-item>
            <el-descriptions-item label="Condicional" :span="2">
              <el-switch v-model="data.condicional" active-color="#13ce66" inactive-color="#ff4949" />
            </el-descriptions-item>
            <el-descriptions-item label="Tipo Anestesia" :span="2">
              {{ data.tipo_anestesia_id_label }}
            </el-descriptions-item>
          </el-descriptions>
          <!-- <el-descriptions title="Información de contacto" direction="vertical" :column="4" border>
            <el-descriptions-item label="Teléfono" :span="4">
              {{ data.persona.telefono }}
            </el-descriptions-item>
            <el-descriptions-item label="Correo electronico" :span="4">
              {{ data.persona.correo }}
            </el-descriptions-item>
          </el-descriptions> -->
          <el-divider />
          <!-- <el-descriptions title="Información geográfica" direction="vertical" :column="4" border>
            <el-descriptions-item label="REGIÓN" :span="4">
              {{ data.region }}
            </el-descriptions-item>
            <el-descriptions-item label="PROVINCIA" :span="4">
              {{ data.provincia }}
            </el-descriptions-item>
            <el-descriptions-item label="DISTRITO" :span="4">
              {{ data.distrito }}
            </el-descriptions-item>
          </el-descriptions> -->
          <el-divider />
          <!-- <div style="width: 100%;height: calc(60vh - 80px);overflow: auto; padding-top: 20px;">
            <el-descriptions title="Especialidades" direction="vertical" :column="4" border>
              <el-descriptions-item label="Especialidades" :span="4">
                <el-table
                  :data="data.especialdadpeersona"
                  style="height: calc(60vh - 80px);"
                >
                  <el-table-column label="#" type="index" />
                  <el-table-column label="Especialidad">
                    <template slot-scope="scope">
                      {{ scope.row.especialidad.nombre }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Estado" prop="activo">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.especialidad.activo" type="primary">Activo</el-tag>
                      <el-tag v-else type="warning">Inactivo</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions>
          </div> -->
          <el-divider />
        </div>
      </el-col>
      <el-col :xs="24" :md="16">
        <div style="width: 100%;height: calc(100vh - 165px);overflow: auto;">
          <el-descriptions v-if="data.detallecirugia" title="DETALLE" direction="vertical" :column="4" border>
            <el-descriptions-item label="Destino Post Cirugia" :span="1">
              {{ data.destinoPostCirugiaLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="Tipo Cirugia" :span="1">
              {{ data.tiposCirugiaLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="ASA" :span="2">
              {{ data.asaLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="Categoria Cirugia" :span="1">
              {{ data.categoriasCirugiaLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="Cama Destino" :span="2">
              {{ data.nroCamaDestino }}
            </el-descriptions-item>
            <el-descriptions-item label="Equipo Completo" :span="2">
              <el-switch v-model="data.detallecirugiaEquipoCompleto" active-color="#13ce66" inactive-color="#ff4949" />
            </el-descriptions-item>
            <el-descriptions-item v-if="data.detallecirugiaEquipoCompleto" label="Equipo Completo Observacion" :span="2">
              {{ data.detallecirugiaEquipoCompletoObservacion }}
            </el-descriptions-item>
            <!-- <el-descriptions-item label="Checklist" :span="2">
              {{ data.detallecirugiaChecklist }}
            </el-descriptions-item> -->
            <el-descriptions-item label="Checklist" :span="2">
              <el-switch v-model="data.detallecirugiaChecklist" active-color="#13ce66" inactive-color="#ff4949" />
            </el-descriptions-item>
            <el-descriptions-item label="Cirugia Segura" :span="2">
              <el-switch v-model="data.detallecirugiaCirugia_segura" active-color="#13ce66" inactive-color="#ff4949" />
            </el-descriptions-item>
            <el-descriptions-item label="Fallecimiento Paciente" :span="2">
              <el-switch v-model="data.detallecirugiaFallecimiento_paciente" active-color="#13ce66" inactive-color="#ff4949" />
            </el-descriptions-item>
            <el-descriptions-item v-if="data.detallecirugiaFallecimiento_paciente" label="Observacion Fallecimiento Paciente" :span="2">
              {{ data.detallecirugiaObservacion_fallecimiento_paciente }}
            </el-descriptions-item>
            <el-divider />
          </el-descriptions>
          <el-descriptions v-else title="SUSPENCION" direction="vertical" :column="4" border>
            <el-descriptions-item label="Destino Post Cirugia" :span="1">
              {{ data.motivoSuspensionCirugia }}
            </el-descriptions-item>
            <el-descriptions-item label="Doctor Suspencion Cirugía" :span="1">
              {{ data.doctorSuspensionCirugia }}
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions v-if="data.detallecirugiaEquipoCompleto" title="Detalle Cronológico" direction="vertical" :column="4" border>
            <el-descriptions-item label="Hora Ingreso Quirofano" :span="2">
              {{ data.detallecronologico.hora_ingreso_quirofano }}
            </el-descriptions-item>
            <el-descriptions-item label="Hora Salida Quirofano" :span="2">
              {{ data.detallecronologico.hora_salida_quirofano }}
            </el-descriptions-item>
            <el-descriptions-item label="Hora Iinicio Anestesia" :span="2">
              {{ data.detallecronologico.hora_inicio_anestesia }}
            </el-descriptions-item>
            <el-descriptions-item label="Hora fin Anestesia" :span="2">
              {{ data.detallecronologico.hora_fin_anestesia }}
            </el-descriptions-item>
            <el-descriptions-item label="Hora Inicio Cirugia" :span="2">
              {{ data.detallecronologico.hora_inicio_cirugia }}
            </el-descriptions-item>
            <el-descriptions-item label="Hora Fin Cirugia" :span="2">
              {{ data.detallecronologico.hora_fin_cirugia }}
            </el-descriptions-item>
            <el-descriptions-item label="Alta Post Anestesia" :span="2">
              {{ data.detallecronologico.alta_postanestesia }}
            </el-descriptions-item>
            <el-descriptions-item label="Total Horas Efectivas" :span="2">
              {{ data.detallecronologico.total_horas_efectivas }}
            </el-descriptions-item>
            <el-descriptions-item label="Horas Acto Quirurgico" :span="2">
              {{ data.detallecronologico.horas_acto_quirurgico }}
            </el-descriptions-item>
            <el-descriptions-item label="Tiempo Recuperacion" :span="2">
              {{ data.detallecronologico.tiempo_recuperacion }}
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
// import VinculoLaboralResource from '@/api/vinculolaboral'
// const vinculoLaboralResource = new VinculoLaboralResource()
import EspecialidadesResource from '@/api/especialidades'
const especialidadesResource = new EspecialidadesResource()
import ProgramacionCirugiaResource from '@/api/programacion-cirugia'
const programacionCirugiaResource = new ProgramacionCirugiaResource()
export default {
  name: 'DetalleProgramacionCirugia',
  props: {
    detalleCirugiaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      listaEspPersona: [],
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
        especialdadpeersona: [
          {
            id: null,
            persona_id: null,
            especialidad_id: null,
            especialidad: {
              id: null,
              codigo: null,
              nombre: null,
              abreviatura: null,
              activo: null
            }
          }
        ],
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
        },
        detalleCirugia: {
          id: undefined,
          nro_historia_clinica: '',
          historia_clinica_paciente_id: undefined,
          paciente: '',
          fecha_cirugia: '',
          sala_operaciones_id: undefined,
          sala_operacion: '',
          turno: '',
          cama_origen: '',
          cama_id: '',
          equipoquirurgico_id: undefined,
          diagnostico_id: undefined,
          diagnostico: '',
          operacion_programada_id_label: '',
          operacion_programada_id: undefined,
          duracion_programada: '',
          observacion: '',
          anestesiologo_1_id_label: '',
          anestesiologo_1_id: undefined,
          anestesiologo_2_id_label: '',
          anestesiologo_2_id: undefined,
          cirujano_1_id_label: '',
          cirujano_1_id: undefined,
          cirujano_2_id_label: '',
          cirujano_2_id: undefined,
          cirujano_3_id_label: '',
          cirujano_3_id: undefined,
          medico_residente_anestesiologo_1_id_label: '',
          medico_residente_anestesiologo_1_id: undefined,
          medico_residente_anestesiologo_2_id_label: '',
          medico_residente_anestesiologo_2_id: undefined,
          medico_residente_cirugia_1_id_label: '',
          medico_residente_cirugia_1_id: undefined,
          medico_residente_cirugia_2_id_label: '',
          medico_residente_cirugia_2_id: undefined,
          licenciada_instrumentista_1_id_label: '',
          licenciada_instrumentista_1_id: undefined,
          licenciada_instrumentista_2_id_label: '',
          licenciada_instrumentista_2_id: undefined,
          licenciada_circulante_1_id_label: '',
          licenciada_circulante_1_id: undefined,
          licenciada_circulante_2_id_label: '',
          licenciada_circulante_2_id: undefined,
          // suspension_cirugia_id: undefined,
          turno_anestesiologo: null,
          sis: null,
          condicional: null,
          tipo_anestesia_id_label: null,
          tipo_anestesia_id: undefined,
          destinoPostCirugiaLabel: '',
          tiposCirugiaLabel: '',
          asaLabel: '',
          categoriasCirugiaLabel: '',
          doctorSuspensionCirugia: '',
          motivoSuspensionCirugia: '',
          nroCamaDestino: '',
          detallecirugiaEquipoCompleto: '',
          detallecirugiaEquipoCompletoObservacion: '',
          detallecirugiaFallecimiento_paciente: '',
          detallecirugiaObservacion_fallecimiento_paciente: '',
          detallecirugiaChecklist: '',
          suspensionCirugia: {
            id: undefined,
            doctor_suspende_cirugia: undefined,
            motivo_suspension: ''
          },
          detallecirugia: {
            id: undefined,
            programacion_cirugia_id: undefined,
            destino_postcirugia_id: undefined,
            cama_destino_id: undefined,
            asa_id: undefined,
            tipo_cirugia_id: undefined,
            categoria_cirugia_id: undefined,
            equipo_completo: undefined,
            observaciones_equipo_completo: '',
            checklist: '',
            cirugia_segura: '',
            fallecimiento_paciente: '',
            observacion_fallecimiento_paciente: '',
            asa: {
              id: undefined,
              nombre: '',
              abreviatura: '',
              activo: ''
            },
            tipos_cirugia: {
              id: undefined,
              nombre: '',
              activo: ''
            },
            destinos_post_cirugia: {
              id: undefined,
              nombre: '',
              activo: ''
            },
            categorias_cirugia: {
              id: undefined,
              nombre: '',
              activo: ''
            }
          },
          detallecronologico: {
            id: undefined,
            programacion_cirugia_id: undefined,
            hora_ingreso_quirofano: '',
            hora_salida_quirofano: '',
            hora_inicio_anestesia: '',
            hora_fin_anestesia: '',
            hora_inicio_cirugia: '',
            hora_fin_cirugia: '',
            alta_postanestesia: '',
            total_horas_efectivas: '',
            horas_acto_quirurgico: '',
            tiempo_recuperacion: ''
          }
        }
      }
    }
  },
  watch: {
    detalleCirugiaId(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        // console.log('this.detalleCirugiaId')
        this.getDetalleProgramacionCirugia()
      }
    }
  },
  mounted() {
    if (this.detalleCirugiaId) {
      this.getDetalleProgramacionCirugia()
    }
  },
  methods: {
    async getListEspecialidades() {
      try {
        this.loadingtab1 = true
        const { data } = await especialidadesResource.especialidadesPorPersona(this.personaId)
        this.listaEspPersona = await data
        this.loadingtab1 = false
        // const datos = await resultado.json();
        // console.log(datos);
      } catch (error) {
        console.log(error)
        this.loadingtab1 = false
      }
    },
    getDetalleProgramacionCirugia() {
      this.loading = true
      // console.log(this.detalleCirugiaId)
      programacionCirugiaResource.get(this.detalleCirugiaId)
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
