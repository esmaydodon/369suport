<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">TIPO DE PERSONAL</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listarTipoPersonal"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listarTipoPersonal"
          />
          <!-- v-permission="['permisos.crear']" -->
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-plus"
            @click="abrirModalAgregar"
          >
            Agregar
          </el-button>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              :data="data"
              height="calc(calc(100vh - 380px))"
              style="width: 100%"
            >
              <el-table-column
                header-align="center"
                align="center"
                type="index"
                label="#"
                width="100"
              />
              <el-table-column
                prop="nombre"
                label="TIPO DE PERSONAL"
                min-width="500"
              />
              <el-table-column
                header-align="center"
                align="center"
                prop="activo"
                label="OPCIONES"
                width="250"
              >
                <template slot-scope="scope">
                  <el-dropdown trigger="click" @command="handleCommand">
                    <el-button type="text" size="mini">OPCIONES <i class="el-icon-arrow-down el-icon--right" /></el-button>
                    <el-dropdown-menu>
                      <el-dropdown-item icon="el-icon-edit" :command="{command: 'EDITAR',id: scope.row.id}">EDITAR</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-remove" :command="{command: 'ELIMINAR',id: scope.row.id}">ELIMINAR</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
              @pagination="listarTipoPersonal"
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
      <agregar-editar-tipo-personal :tipo-personal-id="tipoPersonalEditar_Id" @close="cerrarModelaAgregarEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Componentes
import AgregarEditarTipoPersonal from './components/agregar_editar'
import Paginator from '@/components/Pagination'
// Resource
import TipoPersonalResource from '@/api/tipo_personal'
import Swal from 'sweetalert2'
const tipoPersonalResource = new TipoPersonalResource()
export default {
  name: 'Servicios',
  components: { AgregarEditarTipoPersonal, Paginator },
  data() {
    return {
      loading: false,
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      widthModal: '40%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      tipoPersonalEditar_Id: -1
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

    this.listarTipoPersonal()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listarTipoPersonal() {
      this.loading = true
      tipoPersonalResource.list(this.listQuery)
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
    abrirModalAgregar() {
      this.tituloModalAgregarEditar = 'REGISTRAR TIPO DE PERSONAL'
      this.tipoPersonalEditar_Id = -5
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    abrirModalEditar(tipoPersonalId) {
      this.tituloModalAgregarEditar = 'EDITAR TIPO DE PERSONAL'
      this.tipoPersonalEditar_Id = tipoPersonalId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    cerrarModelaAgregarEditar() {
      this.modalAgregarEditar = false
      this.listarTipoPersonal()
      this.$nextTick(() => {
        this.tituloModalAgregarEditar = ''
        this.tipoPersonalEditar_Id = -5
      })
    },
    eliminarTipoPersonal(tipoPersonalId) {
      Swal.fire({
        title: '¿Está seguro de eliminar el tipo de personal?',
        text: 'Si no se visualiza la información correcta se recomienda editar el tipo de personal, amenos que el tipo de personal nunca haya sido parte del HRDC',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          tipoPersonalResource.destroy(tipoPersonalId)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listarTipoPersonal()
              }
            )
            .catch(
              (error) => {
                console.log(error)
                this.loading = false
              }
            )
        } else {
          this.loading = false
        }
      })
    },
    handleCommand({ command, id }) {
      if (command === 'EDITAR') {
        this.abrirModalEditar(id)
      }
      if (command === 'ELIMINAR') {
        this.eliminarTipoPersonal(id)
      }
    }
  }

}
</script>
