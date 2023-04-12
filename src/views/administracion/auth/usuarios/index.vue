<template>
  <div class="app-container">
    <el-card v-if="checkPermission(['usuarios.listar'])" class="box-card border-top-primary" shadow="never">
      <div slot="header" class="box-card-header">
        <h3 class="card-header">USUARIOS</h3>
      </div>
      <div style="position: relative;height: calc(100vh - 210px)">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card card-default">
              <div class="card-body">
                <div class="filter-container">
                  <el-select
                    v-model="listQuery.idrol"
                    placeholder="Seleccionar rol"
                    class="filter-item"
                    style="max-width: 180px"
                    clearable
                    @change="handleBuscarDatos"
                  >
                    <el-option
                      v-for="rol in listaRoles"
                      :key="rol.id"
                      :label="rol.name"
                      :value="rol.id"
                    />
                  </el-select>

                  <el-input
                    v-model="listQuery.keybuscar"
                    style="width: 300px"
                    placeholder="Buscar"
                    class="filter-item"
                    clearable
                    @keyup.enter.native="handleBuscarDatos"
                  />
                  <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleBuscarDatos"
                  >
                    <!-- Buscar -->
                  </el-button>

                  <!-- v-show="areaSeleccionadaId != ''" -->
                  <el-button
                    v-permission="['usuarios.crear']"
                    class="filter-item"
                    style="margin-left: 10px"
                    type="primary"
                    icon="el-icon-plus"
                    @click="openFormAgregar"
                  >
                    Agregar
                  </el-button>
                  <!-- icon="el-icon-plus" -->
                </div>

                <el-table
                  v-loading="listLoading"
                  :data="listaUsuarios"
                  border
                  height="calc(calc(100vh - 380px))"
                  fit
                  :row-class-name="tableRowClassName"
                  :header-row-class-name="tableHeaderRowClassName"
                  empty-text="No se han encontrado registros"
                >
                  <el-table-column align="center" label="NRO" width="55" prop="index" />
                  <el-table-column label="USUARIO" width="130" prop="name" />
                  <el-table-column label="ROL">
                    <template slot-scope="scope">
                      <span>{{ scope.row.rol_name }}</span>
                      <br>
                      <span class="span-info">{{ scope.row.email }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column align="center" label="ACCIONES" width="90">
                    <template slot-scope="scope">
                      <i
                        v-permission="['usuarios.editar']"
                        title="Modificar datos"
                        class="el-icon-edit-outline icon-btn-primary"
                        @click="openFormEditarClave(scope.row.id)"
                      />
                    </template>
                  </el-table-column>
                </el-table>

                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  layout="prev, pager, next"
                  @pagination="getListaUsuarios"
                />

                <!-- Dialog Formulario crear usuario  -->
                <el-dialog
                  :title="titleDialog"
                  :visible.sync="dialogFormVisible"
                  :close-on-click-modal="false"
                  width="85%"
                  top="5vh"
                >
                  <div v-loading="creandoUsuario" class="form-container pt-3">
                    <el-form
                      ref="formCrearUsuario"
                      :rules="reglasValidacion"
                      :model="modelUsuario"
                      label-position="top"
                      label-width="180px"
                      style="width: 100%"
                    >
                      <el-row :gutter="12">
                        <el-col :xs="24" :sm="12" :md="8">
                          <el-form-item label="Correo" prop="correo">
                            <el-input v-model="modelUsuario.correo" />
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8">
                          <el-form-item label="Usuario" prop="name">
                            <el-input v-model="modelUsuario.name" />
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8">
                          <el-form-item label="Rol" prop="rol_id">
                            <el-select
                              ref="idrol"
                              v-model="modelUsuario.rol_id"
                              placeholder="Selecione un rol"
                              clearable
                              filterable
                              style="width: 100%"
                            >
                              <el-option
                                v-for="rol in listaRoles"
                                :key="rol.id"
                                :label="rol.name"
                                :value="rol.id"
                              >
                                <span>{{ rol.name }}</span>
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8">
                          <el-form-item label="Clave" prop="clave">
                            <el-input v-model="modelUsuario.clave" />
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8">
                          <el-form-item
                            label="Confirmar clave"
                            prop="clave_confirm"
                          >
                            <el-input v-model="modelUsuario.clave_confirm" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer pt-3">
                      <el-row type="flex" class="row-bg" justify="end">
                        <el-button @click="dialogFormVisible = false">
                          Cancelar
                        </el-button>
                        <el-button
                          type="primary"
                          @click="guardarFormCrearUsuario()"
                        >
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
const rolesResource = new Resource('auth/usuarios/roles')
const usuariosResource = new Resource('auth/usuarios')

import permission from '@/directive/permission'
import checkPermission from '@/utils/permission' // Permission checking

export default {
  name: 'UsuariosLista',
  components: { Pagination },
  directives: { permission },
  data() {
    var checkPassword = (rule, value, callback) => {
      if (this.modelUsuario.id !== undefined) {
        callback()
      } else {
        if (!value) {
          return callback(new Error('El campo es obligatorio'))
        } else {
          callback()
        }
      }
    }
    var checkPassword2 = (rule, value, callback) => {
      if (this.modelUsuario.id !== undefined) {
        callback()
      } else {
        if (!value) {
          return callback(new Error('El campo es obligatorio'))
        } else if (value !== this.modelUsuario.clave) {
          callback(new Error('El campo Confirmar clave y Clave no coinciden'))
        } else {
          callback()
        }
      }
    }
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 14,
        keybuscar: '',
        idrol: ''
      },
      listaAreas: [],
      listaRoles: [],
      listaTrabajadores: [],
      listaUsuarios: [],
      listaCargos: [],
      listaPersonas: [],
      dialogFormVisible: false,
      dialogFormEditarVisible: false,
      creandoUsuario: false,
      buttonExportDisabled: false,
      buttonExportLoading: false,
      btnBuscarDNILoading: false,
      titleDialog: '',
      modelUsuario: {
        id: undefined,
        nro_documento: '',
        paterno: '',
        materno: '',
        nombre: '',
        correo: '',
        telefono: '',
        rol_id: undefined,
        name: '',
        // email: '',
        clave: '',
        clave_confirm: ''
      },
      reglasValidacion: {
        rol_id: [{ required: true, message: 'El campo es requerido', trigger: 'blur' }],
        name: [{ required: true, message: 'El campo es requerido', trigger: 'blur' }],
        correo: [
          { required: true, message: 'El campo es requerido', trigger: 'blur' },
          { type: 'email', message: 'Ingrese un correo válido', trigger: ['blur', 'change'] }
        ],
        clave: [{ validator: checkPassword, trigger: 'blur' }],
        clave_confirm: [{ validator: checkPassword2, trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  created() {
    this.getListaRoles()
    this.getListaUsuarios()
  },
  methods: {
    checkPermission,
    async getListaRoles() {
      const { data } = await rolesResource.list({})
      this.listaRoles = data
      this.listLoading = false
    },

    async getListaUsuarios() {
      const { limit, page } = this.listQuery
      this.listLoading = true
      const { data, meta } = await usuariosResource.list(this.listQuery)
      this.listaUsuarios = data
      this.listaUsuarios.forEach((element, index) => {
        element['index'] = (page - 1) * limit + index + 1
      })
      this.total = meta.total
      this.listLoading = false
    },

    llenarInputUsuarioFormularioCrear(value) {
      console.log(value)
      if (value !== null && value !== '' && value !== undefined) {
        const foundTrabajador = this.listaTrabajadores.find(
          (trabajador) => trabajador.persona_id === value
        )
        this.modelUsuario.dni = foundTrabajador.persona_nrodocumento
      } else {
        this.modelUsuario.dni = ''
      }
    },
    handleBuscarDatos() {
      this.listQuery.page = 1
      this.getListaUsuarios()
    },
    openFormAgregar() {
      this.titleDialog = 'Registrar usuario'
      this.resetFormAgregar()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['formCrearUsuario'].clearValidate()
      })
    },

    resetFormAgregar() {
      this.btnBuscarDNILoading = false
      this.modelUsuario = {
        id: undefined,
        nro_documento: '',
        paterno: '',
        materno: '',
        nombre: '',
        correo: '',
        telefono: '',
        rol_id: undefined,
        name: '',
        // email: '',
        clave: '',
        clave_confirm: ''
      }
    },
    guardarFormCrearUsuario() {
      this.$refs['formCrearUsuario'].validate((valid) => {
        if (valid) {
          this.creandoUsuario = true
          usuariosResource
            .store(this.modelUsuario)
            .then((response) => {
              this.$message({
                message: 'Datos guardados correctamente',
                type: 'success',
                duration: 5.6 * 1000
              })
              this.resetFormAgregar()
              this.dialogFormVisible = false
              this.handleBuscarDatos() // LLamamos a la funcion filtrar datos
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.creandoUsuario = false
            })
        } else {
          console.log('Error el formulario no es valido')
          return false
        }
      })
    },
    async openFormEditarClave(id) {
      this.titleDialog = 'Actuaizar datos'
      this.usuarioActualId = id
      this.creandoUsuario = true
      this.dialogFormVisible = true
      // const found = this.listaUsuarios.find((usuario) => usuario.id === id)
      const { data } = await usuariosResource.get(id)
      this.modelUsuario = {
        id: data.id,
        nro_documento: data.nro_documento,
        paterno: data.paterno,
        materno: data.materno,
        nombre: data.nombre,
        telefono: data.telefono,
        name: data.name,
        correo: data.email,
        dni: data.dni,
        rol_id: data.rol_id,
        rol_name: data.rol_name
      }
      this.creandoUsuario = false
      this.$nextTick(() => {
        this.$refs['formCrearUsuario'].clearValidate()
      })
    },
    guardarFormEditar() {
      this.$refs['formCrearUsuario'].validate((valid) => {
        if (valid) {
          console.log('Guardando datos del area')
          this.creandoUsuario = true

          usuariosResource
            .update(this.usuarioActualId, this.usuarioActual)
            .then((response) => {
              this.$message({
                message: 'Datos actualizados correctamente',
                type: 'success',
                duration: 5.6 * 1000
              })
              this.resetFormAgregar()
              this.dialogFormEditarVisible = false
              this.handleBuscarDatos() // LLamamos a la funcion filtrar datos
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.creandoUsuario = false
            })
        } else {
          console.log('Error el formulario no es valido')
          return false
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      return 'py-2'
    },
    tableHeaderRowClassName({ row, rowIndex }) {}
  }
}
</script>
