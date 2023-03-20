<template>
  <div class="app-container">
    <el-card style="padding;: 5px !important">
      <div slot="header">
        <h3 class="card-header">CIRUGÍAS</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-col :xs="24" :md="6">
            <el-input
              placeholder="Buscar"
              style="width: 100%; margin-bottom: 5px;"
              class="filter-item"
              clearable
            />
          </el-col>
          <el-col :xs="24" :md="3">
            <el-date-picker v-model="listQuery.fechaProgramacion" placeholder="" style="margin-bottom: 5px;" />
          </el-col>
          <el-col :xs="24" :md="2">
            <el-button
              class="filter-item"
              type="primary"
              style="width: 100%; margin-bottom: 5px;"
              icon="el-icon-search"
            />
          </el-col>
          <el-col :xs="24" :md="6">
            <el-button
              class="filter-item"
              style="width: 100%; margin-bottom: 5px;"
              type="primary"
              icon="el-icon-plus"
              @click="abrirModalAgregar"
            >
              Agregar
            </el-button>
          </el-col>
          <!-- v-permission="['permisos.crear']" -->
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
                align="center"
                prop="nombre"
                label="NOMBRE DEL SERVICIO"
                min-width="500"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="activo"
                label="ACTIVO"
                width="150"
              />
              <el-table-column
                header-align="center"
                align="center"
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
              @pagination="listaCirgugias"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- Dialogo para editar o Crear un servicio -->
    <el-dialog
      :title="tituloModalAgregarEditar"
      :visible.sync="modalAgregarEditar"
      top="1vh"
      :width="widthModal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <agregar-editar-programacion-cirugia :programacion-cirugia-id="programacionCirugiaEditarId" @close="cerrarModalAgregarEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Componentes
import AgregarEditarProgramacionCirugia from './components/agregar_editar_programacion'
import Paginator from '@/components/Pagination'
// Resource
export default {
  name: 'Cirugias',
  components: { AgregarEditarProgramacionCirugia, Paginator },
  data() {
    return {
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      widthModal: '80%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: '',
        fechaProgramacion: new Date()
      },
      programacionCirugiaEditarId: -5
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
      } else {
        this.widthModal = '80%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaCirgugias() {

    },
    abrirModalAgregar() {
      this.tituloModalAgregarEditar = 'REGISTRAR PROGRAMACION DE CIRUGIA'
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    cerrarModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.$nextTick(() => {
        this.tituloModalAgregarEditar = ''
        this.programacionCirugiaEditarId = -5
      })
    }
  }
}
</script>
