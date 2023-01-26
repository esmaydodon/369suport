<template>
  <div class="app-container">
    <el-card v-permission="['permisos.listar']" class="box-card border-top-primary" shadow="never">
      <div slot="header" class="box-card-header">
        <h3 class="card-header">PERMISOS</h3>
      </div>
      <div style="position:relative;">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card card-default">
              <div class="card-body">
                <div class="filter-container">
                  <el-input
                    v-model="listQuery.keybuscar"
                    placeholder="Buscar"
                    style="width: 300px"
                    class="filter-item"
                    clearable
                    @keyup.enter.native="handleBuscarDatos"
                  />
                  <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleBuscarDatos"
                  />
                  <el-button
                    v-permission="['permisos.crear']"
                    class="filter-item"
                    style="margin-left: 10px"
                    type="primary"
                    icon="el-icon-plus"
                    @click="openFormCrearArea"
                  >
                    Agregar
                  </el-button>
                </div>

                <el-table
                  v-loading="listLoading"
                  :data="list"
                  border
                  fit
                  :row-class-name="tableRowClassName"
                  :header-row-class-name="tableHeaderRowClassName"
                >
                  <el-table-column align="center" label="Nro" width="80">
                    <template slot-scope="scope">
                      <span>{{ scope.row.index }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="Nombre">
                    <template slot-scope="scope">
                      <span>{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="Tipo" width="130">
                    <template slot-scope="scope">
                      <span>{{ scope.row.guard_name }}</span>
                    </template>
                  </el-table-column>

                </el-table>

                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  layout="prev, pager, next"
                  @pagination="getLista"
                />

                <!-- Dialog Formulario crear persmiso  -->
                <el-dialog
                  :title="'Registrar permiso'"
                  :visible.sync="dialogFormVisible"
                  :close-on-click-modal="false"
                  width="85%"
                  top="5vh"
                >
                  <div v-loading="creandoPermiso" class="form-container">
                    <el-form
                      ref="areaFormCrear"
                      :rules="reglasValidacion"
                      :model="nuevoPermiso"
                      label-position="top"
                      label-width="150px"
                      style="width: 100%"
                    >
                      <el-form-item label="Nombre" prop="name">
                        <el-input ref="nombre" v-model="nuevoPermiso.name" />
                      </el-form-item>

                      <el-form-item label="Tipo" prop="guard_name">
                        <el-input v-model="nuevoPermiso.guard_name" readonly />
                      </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-row type="flex" class="row-bg" justify="end">
                        <el-button @click="dialogFormVisible = false">
                          Cancelar
                        </el-button>
                        <el-button type="primary" @click="guardarRolFormCrear()">
                          Guardar
                        </el-button>
                      </el-row>
                    </div>
                  </div>
                </el-dialog>

                <!-- Dialog Formulario editar permiso  -->
                <el-dialog
                  :title="'Modificar datos de rol'"
                  :visible.sync="dialogFormEditarVisible"
                  :close-on-click-modal="false"
                  width="85%"
                  top="5vh"
                >
                  <div v-loading="creandoPermiso" class="form-container">
                    <el-form
                      ref="rolFormEditar"
                      :rules="reglasValidacion"
                      :model="permisoActual"
                      label-position="top"
                      label-width="150px"
                      style="max-width: 100%"
                    >
                      <el-form-item label="Nombre" prop="name">
                        <el-input ref="name" v-model="permisoActual.name" />
                      </el-form-item>

                      <el-form-item label="Guard name" prop="guard_name">
                        <el-input v-model="permisoActual.guard_name" />
                      </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-row type="flex" class="row-bg" justify="end">
                        <el-button @click="dialogFormEditarVisible = false">
                          Cancelar
                        </el-button>
                        <el-button type="primary" @click="rolFormEditar()">
                          Guardar
                        </el-button>
                      </el-row>
                    </div>
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Resource from '@/api/resource'
import permission from '@/directive/permission'
const areasResource = new Resource('auth/permisos')

export default {
  name: 'PermisosLista',
  directives: { permission },
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 7,
        keybuscar: ''
      },
      dialogFormVisible: false,
      dialogFormEditarVisible: false,
      creandoPermiso: false,
      nuevoPermiso: {
        'name': undefined,
        'guard_name': 'api'
      },
      permisoActualId: 0,
      permisoActual: {
        name: '',
        guard_name: ''
      },
      reglasValidacion: {
        name: [
          {
            required: true,
            message: 'El campo nombre es requerido',
            trigger: 'blur'
          }
        ],
        guard_name: [
          {
            required: true,
            message: 'El campo Guard name es requerido',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {},
  created() {
    this.getLista()
  },
  methods: {
    async getLista() {
      const { limit, page } = this.listQuery
      this.listLoading = true
      const { data, meta } = await areasResource.list(this.listQuery)
      this.list = data
      this.list.forEach((element, index) => {
        element['index'] = (page - 1) * limit + index + 1
      })
      this.total = meta.total
      this.listLoading = false
    },
    handleBuscarDatos() {
      this.listQuery.page = 1
      this.getLista()
    },
    openFormCrearArea() {
      this.resetnuevoPermiso()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['areaFormCrear'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['nombre'].focus()
      })
    },

    resetnuevoPermiso() {
      this.nuevoPermiso = {
        name: '',
        guard_name: 'api'
      }
    },
    guardarRolFormCrear() {
      this.$refs['areaFormCrear'].validate((valid) => {
        if (valid) {
          this.creandoPermiso = true
          areasResource
            .store(this.nuevoPermiso)
            .then((response) => {
              this.$message({
                message: 'Datos guardados correctamente',
                type: 'success',
                duration: 5.6 * 1000
              })
              this.resetnuevoPermiso()
              this.dialogFormVisible = false
              this.handleBuscarDatos() // LLamamos a la funcion filtrar datos
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.creandoPermiso = false
            })
        } else {
          console.log('Error el formulario no es valido')
          return false
        }
      })
    },
    async openFormEditarPermiso(id) {
      this.permisoActualId = id
      this.creandoPermiso = true
      this.dialogFormEditarVisible = true
      const { data } = await areasResource.get(id)
      this.permisoActual = {
        id: data.id,
        name: data.name,
        guard_name: data.guard_name
      }
      this.creandoPermiso = false
      this.$nextTick(() => {
        this.$refs['rolFormEditar'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['name'].focus()
      })
    },
    rolFormEditar() {
      this.$refs['rolFormEditar'].validate((valid) => {
        if (valid) {
          console.log('Guardando datos del area')
          this.creandoPermiso = true

          areasResource
            .update(this.permisoActualId, this.permisoActual)
            .then((response) => {
              this.$message({
                message: 'Datos actualizados correctamente',
                type: 'success',
                duration: 5.6 * 1000
              })
              this.resetnuevoPermiso()
              this.dialogFormEditarVisible = false
              this.handleBuscarDatos() // LLamamos a la funcion filtrar datos
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.creandoPermiso = false
            })
        } else {
          console.log('Error el formulario no es valido')
          return false
        }
      })
    },
    accionAreaEliminar(id, nombre) {
      this.$confirm(
        'Seguro que desea eliminar el registro: ' + nombre + '?',
        'Atención',
        {
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }
      )
        .then(() => {
          areasResource
            .destroy(id)
            .then((respode) => {
              this.$message({
                type: 'success',
                message: 'Registro eliminado'
              })
              this.handleBuscarDatos()
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Operación cancelada'
          })
        })
    },
    tableRowClassName({ row, rowIndex }) {
      return 'py-2'
    },

    tableHeaderRowClassName({ row, rowIndex }) {}
  }
}
</script>
