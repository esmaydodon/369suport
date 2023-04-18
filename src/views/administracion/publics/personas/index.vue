<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <h3 class="card-header">ADMINISTRACIÓN DE PERSONAS</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <el-row :gutter="10">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="listaPersonas"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            @click="listaPersonas"
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
                prop="doc_identidad"
                label="NRO DOC DE IDENTIDAD"
                min-width="200"
              />
              <el-table-column
                prop="nombres"
                label="NOMBRE COMPLETO"
                min-width="450"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.nombres+' '+scope.row.apellido_paterno+' '+scope.row.apellido_materno }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="sexo"
                label="SEXO"
                min-width="100"
              />
              <el-table-column
                prop="telefono"
                label="TELÉFONO"
                min-width="100"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="OPCIONES"
                width="250"
              >
                <template slot-scope="scope">
                  <el-dropdown trigger="click" @command="handleCommand">
                    <el-button type="text" size="mini">
                      OPCIONES<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{command:'EDITAR',id:scope.row.id}" icon="el-icon-edit">Editar</el-dropdown-item>
                      <el-dropdown-item :command="{command:'ELIMINAR',id:scope.row.id}" icon="el-icon-delete-solid">Eliminar</el-dropdown-item>
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
              @pagination="listaPersonas"
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
      top="5vh"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- :before-close="dialogBeforeClose" -->
      <agregar-editar-persona :persona-id="personaEditar_Id" @close="closeModalAgregarEditar" />
    </el-dialog>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
import Swal from 'sweetalert2'
// Componentes
import AgregarEditarPersona from './components/agregar_editar'
import Paginator from '@/components/Pagination'
// Resource
import PersonasResource from '@/api/personas'
const personasResource = new PersonasResource()
export default {
  name: 'Personas',
  components: { AgregarEditarPersona, Paginator },
  data() {
    return {
      loading: false,
      data: [],
      tituloModalAgregarEditar: '',
      modalAgregarEditar: false,
      widthModal: '50%',
      listQuery: {
        total: 0,
        page: 1,
        limit: 14,
        keyword: ''
      },
      personaEditar_Id: -1
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.widthModal = '90%'
      } else {
        this.widthModal = '50%'
      }
    })
    window.addEventListener('resize', this.__resizeHandler)
    this.listaPersonas()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    listaPersonas() {
      this.loading = true
      personasResource.list(this.listQuery)
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
      this.tituloModalAgregarEditar = 'REGISTRAR PERSONA'
      this.personaEditar_Id = -5
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    handleCommand({ command, id }) {
      if (command === 'EDITAR') {
        this.abrirModalEditar(id)
      }
      if (command === 'ELIMINAR') {
        this.handleEliminarPersona(id)
      }
    },
    handleEliminarPersona(peronsa_id) {
      Swal.fire({
        title: '¿Está seguro de eliminar el registro de la persona?',
        text: 'Si no se visualiza la información correcta se recomienda editar el registro de la persona',
        icon: 'error',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: '#1e88e5',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          personasResource.destroy(peronsa_id)
            .then(
              (response) => {
                this.$message({
                  type: 'info',
                  message: response.message
                })
                this.loading = false
                this.listaPersonas()
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
    abrirModalEditar(personaId) {
      this.tituloModalAgregarEditar = 'EDITAR PERSONA'
      this.personaEditar_Id = personaId
      this.$nextTick(() => {
        this.modalAgregarEditar = true
      })
    },
    closeModalAgregarEditar() {
      this.modalAgregarEditar = false
      this.personaEditar_Id = -1
      this.listaPersonas()
    }
  }
}
</script>
