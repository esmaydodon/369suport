<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">ESPECIALIDADES</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaProfesiones"
          />
          <!-- v-permission="['permisos.crear']" -->
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-plus"
            @click="AbrirModalAgregar"
          >
            Agregar
          </el-button>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-table
              :data="data"
              height="calc(calc(100vh - 380px))"
              style="width: 100%"
            >
              <el-table-column
                header-align="center"
                type="index"
                label="#"
                width="100"
              />
              <el-table-column
                header-align="center"
                prop="nombre"
                label="NOMBRE DE LA ESPECIALIDAD "
                min-width="500"
              />
              <el-table-column
                header-align="center"
                prop="activo"
                label="ACTIVO"
                width="150"
              />
              <el-table-column
                header-align="center"
                prop="activo"
                label="OPCIONES"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button type="primary" :class="scope.id">PRUEBA</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <paginator
              :total="listQuery.total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              layout="total, prev, pager, next"
              @pagination="listaProfesiones"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Dialogo para editar o Crear un servicio -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- :before-close="dialogBeforeClose" -->
      <agregar-editar-especialidad />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Componentes
import AgregarEditarEspecialidad from './components/agregar_editar'
import Paginator from '@/components/Pagination'
// Resource
import EspecialidadesResource from '@/api/especialidades'
const especialidadesResource = new EspecialidadesResource()
export default {
  name: 'Especialidades',
  components: { AgregarEditarEspecialidad, Paginator },
  data() {
    return {
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      widthModal: '40%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      }
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
      } else {
        this.widthModal = '40%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaProfesiones() {
      this.loading = true
      especialidadesResource.list(this.listQuery)
        .then(
          (response) => {
            const { data, meta } = response
            this.data = data
            this.listQuery.total = meta.total
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
    AbrirModalAgregar() {
      this.tituloModalAgregarEditar = 'REGISTRAR ESPECIALIDAD'
      this.profesionEditarId = -5
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    cerrarModalAgregarEditar() {
      this.tituloModalAgregarEditar = ''
      this.modalAgregarEditar = false
      this.listaProfesiones()
      this.$nextTick(() => {
        this.profesionEditarId = -5
      })
    }
  }
}
</script>
