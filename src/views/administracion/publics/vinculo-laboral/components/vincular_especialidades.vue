<template>
  <div>
    <el-row :gutter="10">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleChangeTab">
        <el-tab-pane label="Lista de Especialidades" name="lista">
          <el-table
            v-loading="loadingtab1"
            :data="listaEspPersona"
            empty-text="Área no cuenta con camas vinculadas"
            style="height: calc(60vh - 80px);"
          >
            <el-table-column label="#" type="index" />
            <el-table-column label="Especialidad" prop="nombre" />
            <el-table-column label="Estado" prop="activo">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.activo" type="primary">Activo</el-tag>
                <el-tag v-else type="warning">Inactivo</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Acciones" prop="activo">
              <template slot-scope="scope">
                <el-button type="danger" @click="eliminarVinculoCamasArea(scope.row.id)">Desvincuar</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Vincular  Especialidades" name="vincular">
          <div style="height: calc(60vh - 80px);">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :md="12">
                <el-input
                  v-model="filtroArbol"
                  placeholder="Filtrar Especialidades"
                />
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-button
                  type="primary"
                  style="width: 100%;"
                  @click="vincularEspecialidadesPersona"
                >
                  Vincular  Especialidades seleccionadas
                </el-button>
              </el-col>
            </el-row>
            <el-divider />
            <el-tree
              ref="tree"
              v-loading="loadingtab2"
              :data="listaCamasSinArea"
              node-key="id"
              :props="{label:'nombre'}"
              show-checkbox
              check-on-click-node
              :filter-node-method="filterNode"
              empty-text="No hay camas para vincular"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row :gutter="10" :type="rowType" justify="center">
      <el-col :xs="24" :sm="12" :md="8" style="text-align: right;">
        <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="close">Cerrar</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { debounce } from '@/utils'
// Resource
import CamasResource from '@/api/camas'
const camasResource = new CamasResource()
import EspecialidadesResource from '@/api/especialidades'
const especialidadesResource = new EspecialidadesResource()
export default {
  name: 'ListarEspecialidades',
  props: {
    personaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      rowType: 'flex',
      activeName: 'lista',
      listaEspPersona: [],
      listaCamasSinArea: [],
      //
      loadingtab1: false,
      loadingtab2: false,
      filtroArbol: ''
    }
  },
  watch: {
    personaId(newVal, oldVal) {
      if (newVal !== oldVal && newVal > 0) {
        this.getListEspecialidades()
        this.activeName = 'lista'
      }
    },
    filtroArbol(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.rowType = ''
      } else {
        this.rowType = 'flex'
      }
      return true
    })
    window.addEventListener('rowType', this.__resizeHandler)
    if (this.personaId > 0) {
      this.getListEspecialidades()
    }
  },
  beforeDestroy() {
    window.removeEventListener('rowType', this.__resizeHandler)
  },
  methods: {
    handleChangeTab({ index }) {
      if (parseInt(index) === 0) {
        this.getListEspecialidades()
      }
      if (parseInt(index) === 1) {
        this.getCamasParaVicular()
      }
    },
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
    // getListEspecialidades() {
    //   this.loadingtab1 = true
    //   camasResource.camasPorArea(this.personaId)
    //     .then(
    //       (response) => {
    //         this.listaEspPersona = response.data
    //         this.loadingtab1 = false
    //       }
    //     )
    //     .catch(
    //       (error) => {
    //         console.log(error)
    //         this.loadingtab1 = false
    //       }
    //     )
    // },
    getCamasParaVicular() {
      this.loadingtab2 = true
      especialidadesResource.listaEspecialidades()
        .then(
          (response) => {
            this.listaCamasSinArea = response.data
            this.loadingtab2 = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loadingtab2 = false
          }
        )
    },
    eliminarVinculoCamasArea(id) {
      this.loadingtab1 = true
      camasResource.eliminarVinculoCamaArea({ cama_id: id })
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loadingtab1 = false
            this.getListEspecialidades()
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loadingtab1 = false
          }
        )
    },
    vincularEspecialidadesPersona() {
      this.loadingtab2 = true
      const especialidades = this.$refs.tree.getCheckedKeys()
      console.log(especialidades)
      if (especialidades.length === 0) {
        this.$message({
          type: 'info',
          message: 'Debe Seleccionar por lo menos una Especialidad para Vincular'
        })
        this.loadingtab2 = false
      } else {
        especialidadesResource.vincularEspecialidadPersona({ personaId: this.personaId, especialidades: especialidades })
          .then(
            (response) => {
              this.$message({
                type: 'success',
                message: response.message
              })
              this.loadingtab2 = false
              this.getCamasParaVicular()
            }
          )
          .catch(
            (error) => {
              console.log(error)
              this.loadingtab2 = false
            }
          )
      }
    },
    close() {
      this.$emit('close')
    },
    // Metodos de arbol
    filterNode(value, data) {
      if (!value) return true
      return data.nombre.indexOf(value) !== -1
    }
  }
}
</script>
